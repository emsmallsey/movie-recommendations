
async function queryAPI(titleSearched) {

    const encoded = encodeURI(titleSearched);

    const response = await $.ajax(`https://api.themoviedb.org/3/search/tv?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&query=${encoded}`).catch(e => console.log(e));
    console.log(response);
    return response;
}

async function querySimilar(imdbID) {
    console.log(imdbID)
    const response = await $.ajax(`https://api.themoviedb.org/3/tv/${imdbID}/similar?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&page=1`).catch(e => console.log(e));
    console.log(response);
    return response;
}

//on ready
$(() => {

    $("#search-btn").on('click', async() => { 
    $("#possible-titles").children().remove();
    $("#similar-titles").children().remove();
    $("#possible-titles").append(`<h1>Search Results</h1>`);
    let searched = $("#title-input").val();
    
    const idQuery = await queryAPI(searched); 

    for(let i=0; i<6; i++) {
        const possibleTitles = idQuery.results[i].name;
        let possiblePosters = idQuery.results[i].poster_path;
        const imdbID = idQuery.results[i].id;
        // if (idQuery.results[i].poster_path = null) {
        //     let possiblePosterSrc = "images";
        // }
        let posterPath;
        if(possiblePosters === null) {
            posterPath = "no-image-avail.png"; 
        }
        else {
            posterPath = `https://image.tmdb.org/t/p/w200${possiblePosters}`
        }
        options = $("#possible-titles").append(`
                        <div class="card bg-dark text-white" id=${imdbID}>
                        <img src=${posterPath}  class="card-img"  alt="${possibleTitles}">                      
                        </div>
        `);
        console.log(options);


    $(`#${imdbID}`).on('click', (async() => {
        console.log('clicked');
        $("#similar-titles").children().remove();
        $("#similar-titles").append(`<h1>Similar Shows</h1>`);
        const similarResults = await querySimilar(imdbID);
        if (similarResults.results.length === 0) {
            $("#similar-titles").append(`<p>No Similar shows found</p>`)
        }
        else {
        for(let i=0; i<similarResults.results.length; i++) {
        $("#similar-titles").append(`
                    <div class="card bg-dark text-white" data-toggle="collapse" data-target="#collapse-material" aria-expanded="false" aria-controls="collapse-material">
                        <img src="https://image.tmdb.org/t/p/w500${similarResults.results[i].poster_path}" class="card-img" alt="...">
                        <div class="card-img-overlay">
                            
                            <p class="card-text collapse" id="collapse-material">${similarResults.results[i].overview}</p>
                        </div>
                    </div>
                `);
        }
        console.log(similarResults.results[i].name)
        }
    }));
        
    }

})})





// {/* <div class="card-img-overlay">
//                             <button  class="btn btn-primary" type="button" >${possibleTitles}</button>
//                         </div> */}

/* <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse-material" aria-expanded="false" aria-controls="collapse-material">${similarResults.results[i].name}</button> */