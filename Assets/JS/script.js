// asignacion de variables
const input_search = document.getElementById("search");
const moviesContainer = document.querySelector('.containerMovies');
const NavBar = document.querySelectorAll('.Options');
const filtroGenero = document.querySelector('.genderFilter');
const Next = document.getElementById("btnNext");
const Prev = document.getElementById("btnPrev");
const contadorPag = document.getElementById("contadorPag");
const Text_Busqueda = document.querySelector(".text-busqueda");

// variables
let GenerActual = "";
let CategActual = "all";
let PagActual = 1;

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
  SearchTrending("all", 1);
  eventClickGener();
});

// evento click
//click btn Next || Prev
Next.addEventListener('click', () => {

  if(document.querySelector('.error') == null){
    // quitar clase disabled
    Prev.classList.remove('disabled');

    PagActual++;
    cambiarPagina();
  }
});

Prev.addEventListener('click', () => {

  if(PagActual > 1){
    PagActual--;
    cambiarPagina();
    if(PagActual == 1){
      Prev.classList.add('disabled');
    }
  }
});

const cambiarPagina = () => {
  contadorPag.innerHTML = PagActual;
  // Si esta categorizado por genero
  if(GenerActual == "" && input_search.value == ""){
    SearchTrending(CategActual, PagActual);
  }
  // si esta con un genero activado (comedia, accion, etc) y no esta en la categoria all
  else if(GenerActual != "" && input_search.value == "" && CategActual !== 'all'){
    SearchGenres(CategActual, GenerActual, PagActual);
  }
  // si esta con un genero activado (comedia, accion, etc) y esta en la categoria all
  else if(GenerActual != "" && input_search.value == "" && CategActual === 'all'){
    JuntarSearch("movie", "tv", GenerActual, PagActual);
  }
  // si esta en la categoria y esta buscando
  else if(GenerActual == "" && input_search.value != ""){
    search(CategActual === "all" ? "multi" : CategActual, GenerActual === "" ? "" : GenerActual, PagActual);
  }
  // subir scroll
  window.scrollTo(0, 0);
}

// click navbar
NavBar.forEach(nav => {
  nav.addEventListener('click', () => {
    document.querySelector('.sectionFilter').style.display = "block";
    NavBar.forEach(nav => nav.classList.remove('active'));
    nav.classList.add('active');
    switch (nav.id) {
      case 'book':
        document.querySelector('.sectionFilter').style.display = "none";
        document.querySelector('.containers').style.width = "100%";
        document.querySelector('.btns').style.visibility = "hidden";
        SearchBook("marvel")
        break;
      case 'all':
        document.querySelector('.btns').style.visibility = "visible";
        SearchTrending(nav.id, 1);
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
        document.querySelector('.btns').style.visibility = "visible";
        SearchTrending(nav.id, 1);
        SearchGeneroList(nav.id);
        eventClickGener();
        break;
    }
    // limpiar input
    input_search.value = '';
    // cambiar atributo categoria de search
    input_search.setAttribute('category', nav.id);
    // cambiar placeholder
    input_search.setAttribute('placeholder', `Buscar ${nav.id}`);
    // Desactivar modo genero
    CategActual = nav.id;
    GenerActual = "";
    PagActual = 1;
    contadorPag.innerHTML = PagActual;
    Prev.classList.add('disabled');
    Text_Busqueda.style.display = "none";
  });
});

const eventClickGener = () =>{
  const Geners = document.querySelectorAll('.generos');
  Geners.forEach(genero => {
    genero.addEventListener('click', () => {
      Geners.forEach(genero => genero.classList.remove('active_genero'));
      genero.classList.add('active_genero');
      if(CategActual === 'all'){
        JuntarSearch("movie", "tv", genero.id, 1);
      }
      else{
        SearchGenres(CategActual, genero.id, 1);
      }
      //Limpiar input
      input_search.value = '';
      // Activar modo genero
      GenerActual = genero.id;
      PagActual = 1;
      contadorPag.innerHTML = PagActual;
      Text_Busqueda.style.display = "none";
      Prev.classList.add('disabled');
      Next.classList.remove('disabled');
    });
  });

}

// eventos keyup
input_search.addEventListener("keyup", () => {

  if (input_search.value === '' && CategActual !== 'book') {
    SearchTrending(CategActual, 1);
    Text_Busqueda.style.display = "none";
    return;
  }
  if(input_search.value === '' && CategActual === 'book'){
    SearchBook("marvel");
    Text_Busqueda.style.display = "none";
    return;
  }
  if (CategActual === "book") {
    SearchBook(input_search.value);
    return;
  }

  search(CategActual === "all" ? "multi" : CategActual, GenerActual === "" ? "" : GenerActual, 1);
});



//* ///////// Buscar ///////////// *//

const SearchGeneroList = (type) => {
  document.getElementById("cargando").style.display = "block";
  fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&include_adult=false`, options)
    .then(response => response.json())
    .then(data => ShowGeneroList(data.genres))
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

const SearchGenres = (type, id, pag) => {
  const URL = `https://api.themoviedb.org/3/discover/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&sort_by=popularity.desc&include_video=false&page=${pag}&with_genres=${id}&include_adult=false`;
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
const SearchTrending = (type, pag) => {
  const URL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&page=${pag}&include_adult=false`;
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
const search = (type, genero, pag) => {
  const busqueda = input_search.value;
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=es-MX&sort_by=popularity.desc&query=${busqueda}&page=${pag}&include_adult=false${genero === "" ? "" : "&with_genres=" + genero}`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => {
      Show(data)
      Text_Busqueda.style.display = "block";
      Text_Busqueda.innerHTML = `Resultados de la búsqueda: <a> {${busqueda}} </a>`;
    })
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
  });
}

// Buscar libros
const SearchBook = (search) => {
  const URL = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=40&langRestrict=es`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => {
      if (data.totalItems === 0) {
        moviesContainer.innerHTML = '<h1 class="error" style="margin:38vh">No se encontraron resultados</h1>'
        return;
      }
      ShowBook(data)
      Text_Busqueda.style.display = "block";
      Text_Busqueda.innerHTML = `Resultados de la búsqueda: <a> {${search}} </a>`;
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
    moviesContainer.innerHTML = '<h1 class="error">No se encontraron resultados</h1>'
    document.getElementById("btnNext").classList.add('disabled');
  }else{
    document.getElementById("btnNext").classList.remove('disabled');
  }
}

// mostrar libros
const ShowBook = (data) => {
  const books = data.items
  moviesContainer.innerHTML = ''
  books.forEach(book => {
    /* SI el titulo no es tan grande */
    if (book.volumeInfo.title.length < 60 && book.volumeInfo.imageLinks) {
    moviesContainer.innerHTML += `
      <div class="target">
          <img class="imageMovie" style="width:180px; height:250px" src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.volumeInfo.authors}">
      <p class="nameMovie" style="font-size: 15px">${book.volumeInfo.title}</p></div>`
    }
  });
  if (moviesContainer.innerHTML === '') {
    moviesContainer.innerHTML = '<h1 class="error" style="margin:38vh">No se encontraron resultados</h1>'
  }
}


// Juntar busqueda de peliculas y series
const JuntarSearch = (type1, type2, id, pag) => {
    const url = `https://api.themoviedb.org/3/discover/${type1}?api_key=1f54bd990f1cdfb230adb312546d765d&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pag}&with_genres=${id}`;
    const url2 = `https://api.themoviedb.org/3/discover/${type2}?api_key=1f54bd990f1cdfb230adb312546d765d&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pag}&with_genres=${id}`;
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
const ShowGeneroList = (type) => {
  filtroGenero.innerHTML = '<h3>GÉNERO</h3>'
  type.forEach(genero => {
    // se puede modificar solo para 8 generos
    filtroGenero.innerHTML += `
      <li class="generos" onclick="SearchGenres('${CategActual}', ${genero.id})">${genero.name}</li>
    `
  });
  eventClickGener();
}

