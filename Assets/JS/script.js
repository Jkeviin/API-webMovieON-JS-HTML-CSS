// asignacion de variables
const input_search = document.getElementById("search");
const moviesContainer = document.querySelector('.containerMovies');
const NavBar = document.querySelectorAll('.Options');
const filtroGenero = document.querySelector('.genderFilter');

// evento inicial
window.addEventListener("DOMContentLoaded", () => {
  Genero("movie");
  SearchTrending("all")
});

// evento click
NavBar.forEach(nav => {
  nav.addEventListener('click', () => {
    NavBar.forEach(nav => nav.classList.remove('active'));
    nav.classList.add('active');
    if (nav.id === 'book') {
      SearchBook("programacion")
    } else {
      SearchTrending(nav.id);
      Genero(nav.id);
    }
    // limpiar input
    input_search.value = '';
    // cambiar atributo categoria de search
    input_search.setAttribute('category', nav.id);
    // cambiar placeholder
    input_search.setAttribute('placeholder', `Buscar ${nav.id}`);
  });
});

// eventos keyup
input_search.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (input_search.value === '') {
    SearchTrending(nav.id)
    return;
  }
  if (input_search.getAttribute("category") === "book") {
    SearchBook(input_search.value);
    return;
  }
  search(input_search.getAttribute("category") === "all" ? "multi" : input_search.getAttribute("category"));
});

// Opciones de busqueda
const options = {
  method: 'GET',  // Identificar tipo de envio
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  redirect: 'follow', // manual, *follow, error
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json charset=utf-8' // Identificar tipo de contenido,
  },
  referrerPolicy: 'no-referrer'
}

//* ///////// Buscar ///////////// *//

// Buscar Populares
const SearchTrending = (type) => {
  const URL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&page=1`;
  fetch(URL, options)
    .then(response => response.json())
    .then(data => Show(data))
    .catch(error => console.log(error))
}

// Peliculas || Series || all
const search = (type) => {
  const busqueda = input_search.value
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&query=${busqueda}&page=1&include_adult=false`;
  fetch(URL, options)
    .then(response => response.json())
    .then(data => Show(data))
    .catch(error => console.log(error))
}

// Buscar libros
const SearchBook = (search) => {
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=20&langRestrict=es`;
  fetch(URL, options)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.totalItems === 0) {
        moviesContainer.innerHTML = '<h1>No se encontraron resultados</h1>'
        return;
      }
      ShowBook(data)
    })
    .catch(error => console.log(error))
}

//* ///////////// Mostrar //////////////

// Mostrar peliculas || series || all
const Show = (data) => {
  const movies = data.results
  moviesContainer.innerHTML = ''
  movies.forEach(movie => {
    // redondear calificacion
    if (movie.poster_path && movie.media_type !== "person") {
      const vote = movie.vote_average.toFixed(1)
      const titulo = movie.title ? movie.title : movie.name;
      moviesContainer.innerHTML += `
      <div class="target">
          <img class="imageMovie" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <p class="yearMovie">${vote}</p>
      <p class="nameMovie">${titulo}</p></div>`
    }
  });
  if(moviesContainer.innerHTML === ''){
    moviesContainer.innerHTML = '<h1>No se encontraron resultados</h1>'
  }
}

// mostrar libros
const ShowBook = (data) => {
  const books = data.items
  moviesContainer.innerHTML = ''
  books.forEach(book => {
    moviesContainer.innerHTML += `
      <div class="target">
          <img class="imageMovie" src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.title}">
      <p class="nameMovie">${book.volumeInfo.title}</p></div>`
  });
}

// Mostrar generos
const Genero = (type) => {
  fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX`, options)
    .then(response => response.json())
    .then(data => {
      const generos = data.genres
      filtroGenero.innerHTML = '<h3>GÉNERO</h3>'
      generos.forEach(genero => {
        // se puede modificar solo para 8 generos
        filtroGenero.innerHTML += `
          <li>${genero.name}</li>
        `
      });
    })
}



// filtrar por genero
const filterGender = () => {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=48`, options)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    }
    )
}
filterGender()