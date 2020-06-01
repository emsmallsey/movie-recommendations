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
    $(".watch-next-items").prepend(`
                <img src="${_posterPath}" class="card-img"  alt="${_possibleTitles}" max-width="100px">
            `)
            
}

// ***** On Ready *****
$(() => {

    
    // !!! On Search Click !!!
    $("#search-btn").on('click', async() => { 
        
        $("#searched-results").children().remove();
        await $(".first").addClass("active");
        $("#similar-carousel-items-wrapper").empty();

        let searched = $("#title-input").val();
        const idQuery = await queryAPI(searched); 

        const searchedTitles = idQuery.results[0].name;
        
        const imdbID = idQuery.results[0].id; 
        
        $('#searched-results').append(`<h2 id="search-heading">Similar shows for ${searchedTitles}</h2>`)
        
        const similarResults = await querySimilar(imdbID);
        $(".watch-next-heading").append(`<h2>Watch Next</h2>`);
        drawSimilarResults(similarResults);
        
        
        
        })
        
    });
        
        
        
// <div class="card bg-dark text-white" data-toggle="collapse" data-target="#collapse-material" aria-expanded="false" aria-controls="collapse-material">
// <img src="https://image.tmdb.org/t/p/w500${similarResults.results[i].poster_path}" class="card-img" alt="...">
// <div class="card-img-overlay">
//  <p class="card-text collapse" id="collapse-material">${similarResults.results[i].overview}</p>
// </div>
// </div>




// for(let i=0; i<3; i++) {
        
//     //!!! Drawing Search Results !!!
//         const searchedTitles = idQuery.results[i].name;
//         let searchedPosters = idQuery.results[i].poster_path;
//         const imdbID = idQuery.results[i].id; 
//         let searchedPosterPath;

//         if(searchedPosters === null) {
//             searchedPosterPath = "no-image-avail.png"; 
//         } else {
//             searchedPosterPath = `https://image.tmdb.org/t/p/w200${searchedPosters}`
//         }
    
//         $('#searched-results').append(`
//                     <div id="${imdbID}" class="searched-posters">
//                         <img class="card-img" src="${searchedPosterPath}" alt="${searchedTitles}">
//                     </div>
//         `)
    
//         // !!! Drawing Similar Results !!!        
//         $(`#${imdbID}`).on('click', (async() => {
//             console.log('clicked');



// let searchedPosters = idQuery.results[0].poster_path;
// let searchedPosterPath;
// if(searchedPosters === null) {
//     searchedPosterPath = "no-image-avail.png"; 
// } else {
//     searchedPosterPath = `https://image.tmdb.org/t/p/w200${searchedPosters}`
// }