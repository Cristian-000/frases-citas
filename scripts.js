document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("categorias")) {
        cargarCategorias();
        cargarFraseDelDia();
        configurarBarraBusqueda();
    }
    if (document.getElementById("titulo-categoria")) {
        cargarFrasesPorCategoria();
    }
});

// Cargar categorías de frases únicas a partir de frases.json
function cargarCategorias() {
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaCategorias = document.getElementById("categorias");
            const categoriasUnicas = new Set();

            // Extraer todas las categorías únicas
            data.frases.forEach(fraseObj => {
                fraseObj.categorias.forEach(categoria => categoriasUnicas.add(categoria));
            });

            // Crear la lista de categorías
            categoriasUnicas.forEach(categoria => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}">${categoria}</a>`;
                listaCategorias.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
}

// Cargar una frase aleatoria del día
function cargarFraseDelDia() {
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const fraseDelDia = data.frases[Math.floor(Math.random() * data.frases.length)];
            document.getElementById("frase-del-dia").innerText = fraseDelDia.frase;
        })
        .catch(error => console.error("Error al cargar frase del día:", error));
}

// Configurar la barra de búsqueda para filtrar frases
function configurarBarraBusqueda() {
    const barraBusqueda = document.getElementById("barra-busqueda");
    const resultadosBusqueda = document.getElementById("resultados-busqueda");

    barraBusqueda.addEventListener("input", () => {
        const query = barraBusqueda.value.toLowerCase();
        resultadosBusqueda.innerHTML = ""; // Limpiar resultados anteriores

        if (query) {
            fetch('frases.json')
                .then(response => response.json())
                .then(data => {
                    const frasesEncontradas = data.frases.filter(fraseObj => {
                        return fraseObj.frase.toLowerCase().includes(query) || fraseObj.autor_url.toLowerCase().includes(query);
                    });

                    // Mostrar resultados en la lista
                    frasesEncontradas.forEach(fraseObj => {
                        const li = document.createElement("a");
                        li.className = "list-group-item list-group-item-action";
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                        `;
                        resultadosBusqueda.appendChild(li);
                    });
                })
                .catch(error => console.error("Error al cargar frases para búsqueda:", error));
        }
    });
}

// Cargar frases de la categoría seleccionada en categoria.html
function cargarFrasesPorCategoria() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get("categoria");

    if (!categoriaSeleccionada) return;

    document.getElementById("titulo-categoria").innerText = `Frases de ${categoriaSeleccionada}`;
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaFrases = document.getElementById("lista-frases");
            data.frases.forEach(fraseObj => {
                if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.innerHTML = `
                        <p>${fraseObj.frase}</p>
                        <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                    `;
                    listaFrases.appendChild(li);
                }
            });
        })
        .catch(error => console.error("Error al cargar frases por categoría:", error));
}

// Cargar información del autor en autor.html
function cargarAutor() {
    const urlParams = new URLSearchParams(window.location.search);
    const autorSeleccionado = urlParams.get("autor");

    if (!autorSeleccionado) return;

    document.getElementById("titulo-autor").innerText = `Frases de ${autorSeleccionado}`;
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaFrases = document.getElementById("lista-frases-autor");
            data.frases.forEach(fraseObj => {
                if (fraseObj.autor_url === autorSeleccionado) {
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.innerHTML = `<p>${fraseObj.frase}</p>`;
                    listaFrases.appendChild(li);
                }
            });
        })
        .catch(error => console.error("Error al cargar frases del autor:", error));
}
