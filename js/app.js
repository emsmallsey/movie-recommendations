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

//RECIPE CAROUSEL

$('#list-carousel').carousel({
    interval: 10000
  })
  
  function multiCarousel() {
  $('.carousel .carousel-item').each(function(){
      const minPerSlide = 3;
      let next = $(this).next();
      if (!next.length) {
      next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
      
      for (var i=0;i<minPerSlide;i++) {
          next=next.next();
          if (!next.length) {
              next = $(this).siblings(':first');
            }
          
          next.children(':first-child').clone().appendTo($(this));
        }
  })};


  //Add to my List

function addMyList(_imdbID, _posterPath, _possibleTitles) {
    $('#my-list-items').prepend(`
                <div class="carousel-item">
                    <div class="col-md-4">
                        <div class="card card-body" id="${_imdbID}">
                            <img class="img-fluid" src="${_posterPath}" alt="${_possibleTitles}">
                        </div>
                    </div>
                </div>
            `)
}

// ***** On Ready *****
$(() => {
    //multiCarousel();
    // !!! On Search Click !!!
    $("#search-btn").on('click', async() => { 
       
        $("#searched-results").children().remove();
        //$("#similar-car").children().remove();
        $("#possible-titles").append(`<h1>Search Results</h1>`);

        let searched = $("#title-input").val();
        const idQuery = await queryAPI(searched); 
      
        for(let i=0; i<3; i++) {
        
        //!!! Drawing Search Results !!!
            const searchedTitles = idQuery.results[i].name;
            let searchedPosters = idQuery.results[i].poster_path;
            const imdbID = idQuery.results[i].id; 
            let searchedPosterPath;

            if(searchedPosters === null) {
                searchedPosterPath = "no-image-avail.png"; 
            } else {
                searchedPosterPath = `https://image.tmdb.org/t/p/w200${searchedPosters}`
            }
        
            $('#searched-results').append(`
                        <div id="${imdbID}" class="searched-posters">
                            <img class="card-img" src="${searchedPosterPath}" alt="${searchedTitles}">
                        </div>
            `)
        
            // !!! Drawing Similar Results !!!        
            $(`#${imdbID}`).on('click', (async() => {
                console.log('clicked');
                $("#similar-carousel-items").children().remove();
                //$("#similar-titles").append(`<h1>Similar Shows</h1>`);
                const similarResults = await querySimilar(imdbID);
       
                if (similarResults.results.length === 0) {
                $("#similar-posters").append(`<p>No Similar shows found</p>`)
                } else {
                    for(let i=0; i<similarResults.results.length; i++) {
                        const similarTitles = similarResults.results[i].name;
                        let similarPosters = similarResults.results[i].poster_path;
                        const similarOverview = similarResults.results[i].overview;
                        const similarRatings = similarResults.results[i].vote_average;
                        let similarPosterPath;

                        if(similarPosters === null) {
                            similarPosterPath = "no-image-avail.png"; 
                        } else {
                            similarPosterPath = `https://image.tmdb.org/t/p/w500${similarPosters}`
                        }

                        $("#similar-carousel-items").append(`
                            <div class="carousel-item">
                                <div class="card mb-3" style="max-width: 540px;">
                                    <div class="row no-gutters">
                                        <div class="col-md-4">
                                            <img src="${similarPosterPath}" class="card-img d-block w-100" alt="${similarTitles}">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">${similarTitles}</h5>
                                                <p class="card-text">${similarOverview}</p>
                                                <p class="card-text"><small class="text-muted">Rating: ${similarRatings}/10</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        `);
                    }   
                }
        }));
        

        }
        //multiCarousel();
})})


// <div class="card bg-dark text-white" data-toggle="collapse" data-target="#collapse-material" aria-expanded="false" aria-controls="collapse-material">
// <img src="https://image.tmdb.org/t/p/w500${similarResults.results[i].poster_path}" class="card-img" alt="...">
// <div class="card-img-overlay">
//  <p class="card-text collapse" id="collapse-material">${similarResults.results[i].overview}</p>
// </div>
// </div>