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
