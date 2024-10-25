// scripts.js

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const autorUrl = urlParams.get('autor');
  const categoriaUrl = urlParams.get('categoria');

  if (autorUrl) {
    cargarAutor(autorUrl);
  } else if (categoriaUrl) {
    cargarFrasesCategoria(categoriaUrl);
  } else {
    cargarCarrusel();
  }
});

// Cargar datos del autor y sus frases
function cargarAutor(autorUrl) {
  fetch('autores.json')
    .then(response => response.json())
    .then(data => {
      const autor = data.autores.find(a => a.autor_url === autorUrl);

      if (autor) {
        document.getElementById("nombre-autor").textContent = autor.nombre;
        document.getElementById("biografia-autor").textContent = autor.biografia;
        cargarFrasesAutor(autorUrl);
      } else {
        console.error('Autor no encontrado.');
      }
    })
    .catch(error => console.error('Error al cargar los datos del autor:', error));
}

function cargarFrasesAutor(autorUrl) {
  fetch('frases.json')
    .then(response => response.json())
    .then(data => {
      const frasesAutor = data.frases.filter(frase => frase.autor_url === autorUrl);
      const frasesContainer = document.getElementById("frases-autor");

      frasesAutor.forEach(frase => {
        const fraseElement = document.createElement('p');
        fraseElement.textContent = `"${frase.frase}" - Categorías: ${frase.categorias.join(', ')}`;
        frasesContainer.appendChild(fraseElement);
      });
    })
    .catch(error => console.error('Error al cargar las frases del autor:', error));
}

// Cargar frases por categoría
function cargarFrasesCategoria(categoriaUrl) {
  fetch('frases.json')
    .then(response => response.json())
    .then(data => {
      const frasesCategoria = data.frases.filter(frase => frase.categorias.includes(categoriaUrl));
      const frasesContainer = document.getElementById('frases-container');

      if (frasesCategoria.length > 0) {
        frasesCategoria.forEach(frase => {
          const fraseElement = document.createElement('p');
          fraseElement.textContent = `"${frase.frase}" - Autor: ${frase.autor_url}`;
          frasesContainer.appendChild(fraseElement);
        });
      } else {
        frasesContainer.textContent = 'No se encontraron frases para esta categoría.';
      }
    })
    .catch(error => console.error('Error al cargar las frases:', error));
}

// Carrusel de frases aleatorias
function cargarCarrusel() {
  fetch('frases.json')
    .then(response => response.json())
    .then(data => {
      const frases = data.frases;
      let index = Math.floor(Math.random() * frases.length);
      const fraseElement = document.getElementById('carrusel-frase');

      const cambiarFrase = () => {
        const fraseActual = frases[index];
        fraseElement.textContent = `"${fraseActual.frase}" - ${fraseActual.autor_url}`;
        index = (index + 1) % frases.length;
      };

      cambiarFrase();
      setInterval(cambiarFrase, 10000); // Cambiar frase cada 10 segundos
    })
    .catch(error => console.error('Error al cargar las frases del carrusel:', error));
}

// Filtro de frases en tiempo real
document.getElementById('busqueda').addEventListener('input', function() {
  const terminoBusqueda = this.value.toLowerCase();
  const resultadoContainer = document.getElementById('resultados-busqueda');

  fetch('frases.json')
    .then(response => response.json())
    .then(data => {
      resultadoContainer.innerHTML = ''; // Limpiar resultados anteriores

      data.frases.forEach(frase => {
        if (frase.frase.toLowerCase().includes(terminoBusqueda) || 
            frase.autor_url.toLowerCase().includes(terminoBusqueda) || 
            frase.categorias.some(cat => cat.toLowerCase().includes(terminoBusqueda))) {
          const resultadoElement = document.createElement('p');
          resultadoElement.textContent = `"${frase.frase}" - Autor: ${frase.autor_url}`;
          resultadoContainer.appendChild(resultadoElement);
        }
      });
    })
    .catch(error => console.error('Error al filtrar las frases:', error));
});
