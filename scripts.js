document.addEventListener("DOMContentLoaded", () => {
    const promises = [];

    if (document.getElementById("categorias")) {
        promises.push(cargarCategorias());
        promises.push(cargarFraseDelDia());
        configurarBarraBusqueda();
        //configurarBarraBusquedaCats()
    }
    if (document.getElementById("titulo-categoria")) {
        promises.push(cargarFrasesPorCategoria());
    }
    if (document.getElementById("titulo-autor")) {
        promises.push(cargarAutor());
    }
    configurarBarraBusquedaCats()
    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
        .then(() => console.log("Carga completada"))
        .catch(error => console.error("Error en la carga:", error));
});

const COLORCATEGORIAS = {
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
// Define la URL base como una variable global
const urlCompartir = "https://cristian-000.github.io/frases-citas/index.html";

function obtenerClaseColor(categoria) {
    return COLORCATEGORIAS[categoria] || COLORCATEGORIAS["default"];
}

async function cargarCategorias() {
    try {
        const response = await fetch('frases.json');
        const data = await response.json();

        const listaCategorias = document.getElementById("categorias");
        const categoriasConFrases = {};

        // Contamos cuántas frases hay en cada categoría
        data.frases.forEach(fraseObj => {
            fraseObj.categorias.forEach(categoria => {
                if (!categoriasConFrases[categoria]) {
                    categoriasConFrases[categoria] = 0;
                }
                categoriasConFrases[categoria]++;
            });
        });

        // Convertimos las categorías en un array de objetos para poder mezclarlas
        const categoriasArray = Object.keys(categoriasConFrases).map(categoria => ({
            nombre: categoria,
            cantidad: categoriasConFrases[categoria]
        }));

        // Función de mezcla aleatoria (Fisher-Yates)
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
            }
        }

        // Mezclamos el array de categorías
        shuffle(categoriasArray);

        // Creamos los elementos de categoría con la cantidad de frases
        categoriasArray.forEach(categoriaObj => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            // Agregamos la categoría y el badge con la cantidad de frases
            li.innerHTML = `
                <a href="categoria.html?categoria=${encodeURIComponent(categoriaObj.nombre)}">${categoriaObj.nombre}</a>
                <a href="categoria.html?categoria=${encodeURIComponent(categoriaObj.nombre)}">
                    <span class="badge ${obtenerClaseColor(categoriaObj.nombre)}">${categoriaObj.cantidad} frase${categoriaObj.cantidad !== 1 ? 's' : ''}</span>
                </a>
            `;
            listaCategorias.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

function cargarFraseDelDia() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("fechaFraseDelDia");
    const storedFrase = JSON.parse(localStorage.getItem("fraseDelDia"));

    if (storedDate === today && storedFrase) {
        // Leer y capitalizar autor desde el almacenamiento
        const autorCapitalizado = capitalizarIniciales(storedFrase.autor_url);

        // Mostrar frase guardada
        document.getElementById("frase-del-dia").innerHTML = `
        <h1 id="h1-frasedia" class="mb-0" aria-label="Frase del día">Frase del día</h1>
            <p class="frase-dia"><strong>${storedFrase.frase}</strong></p>
            <div>
                <small><a href="autor.html?autor=${storedFrase.autor_url}" class="autor-link">${autorCapitalizado}</a></small>
                ${storedFrase.categorias.map(categoria => `
                    <a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${obtenerClaseColor(categoria)} ml-3">${categoria}</a>
                `).join(' ')}
            </div>
        `;
    } else {
        // Obtener nueva frase si no está en almacenamiento o la fecha no coincide
        fetch('frases.json')
            .then(response => response.json())
            .then(data => {
                const fraseDelDia = data.frases[Math.floor(Math.random() * data.frases.length)];
                const autorCapitalizadoFD = capitalizarIniciales(fraseDelDia.autor_url);

                // Guardar frase y fecha en almacenamiento
                localStorage.setItem("fraseDelDia", JSON.stringify(fraseDelDia));
                localStorage.setItem("fechaFraseDelDia", today);

                // Mostrar nueva frase
                document.getElementById("frase-del-dia").innerHTML = `
                    <p><strong>${fraseDelDia.frase}</strong></p>
                    <div>
                        <small><a href="autor.html?autor=${fraseDelDia.autor_url}">${autorCapitalizadoFD}</a></small>
                        ${fraseDelDia.categorias.map(categoria => `
                            <a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${obtenerClaseColor(categoria)} ml-1">${categoria}</a>
                        `).join(' ')}
                    </div>
                `;
            })
            .catch(error => console.error("Error al cargar frase del día:", error));
    }
}

// Función para copiar la frase y el enlace al portapapeles
function copiarFrase(frase, url) {
    const textoCopiar = `${frase}\n${url}`;
    navigator.clipboard.writeText(textoCopiar)
        .then(() => {
            console.log(textoCopiar)
         //   alert("Frase copiada al portapapeles");
        })
        .catch(err => {
            console.error("Error al copiar:", err);
        });
}
// Función para compartir la frase seleccionada

function compartirFrase(frase, autor) {
    // Formatear el texto para compartir
    const textoCompartir = autor
        ? `"${frase}"\n- ${capitalizarIniciales(autor)}`
        : `"${frase}"`;
    const mensajeFinal = `${textoCompartir}\n\n`;

    if (navigator.share) {
        navigator.share({
            title: "Frase",
            text: mensajeFinal,
            url: urlCompartir // Algunos navegadores prefieren incluirlo aquí
        })
            .then(() => console.log("Frase compartida exitosamente"))
            .catch(error => console.error("Error al compartir:", error));
    } else {
        alert("La funcionalidad de compartir no está disponible en este navegador.");
    }
}
/*
// Función para capitalizar iniciales del autor
function capitalizarIniciales(nombre) {
    return nombre
        .split(" ")
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase().replace('-', ' '))
        .join(" ");
}*/
function capitalizarIniciales(nombre) {
    return nombre.replace(/(^|\s|-)+([a-z])/g, function(match, separador, letra) {
        return (separador ? " " : "") + letra.toUpperCase();
    });
}

function configurarBarraBusqueda() {
    const barraBusqueda = document.getElementById("barra-busqueda");
    const resultadosBusqueda = document.getElementById("resultados-busqueda");

    barraBusqueda.addEventListener("input", () => {
        const query = barraBusqueda.value.toLowerCase();
        resultadosBusqueda.innerHTML = "";

        if (query) {
            fetch('frases.json')
                .then(response => response.json())
                .then(data => {
                    const frasesEncontradas = data.frases.filter(fraseObj =>
                        fraseObj.frase.toLowerCase().includes(query) ||
                        fraseObj.autor_url.toLowerCase().includes(query) ||
                        fraseObj.categorias.some(categoria => categoria.toLowerCase().includes(query))
                    );

                    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos


                    if (frasesEncontradas.length === 0) {
                        const noResultados = document.createElement("li");
                        noResultados.classList.add("list-group-item", "text-center", "text-muted");
                        noResultados.textContent = "No se encontraron coincidencias";
                        resultadosBusqueda.appendChild(noResultados);
                    } else {
                        frasesEncontradas.forEach(fraseObj => {
                            const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);

                            // Verificar si la frase está en los favoritos
                            const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);

                            const li = document.createElement("li");
                            li.className = "d-flex justify-content-between align-items-center";

                            li.innerHTML = `
                        <div class="w-100 frase-content">
                            <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <small><a href="autor.html?autor=${fraseObj.autor_url}" class="autor-link">${autorCapitalizado}</a></small>
                                    ${fraseObj.categorias.map(categoria => {
                                // Aplicar la función obtenerClaseColor para obtener el color adecuado
                                const claseColor = obtenerClaseColor(categoria);
                                return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
                            }).join(' ')}
                                </div>
                                <div class="button-group d-flex align-items-center mr-1">
                                  <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                                <i class="fas fa-image"></i>
                                            </button>
                                    <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}');" title="Compartir">
                                        <i class="fas fa-share-alt"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                    <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                        <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                            resultadosBusqueda.appendChild(li);

                            // Asignar el evento de clic al botón de favoritos
                            li.querySelector(".heart-button").addEventListener("click", (e) => {
                                toggleFavorito(fraseObj, e.currentTarget.querySelector("i"));
                            });
                        })
                    }

                })
                .catch(error => console.error("Error al cargar frases para búsqueda:", error));
        }
    });
}

function configurarBarraBusquedaCats() {
    const listaFrases = document.getElementById("lista-frases-cat");
    const barraBusquedaCat = document.getElementById("barra-busqueda-cat");
    const resultadosBusquedaCat = document.getElementById("resultados-busqueda-cat");

    barraBusquedaCat.addEventListener("input", () => {
        const query = barraBusquedaCat.value.toLowerCase();
        resultadosBusquedaCat.innerHTML = "";

        if (query.trim() === "") {
            // Show main list, hide search results
            listaFrases.style.display = "block";
            resultadosBusquedaCat.style.display = "none";
        } else {
            // Hide main list, show search results
            listaFrases.style.display = "none";
            resultadosBusquedaCat.style.display = "block";
            fetch('frases.json')
                .then(response => response.json())
                .then(data => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const selectedCategory = urlParams.get('categoria'); // Get category from URL

                    const frasesEncontradas = data.frases.filter(fraseObj => {
                        const matchesQuery = fraseObj.frase.toLowerCase().includes(query) ||
                            fraseObj.autor_url.toLowerCase().includes(query) ||
                            fraseObj.categorias.some(categoria => categoria.toLowerCase().includes(query));

                        // Filter by category only if a category is selected in the URL
                        return matchesQuery && (!selectedCategory || fraseObj.categorias.includes(selectedCategory));
                    });

                    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos

                    if (frasesEncontradas.length === 0) {
                        const noResultados = document.createElement("li");
                        noResultados.classList.add("list-group-item", "text-center", "text-muted");
                        noResultados.textContent = "No se encontraron coincidencias";
                        resultadosBusquedaCat.appendChild(noResultados);
                    } else {
                        frasesEncontradas.forEach(fraseObj => {
                            const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);

                            // Verificar si la frase está en los favoritos
                            const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);

                            const li = document.createElement("li");
                            li.className = "d-flex justify-content-between align-items-center";

                            li.innerHTML = `
                    <div class="w-100 frase-content frase-content-search-cat">
                        <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small><a href="autor.html?autor=${fraseObj.autor_url}" class="autor-link">${autorCapitalizado}</a></small>
                                ${fraseObj.categorias.map(categoria => {
                                // Aplicar la función obtenerClaseColor para obtener el color adecuado
                                const claseColor = obtenerClaseColor(categoria);
                                return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
                            }).join(' ')}
                            </div>
                            <div class="button-group d-flex align-items-center mr-1">
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                    <i class="fas fa-image"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}');" title="Compartir">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                    <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                            resultadosBusquedaCat.appendChild(li);

                            // Asignar el evento de clic al botón de favoritos
                            li.querySelector(".heart-button").addEventListener("click", (e) => {
                                toggleFavorito(fraseObj, e.currentTarget.querySelector("i"));
                            });
                        });
                    }
                })
                .catch(error => console.error("Error al cargar frases para búsqueda:", error));
        }
    });
}

function cargarFrasesPorCategoria() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get("categoria");

    if (!categoriaSeleccionada) return;

    document.getElementById("titulo-categoria").innerText = `Frases de ${categoriaSeleccionada}`;
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaFrases = document.getElementById("lista-frases-cat");
            listaFrases.innerHTML = '';



            data.frases.forEach(fraseObj => {
                const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);
                const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos
                if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                    const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);

                    const li = document.createElement("li");
                    li.className = "d-flex justify-content-between align-items-center";
                    li.innerHTML = `
                    <div class="w-100 frase-content">
                        <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="badges">
                                <small><a href="autor.html?autor=${fraseObj.autor_url}" class="autor-link">${autorCapitalizado}</a></small>
                                ${fraseObj.categorias.map(categoria => {
                        const claseColor = obtenerClaseColor(categoria);
                        return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
                    }).join(' ')}
                            </div>
                            <div class="button-group d-flex align-items-center mr-1">
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                    <i class="fas fa-image"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}');" title="Compartir">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                    <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                                </button>
                         
                            </div>
                        </div>
                    </div>
                `;


                    // Agregar evento para el corazón
                    li.querySelector(".heart-button").addEventListener("click", (e) => {
                        toggleFavorito(fraseObj, e.currentTarget.querySelector("i"));
                    });

                    listaFrases.appendChild(li);
                }
            });
        })
        .catch(error => console.error("Error al cargar frases por categoría:", error));
}

function toggleFavorito(fraseObj, icon) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const index = favoritos.findIndex(fav => fav.frase === fraseObj.frase);

    if (index !== -1) {
        // Eliminar de favoritos
        favoritos.splice(index, 1);
        icon.classList.replace("fas", "far");  // Cambiar a corazón vacío
    } else {
        // Agregar a favoritos
        favoritos.push(fraseObj);
        icon.classList.replace("far", "fas");  // Cambiar a corazón relleno
    }

    // Actualizar localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

