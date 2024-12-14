document.addEventListener("DOMContentLoaded", function () {
    const categoriasLista = document.getElementById("categorias");

    const colorCategorias = {
        "Navidad": "badge-navidad",
        "Año Nuevo": "badge-ano-nuevo",
        "Futuro": "badge-futuro",
        "Acción": "badge-accion",
        "Sueños": "badge-sueños",
        "Esperanza": "badge-esperanza",
        "Melancolía": "badge-melancolia",
        "Fuerza": "badge-fuerza",
        "Felicidad": "badge-felicidad",
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

    //document.addEventListener("DOMContentLoaded", function
    function busquedaBarraCategorias() {
        const categoriasLista = document.getElementById("categorias");
        const barraBusquedaCats = document.getElementById("barra-busqueda-cats"); // Elemento de búsqueda
        const resultadosBusquedaCats = document.getElementById("resultados-busqueda-cats"); // Resultados de búsqueda

        function filtrarCategorias(query) {
            resultadosBusquedaCats.innerHTML = ""; // Limpiar resultados anteriores
            const categoriasFiltradas = Array.from(categoriasMap).filter(([categoria, cantidad]) =>
                categoria.toLowerCase().includes(query)
            );
            if (categoriasFiltradas.length === 0 && query.trim() !== "") { // Comprobar si no hay resultados Y la búsqueda no está vacía
                const noResultados = document.createElement("li");
                noResultados.classList.add("list-group-item", "text-center", "text-muted"); // Estilo para centrar y atenuar el texto
                noResultados.textContent = "No se encontraron coincidencias";
                resultadosBusquedaCats.appendChild(noResultados);
                //categoriasLista.style.display= "none"
            } else {
                categoriasFiltradas.forEach(([categoria, cantidad]) => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "mb-2");

                    const link = document.createElement("a");
                    link.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
                    link.textContent = categoria;

                    const badgeColor = colorCategorias[categoria] || colorCategorias["default"];
                    const badge = document.createElement("a");
                    badge.href = `categoria.html?categoria=${encodeURIComponent(categoria)}`;
                    badge.classList.add("badge", badgeColor);
                    badge.textContent = `${cantidad} Frase${cantidad !== 1 ? 's' : ''}`;
                    badge.style.marginLeft = "10px";

                    li.appendChild(link);
                    li.appendChild(badge);
                    resultadosBusquedaCats.appendChild(li); // Agregar a los resultados de búsqueda
                })
            };

            if (query.trim() === "") {
                categoriasLista.style.display = "block"
                resultadosBusquedaCats.style.display = "none"
            } else {
                categoriasLista.style.display = "none"
                resultadosBusquedaCats.style.display = "block"
            }
        }

        let categoriasMap; // Declara categoriasMap fuera para que sea accesible

        fetch("frases.json")
            .then(response => response.json())
            .then(data => {
                categoriasMap = new Map(); // Inicializa categoriasMap aquí

                data.frases.forEach(frase => {
                    frase.categorias.forEach(categoria => {
                        categoriasMap.set(categoria, (categoriasMap.get(categoria) || 0) + 1);
                    });
                });

                const categoriasArray = Array.from(categoriasMap, ([categoria, cantidad]) => ({ categoria, cantidad }));
                shuffle(categoriasArray);

                categoriasArray.forEach(({ categoria, cantidad }) => {
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
                    badge.textContent = `${cantidad} Frase${cantidad !== 1 ? 's' : ''}`; // Mostrar el número de frases
                    badge.style.marginLeft = "10px"; // Espacio a la derecha del nombre de la categoría

                    // Añadir el enlace de la categoría y la badge al li
                    li.appendChild(link);
                    li.appendChild(badge);

                    // Agregar el li a la lista
                    categoriasLista.appendChild(li);
                });

                // Evento de escucha para la barra de búsqueda
                barraBusquedaCats.addEventListener("input", () => {
                    const query = barraBusquedaCats.value.toLowerCase();
                    filtrarCategorias(query); // Llama a la función de filtrado
                });
            })
            .catch(error => console.error("Error al cargar categorías:", error));
    };

    // Función de mezcla aleatoria (Fisher-Yates)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
        }
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

            // Convertimos el Map de categorías a un array para poder mezclarlo
            const categoriasArray = Array.from(categoriasMap, ([categoria, cantidad]) => ({
                categoria,
                cantidad
            }));

            // Mezclamos el array de categorías
            shuffle(categoriasArray);

            // Crea un elemento de lista para cada categoría única
            categoriasArray.forEach(({ categoria, cantidad }) => {
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
                badge.textContent = `${cantidad} Frase${cantidad !== 1 ? 's' : ''}`; // Mostrar el número de frases
                badge.style.marginLeft = "10px"; // Espacio a la derecha del nombre de la categoría

                // Añadir el enlace de la categoría y la badge al li
                li.appendChild(link);
                li.appendChild(badge);

                // Agregar el li a la lista
                categoriasLista.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
    busquedaBarraCategorias();
});
