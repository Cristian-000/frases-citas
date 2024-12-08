document.addEventListener("DOMContentLoaded", function() {
    const categoriasLista = document.getElementById("categorias");

    const colorCategorias = {
    "Futuro":"badge-futuro",
    "Acción" :"badge-accion",
    "Sueños":"badge-sueños",
    "Esperanza":"badge-esperanza",
    "Melancolía":"badge-melancolia",
    "Fuerza":"badge-fuerza",
    "Felicidad":"badge-felicidad",
    "Filosofía": "badge-filosofia",
    "Amor": "badge-amor",
    "Educación": "badge-educacion",
    "Trabajo": "badge-trabajo",
    "Motivación": "badge-motivacion",
    "Vida": "badge-vida",
    "Tristeza": "badge-tristeza",
    "Inspiración": "badge-inspiracion",
    "Superación": "badge-superacion",
    "default": "badge-primary" // Color por defecto
};

    function obtenerClaseColor(categoria) {
        return colorCategorias[categoria] || colorCategorias["default"];
    }
    fetch("frases.json") // Cambia el nombre si tu archivo JSON se llama diferente
        .then(response => response.json())
        .then(data => {
            const categoriasMap = new Map();

            // Recorre cada frase y agrega las categorías al Map
            data.frases.forEach(frase => {
                frase.categorias.forEach(categoria => {
                    // Si la categoría ya está en el mapa, incrementamos el contador
                    if (categoriasMap.has(categoria)) {
                        categoriasMap.set(categoria, categoriasMap.get(categoria) + 1);
                    } else {
                        // Si no está, la agregamos con contador 1
                        categoriasMap.set(categoria, 1);
                    }
                });
            });

            // Crea un elemento de lista para cada categoría única
            categoriasMap.forEach((cantidad, categoria) => {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "mb-2");

                // Crear enlace para la categoría
                const link = document.createElement("a");
                link.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
                link.textContent = categoria; // Solo el nombre de la categoría

                // Obtener la clase de color para la categoría
                const badgeColor = colorCategorias[categoria] || colorCategorias["default"];

                // Crear badge con el número de frases, y también hacer de enlace
                const badge = document.createElement("a"); // Cambiar a <a> para que sea un enlace
                badge.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`; // El mismo enlace
                badge.classList.add("badge", badgeColor); // Usar el color de la categoría
                badge.textContent = `${cantidad} Frase${cantidad !== 1 ? 's' : ''}`// Mostrar el número de frases
                badge.style.marginLeft = "10px"; // Espacio a la derecha del nombre de la categoría

                // Añadir el enlace de la categoría y la badge al li
                li.appendChild(link);
                li.appendChild(badge);

                // Agregar el li a la lista
                categoriasLista.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
});
