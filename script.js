let movies = [];
const movieGridElement = document.querySelector("#movies-grid")
const searchBarElement = document.querySelector("#search")
const searchParamElement = document.querySelector("#search-param")
const loadPagesElement = document.querySelector("#loading-pages")
let page = 1
const clearButtonElement = document.querySelector("#clear")



async function movieFetch() {
    try {
        let response = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=37cc0cbdaac624f489425d7c02626f31")
        if (!response.ok) {
            alert("Error: " + response.status)
            return;
        }
        movies = await response.json()
        movies = movies.results
        console.log(movies)
        return true;
    }
    catch (e) {
        alert("error contacting server: ")
    }
}

function MakeMovieCard(movie, movieGridElement) {
    movieGridElement.innerHTML += `<div class ="container">
    <input type="checkbox" class ="box"id="${movie.id}"/>
    <label for="${movie.id}">
    <div class="flip-card active">
    <div class="flip-card-inner">
        <div class="movie-card">
            <h2 id="title"> ${movie.title} </h2>
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" id="pic" alt="poster of ${movie.title}">
            <h3 id="vote"> Rating: ${movie.vote_average} </h3>
        </div>
        <div class="flip-card-back" id="id-${movie.id}">
      <h2 id="title">${movie.title}</h2> 
      <p id="overview">${movie.overview}</p> 
      <p id="vote-pt2">Average rating of ${movie.vote_average} by ${movie.vote_count} people</p>
    </div>
    </div>
    </div>
    <label>
    </div>
    `
}

async function pageFetch() {
    console.log("hi")
    page +=1
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=37cc0cbdaac624f489425d7c02626f31&page=${page}`)
    let data = await response.json()
    data.results.forEach( m => {
        MakeMovieCard(m, movieGridElement);
        movies.push(m);
        // videoFetch(m.id); (adding videos to every card makes it too slow)
    })
    return true;

}

async function searchFetch(searchParams) {
    if (!searchParams) return;
    try {
        console.log(searchParams)
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=37cc0cbdaac624f489425d7c02626f31&language=en-US&query=${searchParams}`);
        searchResults = await response.json()
        let searchMovies = searchResults.results
        console.log(searchMovies)
        movieGridElement.innerHTML = ``;
        searchMovies.forEach(m => MakeMovieCard(m, movieGridElement))
    }
    catch (e) {
        alert("error contacting server")
    }
}

async function videoFetch(id) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=37cc0cbdaac624f489425d7c02626f31&language=en-US`);
    let vidLink = await response.json()
    let trailer_id = ""
    vidLink.results.forEach(e => {
        if (e.type === "Trailer") {
            trailer_id=e.key
        }
    })
    document.querySelector(`#id-${id}`).innerHTML += `
    <iframe width="400" height="225" id="vidsize" src="https://www.youtube.com/embed/${trailer_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
}


window.onload = function () {
    movieFetch().then(data => {
        movies.forEach(m => {
            MakeMovieCard(m, movieGridElement);
            videoFetch(m.id)
        })
    });
    loadPagesElement.onclick = () => pageFetch();
    searchBarElement.onclick = (e) => {
        e.preventDefault();
        searchFetch(searchParamElement.value)
    }
    clearButtonElement.onclick = () => {
        searchParamElement.value = ""
        movieGridElement.innerHTML = ``;
        movies.forEach(m => MakeMovieCard(m, movieGridElement))
        
    }
}