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
                        bioAutor.innerHTML = `<p class="mb-4 text-center text-muted">${autor.biografia || "Sin biografía disponible."}</p>`;
                       
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
                                                return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
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
                                            <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
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
                }else{
                    tituloAutor.innerText = "Autor no encontrado";
                    tituloAutor.classList.add("text-center", "mb-2");
                    if (bioAutor) {
                        bioAutor.innerHTML = `<p class="mb-4 text-center text-muted">El autor no existe en nuestra base de datos</p>`;
                       
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


// Configuración del modal para que solo se cierre con el botón de cerrar
const modalElement = document.getElementById('canvasModal');
// Reiniciar contenido del modal cuando se cierre
modalElement.addEventListener('hidden.bs.modal', function () {
    // Limpiar o reiniciar los elementos dentro del modal
    document.getElementById('miCanvas').getContext('2d').clearRect(0, 0, 400, 600);  // Limpiar canvas
    // document.getElementById('titulo-autor').innerText = '';  // Limpiar título
    // Otros elementos dentro del modal pueden ser reiniciados aquí
});



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
            alert("Frase copiada al portapapeles");
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

const canvas = document.getElementById('miCanvas');
const canvasContainer = document.getElementById('canvas-container');




// Llama a cargarAutor al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // ajustarCanvasTamano();
    cargarAutor();
    actualizarCanvas();
    // Ocultar el canvas y controles de ajuste al inicio
    document.getElementById("canvas-container").style.display = "none";
    document.getElementById("barra-modificadores").style.display = "none";
});



const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";

// Opciones de personalización
const colorFondoInput = document.getElementById('colorFondo');
const colorFraseInput = document.getElementById('colorFrase');
const tamanoFraseInput = document.getElementById('tamanoFrase');
//const posicionXInput = document.getElementById('posicionX');
const tipoFuenteInput = document.getElementById('tipoFuente');
const alineacionTextoInput = document.getElementById('alineacionTexto');
const posicionYInput = document.getElementById('posicionY'); // Captura el control de posición Y
const imagenFondoInput = document.getElementById('imagenFondo');
let imagenFondo = null;
colorFondoInput.addEventListener("input", function () {
    actualizarCanvas();
});
const removeFondoCheckbox = document.getElementById('removeFondoCheckbox');

// Función para confirmar el reseteo
const botonReset = document.getElementById('boton-reset');
function confirmarReseteo() {
    if (confirm('¿Estás seguro de que deseas restablecer el canvas? Se perderán todos los cambios.')) {
        resetearCanvas(); // La función que ya definiste anteriormente
    }
}

function resetearCanvas() {
    // Valores por defecto
    fraseSeleccionada = "";
    colorFondoInput.value = "#ffffff";
    colorFraseInput.value = "#000000";
    tamanoFraseInput.value = 20;
    tipoFuenteInput.value = "Arial";
    alineacionTextoInput.value = "center";
    posicionYInput.value = canvas.height / 2; // Centrar verticalmente
    imagenFondo = null;
    removeFondoCheckbox.checked = false;
    imagenFondoPos = { x: 0, y: 0, scale: 1 };
imagenFondoPos.initialized = false; 
    // Resetear favoritos
    localStorage.removeItem("favoritos");

    // Resetear elementos del DOM
    //const listaFrases = document.getElementById("lista-frases");
    //listaFrases.innerHTML = '';

    // Resetear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ocultar elementos si es necesario
     // Cerrar el modal utilizando el atributo data-bs-dismiss
     const botonCerrarModal = document.querySelector('#btn-close'); // Ajusta el selector según tu HTML
     botonCerrarModal.click();
    // Volver a dibujar el canvas con los valores iniciales
    actualizarCanvas();
}
tipoFuenteInput.value = "Arial"; // Tipo de fuente predeterminado

// Función para establecer una frase seleccionada y mostrar el canvas
function setFraseParaCompartir(frase, autor) {
    fraseSeleccionada = `${frase} \n -${capitalizarIniciales(autor)}`;
    actualizarCanvas();
    document.getElementById("canvas-container").style.display = "block";
    document.getElementById("barra-modificadores").style.display = "flex";
}


removeFondoCheckbox.addEventListener("change", function () {
    if (removeFondoCheckbox.checked) {
        // Si el checkbox está marcado, eliminar la imagen de fondo
        imagenFondo = null;
        actualizarCanvas(); // Redibujar el canvas sin fondo
    } else {
        // Si el checkbox no está marcado, restaurar la imagen de fondo
        if (imagenFondo) {
            actualizarCanvas(); // Redibujar el canvas con la imagen de fondo
        }
    }
});
imagenFondoInput.addEventListener('change', (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        imagenFondo = new Image();
        imagenFondo.src = URL.createObjectURL(archivo);
        imagenFondo.onload = () => {
            actualizarCanvas();
        };
    }
});

// Variable para la marca de agua
const marcaDeAgua = urlCompartir; // Cambiar a tu URL deseada

// Variables para la posición y escala de la imagen de fondo
let imagenFondoPos = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, lastScale: 1 };
let isDragging = false;
let pinchStartDistance = 0;
let dragStart = { x: 0, y: 0 };

// Ajuste de texto dentro del canvas
function ajustarTexto(ctx, texto, maxWidth, fontSize) {
    const lineasFinales = [];
    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    // Dividir texto por saltos de línea explícitos
    const lineas = texto.split("\n");

    lineas.forEach(linea => {
        const palabras = linea.split(" ");
        let lineaActual = "";

        // Ajustar cada línea al ancho máximo permitido
        for (let i = 0; i < palabras.length; i++) {
            const pruebaLinea = lineaActual + palabras[i] + " ";
            const ancho = ctx.measureText(pruebaLinea).width;

            if (ancho > maxWidth && i > 0) {
                lineasFinales.push(lineaActual.trim());
                lineaActual = palabras[i] + " ";
            } else {
                lineaActual = pruebaLinea;
            }
        }

        // Añadir la última línea procesada
        if (lineaActual) {
            lineasFinales.push(lineaActual.trim());
        }
    });

    return lineasFinales;
}
imagenFondoPos.initialized = false;

function actualizarCanvas() {
    //const scale = window.devicePixelRatio || 1;
    
    const windowHeight = window.innerHeight;
    const desiredHeight = windowHeight * 0.7;
    const canvasHeight = desiredHeight; // Alto fijo
    const canvasWidth = canvasContainer.offsetWidth ;
    
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;


    // const ctx = canvas.getContext("2d");
    /*ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imagenFondo) {
        const imgWidth = imagenFondo.width;
        const imgHeight = imagenFondo.height;
        ctx.drawImage(
            imagenFondo,
            imagenFondoPos.x,
            imagenFondoPos.y,
            imgWidth,
            imgHeight
        );
    } else {
        const colorFondo = colorFondoInput.value || "#ffffff";
        ctx.fillStyle = colorFondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }*/
// Limpia el canvas
// Limpia el canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

if (imagenFondo) {
    // Si es la primera vez, inicializa la posición para centrarla
    if (!imagenFondoPos.initialized) {
        imagenFondoPos.x = (canvas.width - imagenFondo.width) / 2;
        imagenFondoPos.y = (canvas.height - imagenFondo.height) / 2;
        imagenFondoPos.initialized = true; // Marca como inicializado
    }

    // Dibuja la imagen en su posición actual
    const imgWidth = imagenFondo.width;
    const imgHeight = imagenFondo.height;
    ctx.drawImage(imagenFondo, imagenFondoPos.x, imagenFondoPos.y, imgWidth, imgHeight);
} else {
    // Dibuja el fondo de color si no hay imagen
    const colorFondo = colorFondoInput.value || "#ffffff";
    ctx.fillStyle = colorFondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
    const colorFrase = colorFraseInput.value || "#000000";
    const tamanoFrase = parseInt(tamanoFraseInput.value) || 20;
    const tipoFuente = tipoFuenteInput.value || "Arial";
    const alineacionTexto = alineacionTextoInput.value || "center";

    ctx.fillStyle = colorFrase;
    ctx.font = `${tamanoFrase}px ${tipoFuente}`;
    ctx.textBaseline = "middle";

    const maxWidth = canvas.width - 40; // Margen de 50px a cada lado
    const lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, tamanoFrase);

    const lineHeight = tamanoFrase * 1.3;

    posicionYInput.min = 5 + lineHeight; // Valor mínimo (ajustable según tus necesidades)
    posicionYInput.max = (canvas.height - 70) - lineHeight; // Valor máximo, dejando un margen inferior
    const posicionInicialY =
        parseInt(posicionYInput.value) ||
        canvas.height / 2 - ((lineas.length - 1) / 2) * lineHeight;

    lineas.forEach((linea, index) => {
        let posicionX = canvas.width / 2; // Predeterminado para "center"
        if (alineacionTexto === "left") {
            ctx.textAlign = "left";
            posicionX = (canvas.width * 0.02); // Margen izquierdo
        } else if (alineacionTexto === "right") {
            ctx.textAlign = "right";
            posicionX = (canvas.width * 0.98) ; // Margen derecho
        } else {
            ctx.textAlign = "center";
        }

        ctx.fillText(linea, posicionX, posicionInicialY + index * lineHeight);
    });

    if (marcaDeAgua) {
        // Dibujar marca de agua centrada
        const marcaAgua = urlCompartir;
        const tamanoMarca = 14; // Tamaño de fuente fijo o ajustable
        ctx.font = `${tamanoMarca}px Arial`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Color semitransparente
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Asegura el centrado vertical
        ctx.fillText(marcaAgua, (canvas.width / 2), canvas.height - 20 );
    }
}
function initCanvasMouseControls() {
    const canvas = document.getElementById("miCanvas");

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStart.x = e.clientX - imagenFondoPos.x;
        dragStart.y = e.clientY - imagenFondoPos.y;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            imagenFondoPos.x = e.clientX - dragStart.x;
            imagenFondoPos.y = e.clientY - dragStart.y;
            actualizarCanvas();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
    });
}

function initCanvasTouchControls() {
    const canvas = document.getElementById("miCanvas");

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touches = e.touches;

        if (touches.length === 1) {
            isDragging = true;
            const touch = touches[0];
            imagenFondoPos.startX = touch.clientX - imagenFondoPos.x;
            imagenFondoPos.startY = touch.clientY - imagenFondoPos.y;
        } else if (touches.length === 2) {
            pinchStartDistance = getDistance(
                touches[0].clientX,
                touches[0].clientY,
                touches[1].clientX,
                touches[1].clientY
            );
            imagenFondoPos.lastScale = imagenFondoPos.scale;
        }
    });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touches = e.touches;

        if (touches.length === 1 && isDragging) {
            const touch = touches[0];
            imagenFondoPos.x = touch.clientX - imagenFondoPos.startX;
            imagenFondoPos.y = touch.clientY - imagenFondoPos.startY;
        } else if (touches.length === 2) {
            const currentDistance = getDistance(
                touches[0].clientX,
                touches[0].clientY,
                touches[1].clientX,
                touches[1].clientY
            );
            imagenFondoPos.scale =
                (currentDistance / pinchStartDistance) * imagenFondoPos.lastScale;
        }

        actualizarCanvas();
    });

    canvas.addEventListener("touchend", (e) => {
        isDragging = false;
        if (e.touches.length === 0) {
            pinchStartDistance = 0;
        }
    });
}
/* function initCanvasMouseControls() {
    const canvas = document.getElementById("miCanvas");
    const ctx = canvas.getContext("2d");
    let isDragging = false;
    const dragStart = { x: 0, y: 0 };
    const imagenFondoPos = { x: 0, y: 0 };
    let scale = 1;
    const scaleStep = 0.1; // Incremento o decremento del zoom

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStart.x = e.clientX - imagenFondoPos.x;
        dragStart.y = e.clientY - imagenFondoPos.y;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            imagenFondoPos.x = e.clientX - dragStart.x;
            imagenFondoPos.y = e.clientY - dragStart.y;
            actualizarCanvas();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        // Calcula el nuevo factor de escala
        const delta = Math.sign(e.deltaY);
        const prevScale = scale;
        scale = Math.min(Math.max(scale - delta * scaleStep, 0.5), 3); // Limita el zoom entre 0.5 y 3

        // Calcula las coordenadas del mouse en el canvas antes del zoom
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - imagenFondoPos.x) / prevScale;
        const mouseY = (e.clientY - rect.top - imagenFondoPos.y) / prevScale;

        // Ajusta la posición para mantener el punto del mouse fijo durante el zoom
        imagenFondoPos.x -= (mouseX * (scale - prevScale));
        imagenFondoPos.y -= (mouseY * (scale - prevScale));

        actualizarCanvas();
    });

    function actualizarCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(imagenFondoPos.x, imagenFondoPos.y);
        ctx.scale(scale, scale);

        // Aquí se dibuja tu contenido, ajusta según lo que necesites
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

        ctx.restore();
    }

    actualizarCanvas();
}*/
/*let isDragging = false;
let lastTouchDistance = 0;

// Evento para inicio de toque
canvas.addEventListener("touchstart", function (e) {
    if (e.touches.length === 2) {
        // Dos dedos: iniciar redimensión
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    } else if (e.touches.length === 1) {
        // Un dedo: iniciar movimiento
        isDragging = true;
    }
}); 

// Evento para mover o redimensionar
canvas.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        // Dos dedos: redimensionar
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentTouchDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        const scaleChange = currentTouchDistance / lastTouchDistance;
        imagenFondoPos.scale *= scaleChange;
        lastTouchDistance = currentTouchDistance;

        actualizarCanvas();
    } else if (e.touches.length === 1 && isDragging) {
        // Un dedo: mover
        const touch = e.touches[0];
        imagenFondoPos.x += touch.movementX || 0;
        imagenFondoPos.y += touch.movementY || 0;

        actualizarCanvas();
    }
});

// Evento para finalizar toque
canvas.addEventListener("touchend", function (e) {
    isDragging = false;
    lastTouchDistance = 0;
});*/
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarCanvas();
    initCanvasTouchControls();
    initCanvasMouseControls();
});


// Escuchar cuando el modal se abre para ajustar el canvas
$('#canvasModal').on('shown.bs.modal', function () {
    actualizarCanvas();
});
// Elimina la capa de fondo cuando el modal se cierra
$('#canvasModal').on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove(); // Elimina el fondo opaco
});


// Event listeners para actualizaciones en tiempo real
[...document.querySelectorAll("input, select")].forEach(el => {
    el.addEventListener('input', actualizarCanvas);
});

// Función para descargar la imagen del canvas
function descargarImagen() {
    const fecha = new Date().toISOString().split('T')[0];
    const fraseCorta = fraseSeleccionada.split(' - ')[0].substring(0, 15).replace(/\s+/g, '_');
    const nombreArchivo = `${fraseCorta}_${fecha}.png`;

    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = nombreArchivo;
    enlace.click();
}

document.getElementById('botonDescargar').addEventListener('click', descargarImagen);

document.getElementById('botonShare').addEventListener('click', async () => {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (navigator.canShare({ files: [new File([blob], "imagen.png", { type: "image/png" })] })) {
            const file = new File([blob], "imagen.png", { type: "image/png" });
            await navigator.share({
                files: [file],
                title: 'Mira esta imagen',
                text: '¡Mira la imagen que creé!',
            });
        } else {
            alert("Tu dispositivo no admite la función de compartir archivos.");
        }
    } catch (error) {
        console.error("Error al compartir la imagen:", error);
        alert("Hubo un error al intentar compartir la imagen.");
    }
});
//cerrador de minipanel 
document.querySelectorAll('#barra-modificadores label').forEach(label => {
    const inputOrSelect = label.querySelector('input, select');

    if (inputOrSelect) {
        // Cierra el panel al cambiar el valor
        inputOrSelect.addEventListener('change', () => {
            inputOrSelect.style.display = 'none';
        });

        // Mantiene el panel cerrado al hacer clic fuera
        inputOrSelect.addEventListener('blur', () => {
            inputOrSelect.style.display = 'none';
        });

        // Opcional: abre el panel cuando se enfoca
        label.addEventListener('click', () => {
            inputOrSelect.style.display = 'block';
        });
    }
});

// Ajustar el tamaño al cargar la página y al redimensionar
window.addEventListener('resize', actualizarCanvas);
