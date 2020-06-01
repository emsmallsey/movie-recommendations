// ****** API Title Search ******
async function queryAPI(titleSearched) {
    const encoded = encodeURI(titleSearched);
    const response = await $.ajax(`https://api.themoviedb.org/3/search/tv?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&query=${encoded}`).catch(e => console.log(e));
    console.log(response);
    return response;
}
// ***** API Similar Movies Search *****
async function querySimilar(imdbID) {
    console.log(imdbID)
    const response = await $.ajax(`https://api.themoviedb.org/3/tv/${imdbID}/similar?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&page=1`).catch(e => console.log(e));
    console.log(response);
    return response;
}

function drawSimilarResults(_similarResults) {
    if (_similarResults.results.length === 0) {
        $("#similar-posters").append(`<p>No Similar shows found</p>`);
    } else {
        
        for(let i=0; i<5; i++) {
            const similarTitles = _similarResults.results[i].name;
            let similarPosters = _similarResults.results[i].poster_path;
            const similarOverview = _similarResults.results[i].overview;
            const similarRatings = _similarResults.results[i].vote_average;
            const simID = _similarResults.results[i].id;
             let similarPosterPath;

                    if(similarPosters === null) {
                        similarPosterPath = "no-image-avail.png"; 
                    } else {
                        similarPosterPath = `https://image.tmdb.org/t/p/w500${similarPosters}`
                    };

                    $("#similar-carousel-items-wrapper").prepend(`
                        <div class="carousel-item">
                            <div class="card mb-3" style="max-width: 690px;">
                                <div class="row no-gutters">
                                    <div class="col-md-4">
                                        <img src="${similarPosterPath}" class="card-img d-block" alt="${similarTitles}">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${similarTitles}</h5>
                                            <p class="card-text">${similarOverview}</p>
                                            <p class="card-text"><small class="text-muted">Rating: ${similarRatings}/10</small></p>
                                            <button type="button" class="btn btn-outline-dark" id=${simID}>Add to Watch Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    `);

                    $(`#${simID}`).on('click', (() => {
                        console.log('watch');
                        addMyList(similarPosterPath, similarTitles);
                        
                    }))
                }  
    }
}

function addMyList(_posterPath, _possibleTitles) {
    console.log("watch")
    $(".watch-next-items").append(`
                <a href="https://www.netflix.com/search?q=${_possibleTitles}" target="new window">
                <img src="${_posterPath}" class="card-img watch-next-img"  alt="${_possibleTitles}" max-width="100px">
                </a>
            `)
}

// ***** On Ready *****
$(() => {

    $("#search-btn").on('click', async() => { 
        
        $("#searched-results").children().remove();
        await $(".first").addClass("active");
        $("#similar-carousel-items-wrapper").empty();
        $("#watch-next-heading").empty();

        let searched = $("#title-input").val();
        const idQuery = await queryAPI(searched); 

        const searchedTitles = idQuery.results[0].name;
        
        const imdbID = idQuery.results[0].id; 
        
        $('#searched-results').append(`<h2 id="search-heading">Similar shows for ${searchedTitles}</h2>`)
        
        const similarResults = await querySimilar(imdbID);
        $("#watch-next-heading").append(`<h2>Watch Next</h2>`);
        drawSimilarResults(similarResults);
        
        })
    });
    