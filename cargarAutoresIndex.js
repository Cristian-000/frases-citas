function cargarAutores() {
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaAutores = document.getElementById("lista-autores");
            const autoresUnicos = new Set();

            // Extraer todos los autores únicos
            data.frases.forEach(fraseObj => {
                autoresUnicos.add(fraseObj.autor_url);
            });

            // Crear la lista de autores
            autoresUnicos.forEach(autor => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `<a href="autor.html?autor=${encodeURIComponent(autor)}">${autor}</a>`;
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
