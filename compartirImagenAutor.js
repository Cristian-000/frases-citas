//compartirImagenAutor.js
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
const urlCompartir = "https://cristian-000.github.io/frases-citas/index.html";

function obtenerClaseColor(categoria) {
    return colorCategorias[categoria] || colorCategorias["default"];
}
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos


function cargarAutor() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const autorSeleccionado = urlParams.get("autor");

        if (!autorSeleccionado) return resolve();

        Promise.all([fetch('frases.json'), fetch('autores.json')])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(([frasesData, autoresData]) => {
                const tituloAutor = document.getElementById("titulo-autor");
                const bioAutor = document.getElementById("bio-autor"); // Obtener el elemento de la biografía
                const listaFrases = document.getElementById("lista-frases");
                listaFrases.innerHTML = '';

                // Buscar la información del autor
                const autor = autoresData.autores.find(a => a.autor_url === autorSeleccionado);

                if (autor) { //Si se encuentra al autor
                    tituloAutor.innerText = `Frases de ${autor.nombre}`;
                    tituloAutor.classList.add("text-center", "mb-2");

                    if (bioAutor) {
                        bioAutor.innerHTML = `<p class="mb-2 text-center text-muted">${autor.biografia || "Sin biografía disponible."}</p>`;

                    }

                    frasesData.frases.forEach(fraseObj => {
                        if (fraseObj.autor_url === autorSeleccionado) {
                            const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);
                            const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);
                            const li = document.createElement("li");
                            li.className = "w-100 list-unstyled mb-1";
                            li.innerHTML = `
                                <div class="w-100 frase-content">
                                    <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            ${fraseObj.categorias.map(categoria => {
                                const claseColor = obtenerClaseColor(categoria);
                                return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} mr-1">${categoria}</a>`;
                            }).join(' ')}
                                        </div>
                                        <div class="button-group d-flex align-items-center mr-1">
                                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                                <i class="fas fa-image"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${autorCapitalizado}');" title="Compartir">
                                                <i class="fas fa-share"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                                <i class="fas fa-copy"></i>
                                            </button>
                                            <button class="btn btn-link heart-button" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                                <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;

                            const heartButton = li.querySelector('.heart-button');
                            const icon = heartButton.querySelector('i');
                            heartButton.addEventListener('click', () => toggleFavorito(fraseObj, icon));
                            listaFrases.appendChild(li);
                        }
                    });

                    const modales = document.querySelectorAll('[data-bs-toggle="modal"]');
                    modales.forEach(button => {
                        const modalTarget = document.getElementById(button.getAttribute('data-bs-target').substring(1));
                        button.addEventListener('click', function () {
                            const modal = new bootstrap.Modal(modalTarget);
                            modal.show();
                        });
                    });
                } else {
                    tituloAutor.innerText = "Autor no encontrado";
                    tituloAutor.classList.add("text-center", "mb-2");
                    if (bioAutor) {
                        bioAutor.innerHTML = `<p class="mb-2 text-center text-muted">El autor no existe en nuestra base de datos</p>`;

                    }

                }
                resolve();
            })
            .catch(error => {
                console.error("Error al cargar datos:", error);
                reject(error);
            });
    });
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


function capitalizarIniciales(texto) {
    return texto
        .toLowerCase() // Convertir todo el texto a minúsculas
        .split(/[-\s]/) // Dividir por guiones o espacios
        .map(palabra => {
            // Capitalizar la primera letra de cada palabra
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(' '); // Volver a unir las palabras con espacios
}
// Función para copiar la frase y el enlace al portapapeles
function copiarFrase(frase, url) {
    const textoCopiar = `${frase}\n${url}`;
    navigator.clipboard.writeText(textoCopiar)
        .then(() => {
            console.log(textoCopiar)
            //  alert("Frase copiada al portapapeles");
        })
        .catch(err => {
            console.error("Error al copiar:", err);
        });
}
// Función para compartir la frase seleccionada
function compartirFrase(frase, autor) {
    // Añade el salto de línea para que el autor quede debajo de la frase
    const textoCompartir = `${frase}\n- ${capitalizarIniciales(autor)}`;
    //const urlCompartir = window.location.href; // URL actual

    if (navigator.share) {
        navigator.share({
            title: "Frase Inspiradora",
            text: textoCompartir,
            url: urlCompartir
        })
            .then(() => console.log("Frase compartida exitosamente"))
            .catch(error => console.error("Error al compartir:", error));
    } else {
        alert("La funcionalidad de compartir no está disponible en este navegador.");
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("canvas-container").style.display = "none";
    document.getElementById("barra-modificadores").style.display = "none";
    cargarAutor();
    actualizarCanvas();
    initCanvasTouchControls();
    initCanvasMouseControls();

});

/////////////////////////////////////////////////////
