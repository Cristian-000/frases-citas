function cargarAutores() {
    Promise.all([fetch('frases.json'), fetch('autores.json')])
        .then(responses => Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar ${response.url}: ${response.statusText}`);
            }
            return response.json();
        })))
        .then(([frasesData, autoresData]) => {
            const listaAutores = document.getElementById("lista-autores");
            const autoresUnicos = new Map();

            // Contar las frases por autor
            frasesData.frases.forEach(fraseObj => {
                if (fraseObj.autor_url) {
                    autoresUnicos.set(
                        fraseObj.autor_url,
                        (autoresUnicos.get(fraseObj.autor_url) || 0) + 1
                    );
                }
            });
           
            // Crear la lista de autores
            autoresUnicos.forEach((cantidad, autorUrl) => {
                const autor = autoresData.autores.find(a => a.autor_url === autorUrl);
                if (autor) {
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="autor.html?autor=${encodeURIComponent(autor.autor_url)}" class="author-link">
                                <h5 class="font-weight-bold text-primary mb-0">${autor.nombre}</h5>
                            </a>
                            <span class="badge badge-primary">${cantidad} frase${cantidad !== 1 ? 's' : ''}</span>
                        </div>
                        <p class="mb-1 text-muted">${autor.biografia || "Sin biografía disponible."}</p>
                    `;
                    listaAutores.appendChild(li);
                    console.log(autor)
                }
            });
        })
        .catch(error => console.error("Error al cargar autores:", error));
}

// Llamar a la función de cargar autores cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lista-autores")) {
        cargarAutores();
    }
});
