// URL del JSON de frases
const jsonUrl = 'frases.json';
// Cargar frases de la categoría seleccionada en categoria.html
if (window.location.pathname.includes('categoria.html')) {
    const params = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = params.get('categoria');
    
    const tituloCategoria = document.getElementById('titulo-categoria');
    tituloCategoria.textContent = `Frases de ${categoriaSeleccionada}`;

    fetch(jsonUrl)
        .then(response => response.json())
        .then(frases => {
            const listaFrases = document.getElementById('lista-frases');
            const frasesCategoria = frases[categoriaSeleccionada];

            if (frasesCategoria && frasesCategoria.length > 0) {
                frasesCategoria.forEach(fraseObj => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = `${fraseObj.frase} - <strong>${fraseObj.autor}</strong>`;
                    listaFrases.appendChild(li);
                });
            } else {
                listaFrases.textContent = "No hay frases para esta categoría.";
            }
        })
        .catch(error => console.error('Error cargando el JSON:', error));
}
// Función para obtener una categoría al azar y mostrar una frase del día
function mostrarFraseDelDia(frases) {
    const categorias = Object.keys(frases);
    const categoriaRandom = categorias[Math.floor(Math.random() * categorias.length)];
    const frasesCategoria = frases[categoriaRandom];
    const fraseRandom = frasesCategoria[Math.floor(Math.random() * frasesCategoria.length)];
    document.getElementById('frase-del-dia').innerHTML = `"${fraseRandom.frase}" - <strong>${fraseRandom.autor}</strong>`;
}

// Función para mostrar las categorías
function mostrarCategorias(frases) {
    const categoriasList = document.getElementById('categorias');
    Object.keys(frases).forEach(categoria => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<a href="categoria.html?categoria=${categoria}">${categoria}</a>`;
        categoriasList.appendChild(li);
    });
}

// Cargar el JSON y ejecutar las funciones necesarias
fetch(jsonUrl)
    .then(response => response.json())
    .then(frases => {
        mostrarFraseDelDia(frases);
        mostrarCategorias(frases);
    })
    .catch(error => console.error('Error cargando el JSON:', error));
