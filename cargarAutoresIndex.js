function cargarAutores() {
    Promise.all([fetch('frases.json'), fetch('autores.json')])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([frasesData, autoresData]) => {
            const listaAutores = document.getElementById("lista-autores");
            const autoresUnicos = new Map(); // Usamos un Map para contar las frases por autor

            // Contar las frases por autor
            frasesData.frases.forEach(fraseObj => {
                if (fraseObj.autor_url) {
                    // Si el autor ya existe, sumamos 1 a su contador
                    if (autoresUnicos.has(fraseObj.autor_url)) {
                        autoresUnicos.set(fraseObj.autor_url, autoresUnicos.get(fraseObj.autor_url) + 1);
                    } else {
                        // Si no existe, lo agregamos con el contador inicial de 1
                        autoresUnicos.set(fraseObj.autor_url, 1);
                    }
                }
            });

            // Convertir el Map a un array de objetos con la información de los autores
            let autoresArray = [];
            autoresUnicos.forEach((cantidad, autorUrl) => {
                const autor = autoresData.autores.find(a => a.autor_url === autorUrl);
                if (autor) {
                    autoresArray.push({ autor, cantidad });
                }
            });

            // Función para mezclar el array de autores
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
                }
            }

            // Mezclar los autores de forma aleatoria
            shuffle(autoresArray);

            // Agregar los autores mezclados a la lista
            autoresArray.forEach(({ autor, cantidad }) => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}">
                            <h5 class="font-weight-bold mb-0 autor-link">${autor.nombre}</h5>
                        </a>
                        <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="autor-link">
                            <span class="badge badge-primary">${cantidad} frase${cantidad !== 1 ? 's' : ''}</span>
                        </a>
                    </div>
                    <p class="mb-1 text-muted">${autor.biografia}</p>
                `;
                listaAutores.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar autores:", error));
}

// Llamar a la función de cargar autores cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("seccion-autores")) {
        cargarAutores();
    }
});
