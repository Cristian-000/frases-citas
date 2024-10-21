// URL del JSON de frases
const jsonUrl = 'frases.json';

// Función para obtener una categoría al azar y mostrar una frase del día
function mostrarFraseDelDia(frases) {
    const categorias = Object.keys(frases);
    const categoriaRandom = categorias[Math.floor(Math.random() * categorias.length)];
    const frasesCategoria = frases[categoriaRandom];
    const fraseRandom = frasesCategoria[Math.floor(Math.random() * frasesCategoria.length)];
    document.getElementById('frase-del-dia').innerHTML = `"${fraseRandom.frase}" - <strong>${fraseRandom.autor}</strong>`;
}

// Función para mostrar las categorías en la página principal
function mostrarCategorias(frases) {
    const categoriasList = document.getElementById('categorias');
    Object.keys(frases).forEach(categoria => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<a href="categoria.html?categoria=${categoria}">${categoria}</a>`;
        categoriasList.appendChild(li);
    });
}

// Función para mostrar las frases de una categoría
function mostrarFrasesPorCategoria(frases, categoriaSeleccionada) {
    const listaFrases = document.getElementById('lista-frases');
    const frasesCategoria = frases[categoriaSeleccionada];

    if (frasesCategoria && frasesCategoria.length > 0) {
        frasesCategoria.forEach(fraseObj => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${fraseObj.frase} - <a href="autor.html?autor=${fraseObj.autor_url}"><strong>${fraseObj.autor}</strong></a>`;
            listaFrases.appendChild(li);
        });
    } else {
        listaFrases.textContent = "No hay frases para esta categoría.";
    }
}

// Función para cargar las frases de un autor específico
function mostrarFrasesPorAutor(frases, autorSeleccionado) {
    const listaFrases = document.getElementById('lista-frases');
    let frasesDelAutor = [];

    // Recorrer todas las categorías para encontrar las frases del autor
    Object.keys(frases).forEach(categoria => {
        frases[categoria].forEach(fraseObj => {
            if (fraseObj.autor_url === autorSeleccionado) {
                frasesDelAutor.push(fraseObj);
            }
        });
    });

    if (frasesDelAutor.length > 0) {
        frasesDelAutor.forEach(fraseObj => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${fraseObj.frase} - ${fraseObj.autor}`;
            listaFrases.appendChild(li);
        });
    } else {
        listaFrases.textContent = "No hay frases de este autor.";
    }
}

// Cargar el JSON y ejecutar las funciones necesarias dependiendo de la página
fetch(jsonUrl)
    .then(response => response.json())
    .then(frases => {
        // Si estamos en la página principal (index.html)
        if (window.location.pathname.includes('index.html')) {
            mostrarFraseDelDia(frases);
            mostrarCategorias(frases);
        }
        // Si estamos en la página de categoría (categoria.html)
        else if (window.location.pathname.includes('categoria.html')) {
            const params = new URLSearchParams(window.location.search);
            const categoriaSeleccionada = params.get('categoria');
            const tituloCategoria = document.getElementById('titulo-categoria');
            tituloCategoria.textContent = `Frases de ${categoriaSeleccionada}`;
            mostrarFrasesPorCategoria(frases, categoriaSeleccionada);
        }
        // Si estamos en la página de autor (autor.html)
        else if (window.location.pathname.includes('autor.html')) {
            const params = new URLSearchParams(window.location.search);
            const autorSeleccionado = params.get('autor');
            const tituloAutor = document.getElementById('titulo-autor');
            tituloAutor.textContent = `Frases de ${autorSeleccionado.charAt(0).toUpperCase() + autorSeleccionado.slice(1)}`;
            mostrarFrasesPorAutor(frases, autorSeleccionado);
        }
    })
    .catch(error => console.error('Error cargando el JSON:', error));
