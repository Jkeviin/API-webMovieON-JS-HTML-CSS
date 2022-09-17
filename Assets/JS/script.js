// asignacion de variables
const input_search = document.getElementById("search");
const moviesContainer = document.querySelector('.containerMovies');
const NavBar = document.querySelectorAll('.Options');
const filtroGenero = document.querySelector('.genderFilter');
const Next = document.getElementById("btnNext");
const Prev = document.getElementById("btnPrev");
const contadorPag = document.getElementById("contadorPag");
const Text_Busqueda = document.querySelector(".text-busqueda");
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');
const lenguajes = document.querySelector('#LENGUAJES');

// variables
let GenerActual = "";
let CategActual = "all";
let PagActual = 1;
let estado = false;
let idioma = 'es-MX';
const web = () => {

}
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
  inicio();
  createOptionsLanguajes();
});

const inicio = () => {
  SearchTrending("all", 1);
  eventClickGener();
}

// evento click
//click btn Next || Prev
Next.addEventListener('click', () => {

  if (document.querySelector('.error') == null) {
    // quitar clase disabled
    Prev.classList.remove('disabled');

    PagActual++;
    cambiarPagina();
  }
});

Prev.addEventListener('click', () => {

  if (PagActual > 1) {
    PagActual--;
    cambiarPagina();
    if (PagActual == 1) {
      Prev.classList.add('disabled');
    }
  }
});

// crear opciones lenguajes
const createOptionsLanguajes = () => {
  fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=80d3d3959ac69af0ed72952812957afc`, options)
    .then(response => response.json())
    .then(data => {
      let i = 0;
      data.forEach(element => {
        // dejar los mas importantes
        if (element.iso_639_1 == 'es' || element.iso_639_1 == 'en' || element.iso_639_1 == 'fr' || element.iso_639_1 == 'de' || element.iso_639_1 == 'it' || element.iso_639_1 == 'pt' || element.iso_639_1 == 'ru' || element.iso_639_1 == 'ja' || element.iso_639_1 == 'zh') {

          const pais = ["US", "FR", "DE", "IT", "JP", "CN", "PT", "RU", "MX"];
            let option = document.createElement('option');
            option.value = element.iso_639_1 + "-" + pais[i];
            option.innerHTML = element.english_name;
            lenguajes.appendChild(option);
            i++;
            }

        //ordernalo alfabeticamente
        data.sort(function (a, b) {
          if (a.english_name < b.english_name) { return -1; }
          if (a.english_name > b.english_name) { return 1; }
          return 0;
        });
      });
      document.querySelector('.Lenguaje_Actual').innerHTML +=
      `<h5 class="Lenguaje">Lenguaje Actual: <a>${idioma}</></h5>`;
      // crear evento click lenguajes
      lenguajes.addEventListener('change', () => {
        idioma = lenguajes.value;
        reiniciar();
        inicio();
        Next.classList.remove('disabled');
        switch (CategActual) {
          case 'movie':
          case 'tv':
            SearchGeneroList(CategActual);
            eventClickGener();
            break;
        }

        document.querySelector('.Lenguaje_Actual').innerHTML =
        `<h5 class="Lenguaje">Lenguaje Actual: <a>${idioma}</></h5>`;
      });
    })
}

const reiniciar = () => {
  document.getElementById("review").innerHTML = "";
  input_search.value = '';
  PagActual = 1;
  Text_Busqueda.style.display = "none";
  contadorPag.innerHTML = PagActual;
  Prev.classList.add('disabled');
}


const cambiarPagina = () => {
  contadorPag.innerHTML = PagActual;
  // Si esta categorizado por genero
  if (GenerActual == "" && input_search.value == "") {
    SearchTrending(CategActual, PagActual);
  }
  // si esta con un genero activado (comedia, accion, etc) y no esta en la categoria all
  else if (GenerActual != "" && input_search.value == "" && CategActual !== 'all') {
    SearchGenres(CategActual, GenerActual, PagActual);
  }
  // si esta con un genero activado (comedia, accion, etc) y esta en la categoria all
  else if (GenerActual != "" && input_search.value == "" && CategActual === 'all') {
    JuntarSearch("movie", "tv", GenerActual, PagActual);
  }
  // si esta en la categoria y esta buscando
  else if (GenerActual == "" && input_search.value != "") {
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
      case 'movie':
      case 'tv':
        document.querySelector('.btns').style.visibility = "visible";
        SearchTrending(nav.id, 1);
        SearchGeneroList(nav.id);
        eventClickGener();
        break;
    }
    reiniciar();
    // cambiar atributo categoria de search
    input_search.setAttribute('category', nav.id);
    // cambiar placeholder
    input_search.setAttribute('placeholder', `Buscar ${nav.id}`);
    // Desactivar modo genero
    CategActual = nav.id;
    GenerActual = "";
  });
});

const eventClickGener = () => {
  const Geners = document.querySelectorAll('.generos');
  Geners.forEach(genero => {
    genero.addEventListener('click', () => {
      Geners.forEach(genero => genero.classList.remove('active_genero'));
      genero.classList.add('active_genero');
      if (CategActual === 'all') {
        JuntarSearch("movie", "tv", genero.id, 1);
      }
      if (CategActual !== 'all') {
        SearchGenres(CategActual, genero.id, 1);
      }
      //Limpiar input
      reiniciar();
      // Activar modo genero
      GenerActual = genero.id;
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
  if (input_search.value === '' && CategActual === 'book') {
    SearchBook("marvel");
    Text_Busqueda.style.display = "none";
    return;
  }
  if (CategActual === "book") {
    SearchBook(input_search.value);
    return;
  }

  /* remover .active_genero */
  const Geners = document.querySelectorAll('.generos');
  Geners.forEach(genero => genero.classList.remove('active_genero'));
  search(CategActual === "all" ? "multi" : CategActual, GenerActual === "" ? "" : GenerActual, 1);
});

//* ///////// Buscar ///////////// *//

const SearchGeneroList = (type) => {
  document.getElementById("cargando").style.display = "block";
  fetch(`https://api.themoviedb.org/3/genre/${type}/list?api_key=80d3d3959ac69af0ed72952812957afc&language=${idioma}&include_adult=false`, options)
    .then(response => response.json())
    .then(data => ShowGeneroList(data.genres))
    .catch(error => console.log(error))
    .finally(() => {
      document.getElementById("cargando").style.display = "none";
    });
}

const SearchGenres = (type, id, pag) => {
  const URL = `https://api.themoviedb.org/3/discover/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=${idioma}&sort_by=popularity.desc&page=${pag}&with_genres=${id}&include_adult=false`;
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
  const URL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=80d3d3959ac69af0ed72952812957afc&language=${idioma}&sort_by=popularity.desc&page=${pag}&include_adult=false`;
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
  const URL = `https://api.themoviedb.org/3/search/${type}?api_key=80d3d3959ac69af0ed72952812957afc&language=${idioma}&sort_by=popularity.desc&query=${busqueda}&page=${pag}&include_adult=false${genero === "" ? "" : "&with_genres=" + genero}`;
  document.getElementById("cargando").style.display = "block";
  fetch(URL, options)
    .then(response => response.json())
    .then(data => {
      Show(data)
      Text_Busqueda.style.display = "block";
      Text_Busqueda.innerHTML = `Resultados de la búsqueda: <a> {${busqueda}} </a>`;

      //subir scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    const vote = movie.vote_average.toFixed(1);
    const img = movie.poster_path ? movie.poster_path : movie.backdrop_path;
    if (img && movie.media_type !== "person") {
      let titulo = movie.title == 'undefined' || movie.title == null ? movie.name : movie.title;
      moviesContainer.innerHTML += `
      <div class="target" id=${movie.id} onclick="ShowInfo(${movie.id}, '${CategActual == 'all' ? movie.media_type : CategActual}', '${movie.vote_average == 'undefined' ? 'Sin votos' : movie.vote_average}', '${movie.release_date ? movie.release_date : movie.first_air_date}', '${titulo}', '${movie.popularity}')">
          <img class="imageMovie" src="https://image.tmdb.org/t/p/w500${img}" alt="La pelicula no tiene imagen">
          <p class="yearMovie">${vote}</p>
      <p class="nameMovie">${titulo}</p></div>
      `

      document.getElementById("review").innerHTML += `
      <div id='escondido_${movie.id}'>${movie.overview != "" ? movie.overview : "Sin descripción"}</div>
    `
    }
  });
  if (moviesContainer.innerHTML === '') {
    moviesContainer.innerHTML = '<h1 class="error">No se encontraron resultados</h1>'
    document.getElementById("btnNext").classList.add('disabled');
  } else {
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
  const url = `https://api.themoviedb.org/3/discover/${type1}?api_key=1f54bd990f1cdfb230adb312546d765d&language=${idioma}&include_adult=false&page=${pag}&with_genres=${id}`;
  const url2 = `https://api.themoviedb.org/3/discover/${type2}?api_key=1f54bd990f1cdfb230adb312546d765d&language=${idioma}&include_adult=false&page=${pag}&with_genres=${id}`;
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
            const img = movie.poster_path ? movie.poster_path : movie.backdrop_path;
            if (poster_path) {
              moviesContainer.innerHTML += `
                  <div class="target" id=${id} onclick="alerta()">
                      <img class="imageMovie" src="https://image.tmdb.org/t/p/w500${img}" alt="La pelicula no tiene imagen">
                      <p class="yearMovie">${vote_average}</p>
                  <p class="nameMovie">${title ? title : name}</p></div>`
            }
            document.getElementById("review").innerHTML += `
                  <div id='escondido_${id}'>${movie.overview != "" ? movie.overview : "Sin descripción"}</div>
                `
          });
        });
    });
}

const alerta = () => {
  alert("Justo ahora no se puede ver la información de un genero de peliculas y series a la vez, por favor espere a que se actualice la pagina");
}

/* ------------------------------------------------------------- */

// Mostrar generos
const ShowGeneroList = (type) => {
  filtroGenero.innerHTML = '<h3>GÉNERO</h3>'
  type.forEach(genero => {
    // se puede modificar solo para 8 generos
    filtroGenero.innerHTML += `
      <li class="generos" id="${genero.id}">${genero.name}</li>
    `
  });
  eventClickGener();
}

const ShowInfo = (id, type, vote, date, name, popularity) => {
  const url = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=1f54bd990f1cdfb230adb312546d765d&language=${idioma}`;
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if (data.results.length === 0) {
        alert('No hay trailer disponible')
        return;
      }
      VerModal(data.results, vote, date, name, popularity, id);
    })
    .catch(error => console.log(error))
}

const VerModal = (data, vote_average, release_date, name, popularity, idmovie) => {

  modal.classList.add('modal--show');
  const video = data[data.length - 1].key
  const iframe = document.getElementById('iframe')
  iframe.src = `https://www.youtube.com/embed/${video}?autoplay=1&loop=1&playlist=${video}`
  const titleModal = document.querySelector('.modal__title');
  titleModal.innerHTML = name;
  const reviewModal = document.querySelector('.modal__paragraph');
  reviewModal.innerHTML = document.getElementById(`escondido_${idmovie}`).innerHTML;
  const voteModal = document.querySelector('.modal__votos--p');
  voteModal.innerHTML = vote_average;
  const dateModal = document.querySelector('.modal__date--p');
  dateModal.innerHTML = release_date;
  const popularityModal = document.querySelector('.modal__popularity--p');
  popularityModal.innerHTML = popularity;
}

closeModal.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.remove('modal--show');
  const iframe = document.getElementById('iframe')
  iframe.src = ''
});