//Initial API Query for the external ID by title search

//API Similar movies Query with the movie id

// //draw results

async function queryAPI(titleSearched) {

    const encoded = encodeURI(titleSearched);

    const response = await $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&query=${encoded}`).catch(e => console.log(e));
    console.log(response);
    return response;
}

async function querySimilar(imdbID) {
    console.log(imdbID)
    const response = await $.ajax(`https://api.themoviedb.org/3/movie/${imdbID}/similar?api_key=603bffa838e391fe488a58c7e6fd99fe&language=en-US&page=1`).catch(e => console.log(e));
    console.log(response);
    return response;
}

//on ready
$(() => {

    $("#search-btn").on('click', async() => { 
    $("#possible-titles").children().remove();
    $("#similar-titles").children().remove();
    let searched = $("#title-input").val();
    
    const idQuery = await queryAPI(searched); 

    for(let i=0; i<6; i++) {
        const possibleTitles = idQuery.results[i].title;
        const possiblePosters = idQuery.results[i].poster_path;
        const imdbID = idQuery.results[i].id;
        options = $("#possible-titles").append(`
                        <div class="card bg-dark text-white">
                        <img src="https://image.tmdb.org/t/p/w500${possiblePosters}" class="card-img" alt="...">
                        <div class="card-img-overlay">
                            <button id=${imdbID} class="btn btn-primary" type="button" >${possibleTitles}</button>
                        </div>
                        </div>
        
        
        
        
        `);
     
    $(`#${imdbID}`).on('click', (async() => {
        $("#similar-titles").children().remove();
        const similarResults = await querySimilar(imdbID);
        for(let i=0; i<similarResults.results.length; i++) {
        $("#similar-titles").append(`
                    <div class="card bg-dark text-white">
                        <img src="https://image.tmdb.org/t/p/w500${similarResults.results[i].poster_path}" class="card-img" alt="...">
                        <div class="card-img-overlay">
                            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse-material" aria-expanded="false" aria-controls="collapse-material">${similarResults.results[i].original_title}</button>
                            <p class="card-text collapse" id="collapse-material">${similarResults.results[i].overview}</p>
                        </div>
                    </div>
                `);
        console.log(similarResults.results[i].original_title)
        }
    }));
        
    }

})})

//<p>${similarResults.results[i].original_title}


//*****************TO DO /*

// create an if statement for if the array of similar results is 0
// create an if statement for if the picture isn't there
