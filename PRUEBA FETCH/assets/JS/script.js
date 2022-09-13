const options = {
    method: 'GET',  // Identificar tipo de envio
    headers: {
        'Content-Type': 'application/json charset=utf-8'
        // youtube api key
        // 
    }
}
/* 
fetch("https://api.themoviedb.org/3/configuration?api_key=80d3d3959ac69af0ed72952812957afc", options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error)) */



 fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=80d3d3959ac69af0ed72952812957afc&language=es-ES', options)
    .then(response => response.json())
    .then(data => API(data))
    .catch(error => console.log(error)) 

fetch('https://api.themoviedb.org/3/movie/popular?api_key=80d3d3959ac69af0ed72952812957afc&language=es-ES', options)
    .then(response => response.json())
    .then(data => API(data))
    .catch(error => console.log(error))


fetch('https://api.themoviedb.org/3/movie/616037/videos?api_key=80d3d3959ac69af0ed72952812957afc&language=en-US', options)
    .then(response => response.json())
    .then(data => ReproducirTrailer(data))
    .catch(error => console.log(error))

const ReproducirTrailer = (data) => {
    const video = data.results[0].key
    const iframe = document.getElementById('iframe')
    iframe.src = `https://www.youtube.com/embed/${video}?autoplay=1&loop=1&playlist=${video}`
}

const API = (data) => {
    const movies = data.results
    const moviesContainer = document.querySelector('.movies-container')
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        const titulo = movie.title ? movie.title : movie.name;
        movieCard.innerHTML = `
            <div class="target">
                <img class="imageMovie" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <p class="yearMovie">${movie.vote_average}</p>
            <p class="nameMovie">${titulo}</p></div>
        `
        moviesContainer.appendChild(movieCard)
    })
}

