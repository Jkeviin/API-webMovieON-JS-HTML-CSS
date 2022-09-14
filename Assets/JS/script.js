// asignacion de variables
const input_search = document.getElementById("search");
const moviesContainer = document.querySelector('.containerMovies');
const NavBar = document.querySelectorAll('.Options');
const filtroGenero = document.querySelector('.genderFilter');

// variables
let GenerActual = "";

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

// evento inicial
window.addEventListener("DOMContentLoaded", () => {
  SearchTrending("all");
  eventClickGener();
});

// evento click
NavBar.forEach(nav => {
  nav.addEventListener('click', () => {
    NavBar.forEach(nav => nav.classList.remove('active'));
    nav.classList.add('active');
    switch (nav.id) {
      case 'book':
        SearchBook("programacion")
        break;
      case 'all':
        SearchTrending(nav.id);
        filtroGenero.innerHTML = `  <h3>GÉNERO</h3>
        <li class="generos" id="16">Animación</li>
        <li class="generos" id="35">Comedia</li>
        <li class="generos" id="80">Crimen</li>
        <li class="generos" id="99">Documental</li>
        <li class="generos" id="18">Drama</li>
        <li class="generos" id="10751">Familia</li>
        <li class="generos" id="9648">Misterio</li>
        <li class="generos" id="37">Western</li>`
        eventClickGener();
        break;
      default:
        SearchTrending(nav.id);
        Genero(nav.id);
        break;
    }
    // limpiar input
    input_search.value = '';
    // cambiar atributo categoria de search
    input_search.setAttribute('category', nav.id);
    // cambiar placeholder
    input_search.setAttribute('placeholder', `Buscar ${nav.id}`);
    // Desactivar modo genero
    GenerActual = "";
  });
});

const eventClickGener = () =>{
  const Geners = document.querySelectorAll('.generos');
  Geners.forEach(genero => {
    genero.addEventListener('click', () => {
      if(input_search.getAttribute('category') === 'all'){
        JuntarSearch("movie", "tv", genero.id);
      }
      else{
      SearchGenres(input_search.getAttribute("category"), genero.id);
      }
      //Limpiar input
      input_search.value = '';
      // Activar modo genero
      GenerActual = genero.id;
    });
  });
}

// eventos keyup
input_search.addEventListener("keyup", () => {

  if (input_search.value === '') {
    SearchTrending(document.querySelector('.active').id);
    return;
  }
  if (input_search.getAttribute("category") === "book") {
    SearchBook(input_search.value);
    return;
  }

  search(input_search.getAttribute("category") === "all" ? "multi" : input_search.getAttribute("category"), GenerActual === "" ? "" : GenerActual);
});



//* ///////// Buscar ///////////// *//

const SearchGenres = (type, id) => {
  const URL = `https://api.themoviedb.org/3/discover/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&sort_by=popularity.desc&include_video=false&page=1&with_genres=${id}&include_adult=false`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => Show(data))
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

// Buscar Populares
const SearchTrending = (type) => {
  const URL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&page=1&include_adult=false`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => Show(data))
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

// Peliculas || Series || all
const search = (type, genero) => {
  const busqueda = input_search.value;
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&sort_by=popularity.desc&query=${busqueda}&page=1&include_adult=false${genero === "" ? "" : "&with_genres=" + genero}`;
  console.log(URL);
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => Show(data))
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

// Buscar libros
const SearchBook = (search) => {
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=20&langRestrict=es`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => {
      if (data.totalItems === 0) {
        moviesContainer.innerHTML = '<h1>No se encontraron resultados</h1>'
        return;
      }
      ShowBook(data)
    })
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

//* ///////////// Mostrar //////////////

// Mostrar peliculas || series || all
const Show = (data) => {
  const movies = data.results
  moviesContainer.innerHTML = ''
  movies.forEach(movie => {
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


// Juntar busqueda de peliculas y series
const JuntarSearch = (type1, type2, id) => {
    const url = `https://api.themoviedb.org/3/discover/${type1}?api_key=1f54bd990f1cdfb230adb312546d765d&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${id}`;
    const url2 = `https://api.themoviedb.org/3/discover/${type2}?api_key=1f54bd990f1cdfb230adb312546d765d&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${id}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        fetch(url2, options)
          .then(response => response.json())
          .then(data2 => {
            const movies = [];
            for (let i = 0; i < data.results.length; i++) {
              movies.push(data.results[i]);
              movies.push(data2.results[i]);
            }
            moviesContainer.innerHTML = '';
            movies.forEach(movie => {
              const { title, name, poster_path, vote_average, id } = movie;
              if(poster_path){
                moviesContainer.innerHTML += `
                <div class="target">
                <img class="imageMovie" src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title ? title : name}">
                <p class="yearMovie">${vote_average}</p>
                <p class="nameMovie">${title ? title : name}</p></div>`
              }
            });
          });
      });
  }
/* ------------------------------------------------------------- */
// Mostrar generos
const Genero = (type) => {
  document.getElementById("cargando").style.display = "block";
  fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&include_adult=false`, options)
    .then(response => response.json())
    .then(data => {
      const generos = data.genres
      filtroGenero.innerHTML = '<h3>GÉNERO</h3>'
      generos.forEach(genero => {
        // se puede modificar solo para 8 generos
        filtroGenero.innerHTML += `
          <li class="genero" onclick="SearchGenres('${input_search.getAttribute("category")}', ${genero.id})">${genero.name}</li>
        `
      });
      eventClickGener();
    })
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

