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
            const categoriasTags = fraseObj.categorias.map(cat => `<span class="badge badge-secondary">${cat}</span>`).join(' ');
            li.innerHTML = `
                <p>${fraseObj.frase} - <a href="autor.html?autor=${fraseObj.autor_url}"><strong>${fraseObj.autor}</strong></a></p>
                <p>Categorías: ${categoriasTags}</p>
            `;
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
            const categoriasTags = fraseObj.categorias.map(cat => `<span class="badge badge-secondary">${cat}</span>`).join(' ');
            li.innerHTML = `
                <p>${fraseObj.frase} - <a href="autor.html?autor=${fraseObj.autor_url}"><strong>${fraseObj.autor}</strong></a></p>
                <p>Categorías: ${categoriasTags}</p>
            `;
            listaFrases.appendChild(li);
        });
    } else {
        listaFrases.textContent = "No hay frases de este autor.";
    }
}

// Función para filtrar las frases y autores en base a la búsqueda
function filtrarFrases(frases, query) {
    const resultados = [];
    const queryLower = query.toLowerCase();

    Object.keys(frases).forEach(categoria => {
        frases[categoria].forEach(fraseObj => {
            const fraseLower = fraseObj.frase.toLowerCase();
            const autorLower = fraseObj.autor.toLowerCase();

            if (fraseLower.includes(queryLower) || autorLower.includes(queryLower)) {
                resultados.push(fraseObj);
            }
        });
    });

    return resultados;
}

// Función para mostrar los resultados de búsqueda
function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados-busqueda');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

    if (resultados.length > 0) {
        resultados.forEach(fraseObj => {
            const categoriasTags = fraseObj.categorias.map(cat => `<span class="badge badge-secondary">${cat}</span>`).join(' ');
            const div = document.createElement('div');
            div.classList.add('resultado-item', 'list-group-item');
            div.innerHTML = `
                <p><strong>Frase:</strong> ${fraseObj.frase}</p>
                <p><strong>Autor:</strong> <a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor}</a></p>
                <p>Categorías: ${categoriasTags}</p>
            `;
            resultadosDiv.appendChild(div);
        });
    } else {
        resultadosDiv.innerHTML = '<p>No se encontraron resultados.</p>';
    }
}

// Función para manejar el evento de búsqueda
function manejarBusqueda(frases) {
    const inputBusqueda = document.getElementById('barra-busqueda');

    inputBusqueda.addEventListener('input', () => {
        const query = inputBusqueda.value;
        if (query.length > 0) {
            const resultados = filtrarFrases(frases, query);
            mostrarResultados(resultados);
        } else {
            document.getElementById('resultados-busqueda').innerHTML = ''; // Limpiar si no hay búsqueda
        }
    });
}

// Cargar el JSON y configurar las funciones necesarias dependiendo de la página
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
        // Configurar la barra de búsqueda en todas las páginas
        manejarBusqueda(frases);
    })
    .catch(error => console.error('Error cargando el JSON:', error));
