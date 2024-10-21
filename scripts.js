let frasesJSON = {};

// Cargar el JSON de frases
fetch('frases.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    frasesJSON = data;
    cargarFraseDelDia();
    cargarCategorias();
  })
  .catch(error => {
    console.error('Error al cargar el JSON:', error);
  });

// Función para obtener una frase aleatoria para el "Frase del día"
function obtenerFraseDelDia() {
  const categorias = Object.keys(frasesJSON);
  const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
  const frases = frasesJSON[categoriaAleatoria];
  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
  return fraseAleatoria;
}

// Cargar la "Frase del día"
function cargarFraseDelDia() {
  if (document.querySelector('#frase-dia')) {
    const fraseDelDia = obtenerFraseDelDia();
    document.getElementById('frase-dia-texto').textContent = `"${fraseDelDia.frase}"`;
    document.getElementById('frase-dia-autor').textContent = fraseDelDia.autor;
  }
}

// Cargar las categorías en el index
function cargarCategorias() {
  if (document.querySelector('#categorias')) {
    const categorias = Object.keys(frasesJSON);
    const listaCategorias = document.querySelector("#categorias ul");

    categorias.forEach(categoria => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      const enlace = document.createElement("a");
      enlace.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
      enlace.textContent = categoria;
      li.appendChild(enlace);
      listaCategorias.appendChild(li);
    });
  }
}

// Cargar frases de la categoría seleccionada en categoria.html
if (document.querySelector('#lista-frases')) {
  const params = new URLSearchParams(window.location.search);
  const categoriaSeleccionada = params.get('categoria');
  const tituloCategoria = document.getElementById('titulo-categoria');
  tituloCategoria.textContent = `Frases de ${categoriaSeleccionada}`;

  const listaFrases = document.getElementById('lista-frases');
  const frasesCategoria = frasesJSON[categoriaSeleccionada];

  if (frasesCategoria) {
    frasesCategoria.forEach(fraseObj => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `${fraseObj.frase} - <a href="autor.html?autor=${encodeURIComponent(fraseObj.autor)}">${fraseObj.autor}</a>`;
      listaFrases.appendChild(li);
    });
  } else {
    listaFrases.textContent = "No hay frases para esta categoría.";
  }
}

// Cargar frases del autor seleccionado en autor.html
if (document.querySelector('#lista-frases-autor')) {
  const params = new URLSearchParams(window.location.search);
  const autorSeleccionado = params.get('autor');
  const nombreAutor = document.getElementById('nombre-autor');
  nombreAutor.textContent = `Frases de ${autorSeleccionado}`;

  const listaFrasesAutor = document.getElementById('lista-frases-autor');

  Object.keys(frasesJSON).forEach(categoria => {
    const frasesCategoria = frasesJSON[categoria];
    frasesCategoria.forEach(fraseObj => {
      if (fraseObj.autor === autorSeleccionado) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = fraseObj.frase;
        listaFrasesAutor.appendChild(li);
      }
    });
  });
}
