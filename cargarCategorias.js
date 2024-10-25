document.addEventListener("DOMContentLoaded", function() {
    const categoriasLista = document.getElementById("categorias");

    fetch("frases.json") // Cambia el nombre si tu archivo JSON se llama diferente
        .then(response => response.json())
        .then(data => {
            const categoriasSet = new Set();

            // Recorre cada frase y agrega las categorías al Set (elimina duplicados automáticamente)
            data.frases.forEach(frase => {
                frase.categorias.forEach(categoria => categoriasSet.add(categoria));
            });

            // Crea un elemento de lista para cada categoría única
            categoriasSet.forEach(categoria => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");

                const link = document.createElement("a");
                link.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
                link.textContent = categoria;

                li.appendChild(link);
                categoriasLista.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
});
