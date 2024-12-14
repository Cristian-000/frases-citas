// cargarAutores.js
function cargarAutores() {
    const barraBusquedaAutores = document.getElementById("barra-busqueda-autores");
    const resultadosBusquedaAutores = document.getElementById("resultados-busqueda-autores");
    const listaAutores = document.getElementById("lista-autores");

    Promise.all([fetch('frases.json'), fetch('autores.json')])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([frasesData, autoresData]) => {

            const autoresUnicos = new Map();

            frasesData.frases.forEach(fraseObj => {
                if (fraseObj.autor_url) {
                    autoresUnicos.set(fraseObj.autor_url, (autoresUnicos.get(fraseObj.autor_url) || 0) + 1);
                }
            });

            const autoresArray = Array.from(autoresUnicos, ([autorUrl, cantidad]) => ({ autorUrl, cantidad }));

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            shuffle(autoresArray);

            function mostrarOcultarLista(mostrarResultadosBusqueda = false) {
                if (mostrarResultadosBusqueda) {
                    listaAutores.style.display = "none";
                    resultadosBusquedaAutores.style.display = "block";
                } else {
                    listaAutores.style.display = "block";
                    resultadosBusquedaAutores.style.display = "none";
                }
            }

            mostrarOcultarLista();

            barraBusquedaAutores.addEventListener("input", () => {
                const query = barraBusquedaAutores.value.toLowerCase();
                resultadosBusquedaAutores.innerHTML = "";

                if (query.trim() === "") {
                    mostrarOcultarLista();
                } else {
                    mostrarOcultarLista(true);
                    const autoresFiltrados = autoresData.autores.filter(autor =>
                        autor.nombre.toLowerCase().includes(query)
                    );

                    if (autoresFiltrados.length === 0) {
                        const noResultados = document.createElement("li");
                        noResultados.classList.add("list-group-item", "text-center", "text-muted");
                        noResultados.textContent = "No se encontraron coincidencias";
                        resultadosBusquedaAutores.appendChild(noResultados);
                    } else {
                        autoresFiltrados.forEach(autor => {
                            // Obtener la cantidad de frases del autor
                            const cantidadFrases = autoresUnicos.get(autor.autor_url) || 0;

                            const li = document.createElement("li");
                            li.className = "list-group-item mb-2";
                            li.innerHTML = `
                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="autor-link">
                                        <h5 class="font-weight-bold text-primary mb-0">${autor.nombre}</h5>
                                    </a>
                                     <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="author-link">
                                        <span class="badge badge-primary">${cantidadFrases} frase${cantidadFrases !== 1 ? 's' : ''}</span>
                                     </a>
                                </div>
                                <p class="mb-1 text-muted">${autor.biografia || "Sin biografía disponible."}</p>
                            `;
                            resultadosBusquedaAutores.appendChild(li);
                        });
                    }
                }
            });

            autoresArray.forEach(({ autorUrl, cantidad }) => {
                const autor = autoresData.autores.find(a => a.autor_url === autorUrl);
                if (autor) {
                    const li = document.createElement("li");
                    li.className = "list-group-item mb-2";
                    li.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="autor-link">
                                <h5 class="font-weight-bold text-primary mb-0">${autor.nombre}</h5>
                            </a>
                            <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="author-link">
                                        <span class="badge badge-primary">${cantidad} frase${cantidad !== 1 ? 's' : ''}</span>
                                     </a>
                        </div>
                        <p class="mb-1 text-muted">${autor.biografia || "Sin biografía disponible."}</p>
                    `;
                    listaAutores.appendChild(li);
                }
            });
        })
        .catch(error => console.error("Error al cargar autores:", error));
}

// Ajustar padding top dinamicamente al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById("lista-autores")) {
        cargarAutores();
    }
});