//compartirImagenAutor.js
const colorCategorias = {
    "Navidad": "badge-navidad",
    "Año Nuevo": "badge-ano-nuevo",
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
const urlCompartir = "https://cristian-000.github.io/frases-citas/index.html";

function obtenerClaseColor(categoria) {
    return colorCategorias[categoria] || colorCategorias["default"];
}
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos

// Función para inicializar el modal
function cargarAutor() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const autorSeleccionado = urlParams.get("autor");

        if (!autorSeleccionado) return resolve(); // Si no hay autor, resuelve inmediatamente

        // Título del autor
        const tituloAutor = document.getElementById("titulo-autor");
        tituloAutor.innerText = `Frases de ${capitalizarIniciales(autorSeleccionado)}`;
        tituloAutor.classList.add("text-center", "mb-4");

        // Fetch de frases
        fetch('frases.json')
            .then(response => response.json())
            .then(data => {
                const listaFrases = document.getElementById("lista-frases");
                listaFrases.innerHTML = ''; // Limpiar lista de frases

                data.frases.forEach(fraseObj => {
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
                                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" 
                                                data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                            <i class="fas fa-image"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${autorCapitalizado}');" title="Compartir">
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

                        // Asignar el evento click para hacer toggle
                        const heartButton = li.querySelector('.heart-button');
                        const icon = heartButton.querySelector('i');
                        heartButton.addEventListener('click', () => toggleFavorito(fraseObj, icon));

                        listaFrases.appendChild(li);
                    }
                });

                // Reactivar el modal para los nuevos botones (si no se hace esto, los botones dinámicos no abrirán el modal)
                const modales = document.querySelectorAll('[data-bs-toggle="modal"]');
                modales.forEach(button => {
                    const modalTarget = document.getElementById(button.getAttribute('data-bs-target').substring(1)); // Obtener el ID del modal
                    button.addEventListener('click', function () {
                        const modal = new bootstrap.Modal(modalTarget);
                        modal.show();
                    });
                });

                resolve();
            })
            .catch(error => {
                console.error("Error al cargar frases del autor:", error);
                reject(error);
            });
    });
}

// Configuración del modal para que solo se cierre con el botón de cerrar
const modalElement = document.getElementById('canvasModal');
const modal = new bootstrap.Modal(modalElement, {
    backdrop: 'static',  // No permite cerrar el modal al hacer clic fuera
    keyboard: false      // No permite cerrar el modal con la tecla ESC
});

// Reiniciar contenido del modal cuando se cierre
modalElement.addEventListener('hidden.bs.modal', function () {
    // Limpiar o reiniciar los elementos dentro del modal
    document.getElementById('miCanvas').getContext('2d').clearRect(0, 0, 400, 600);  // Limpiar canvas
    document.getElementById('titulo-autor').innerText = '';  // Limpiar título
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
    return texto.toLowerCase().split('-').map(palabra => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }).join(' '); // Reemplazamos el guión por un espacio
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


function ajustarCanvasTamano() {
    // Obtener el ancho del contenedor
    const canvasContainer = document.getElementById('canvas-container');
    const containerWidth = canvasContainer.offsetWidth - 30; // Reducir 10px como margen interno
    const containerHeight = window.innerHeight * 0.6; // 60% de la altura de la ventana

    // Ajustar dimensiones del canvas
    const canvas = document.getElementById('miCanvas');
    canvas.width = Math.max(containerWidth, 100); // Evitar que el ancho sea menor a 100px
    canvas.height = Math.max(containerHeight, 50); // Altura mínima

    actualizarCanvas(); // Redibujar contenido
}

// Ajustar el tamaño al cargar la página y al redimensionar
window.addEventListener('resize', ajustarCanvasTamano);

// Llama a cargarAutor al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    ajustarCanvasTamano();
    cargarAutor();
    actualizarCanvas();
    // Ocultar el canvas y controles de ajuste al inicio
    document.getElementById("canvas-container").style.display = "none";
    document.getElementById("barra-modificadores").style.display = "none";
});


const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";

// Opciones de personalización
const colorFondoInput = document.getElementById('colorFondo');
const colorFraseInput = document.getElementById('colorFrase');
const tamanoFraseInput = document.getElementById('tamanoFrase');
const posicionXInput = document.getElementById('posicionX');
const tipoFuenteInput = document.getElementById('tipoFuente');
const alineacionTextoInput = document.getElementById('alineacionTexto');
const posicionYInput = document.getElementById('posicionY'); // Captura el control de posición Y
const imagenFondoInput = document.getElementById('imagenFondo');
let imagenFondo = null;
colorFondoInput.addEventListener("input", function() {
    actualizarCanvas();
});
// Inicialización del canvas

tipoFuenteInput.value = "Arial"; // Tipo de fuente predeterminado

// Función para establecer una frase seleccionada y mostrar el canvas
function setFraseParaCompartir(frase, autor) {
    fraseSeleccionada = `${frase}\n- ${capitalizarIniciales(autor)}`;
    actualizarCanvas();
    document.getElementById("canvas-container").style.display = "block";
    document.getElementById("barra-modificadores").style.display = "flex";
}
alineacionTextoInput.addEventListener("input", function() {
    ctx.textAlign = alineacionTextoInput.value; // valores válidos: 'left', 'right', 'center', etc.
    actualizarCanvas();
});

// Ajuste de texto dentro del canvas
function ajustarTexto(ctx, texto, maxWidth, fontSize) {
    const palabras = texto.split(" ");
    let linea = "";
    const lineas = [];

    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    for (let i = 0; i < palabras.length; i++) {
        const pruebaLinea = linea + palabras[i] + " ";
        const ancho = ctx.measureText(pruebaLinea).width;
        if (ancho > maxWidth && i > 0) {
            lineas.push(linea);
            linea = palabras[i] + " ";
        } else {
            linea = pruebaLinea;
        }
    }
    lineas.push(linea);
    return lineas;
}

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
        // Dibujar la imagen ajustada
let imagenFondoPos = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, lastScale: 1 }; // Control de posición y escala
let isDragging = false;
let pinchStartDistance = 0;

function actualizarCanvas() {
    const scale = window.devicePixelRatio || 1;

    // Obtener el canvas y su contenedor
    const canvas = document.getElementById("miCanvas");
    const canvasContainer = document.getElementById("canvas-container");

    // Definir un alto fijo para el canvas
    const canvasHeight = 600; // Alto fijo de 600px
    const canvasWidth = canvasContainer.offsetWidth; // Ancho del canvas según el contenedor

    // Ajustar el tamaño del canvas
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth * scale; // Ajustar el tamaño real del canvas (sin CSS)
    canvas.height = canvasHeight * scale;

    // Obtener el contexto del canvas
    const ctx = canvas.getContext("2d");

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Establecer el fondo del canvas
    if (imagenFondo) {
        const imgWidth = imagenFondo.width * imagenFondoPos.scale;
        const imgHeight = imagenFondo.height * imagenFondoPos.scale;
        ctx.drawImage(
            imagenFondo,
            imagenFondoPos.x,
            imagenFondoPos.y,
            imgWidth,
            imgHeight
        );
    } else {
function actualizarCanvas() {
    const scale = window.devicePixelRatio || 1;

    // Obtener el canvas y su contenedor
    const canvas = document.getElementById("miCanvas");
    const canvasContainer = document.getElementById("canvas-container");

    // Definir un alto fijo para el canvas
    const canvasHeight = 600; // Alto fijo de 600px
    const canvasWidth = canvasContainer.offsetWidth; // Ancho del canvas según el contenedor

    // Ajustar el tamaño del canvas
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth * scale; // Ajustar el tamaño real del canvas (sin CSS)
    canvas.height = canvasHeight * scale;

    // Obtener el contexto del canvas
    const ctx = canvas.getContext("2d");

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Establecer el fondo del canvas
    if (imagenFondo) {
        const imgWidth = imagenFondo.width * imagenFondoPos.scale;
        const imgHeight = imagenFondo.height * imagenFondoPos.scale;
        ctx.drawImage(
            imagenFondo,
            imagenFondoPos.x,
            imagenFondoPos.y,
            imgWidth,
            imgHeight
        );
    } else {
        // Si no hay imagen de fondo, usar un color de fondo
        const colorFondo = colorFondoInput.value || "#ffffff"; // Usar blanco por defecto
        ctx.fillStyle = colorFondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Establecer las propiedades del texto
    const colorFrase = colorFraseInput.value || "#000000"; // Color del texto, por defecto negro
    const tamanoFrase = parseInt(tamanoFraseInput.value) || 30; // Tamaño del texto, por defecto 30px
    const tipoFuente = tipoFuenteInput.value || "Arial"; // Tipo de fuente, por defecto Arial
    const alineacionTexto = alineacionTextoInput.value || "center"; // Alineación del texto, por defecto al centro

    // Ajustar el texto a mostrar
    ctx.fillStyle = colorFrase;
    ctx.font = `${tamanoFrase * scale}px ${tipoFuente}`;
    ctx.textAlign = alineacionTexto;
    ctx.textBaseline = "middle"; // Asegura un centrado vertical adecuado

    // Asegurar que el texto no se desborde
    const maxWidth = canvas.width - 40 * scale; // Margen de 40px para evitar desbordes laterales
    const lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, tamanoFrase * scale);

    // Posicionar el texto dentro del canvas
    const lineHeight = tamanoFrase * scale * 1.5; // Altura entre líneas
    const posicionInicialY = parseInt(posicionYInput.value) || canvas.height / 2 - (lineas.length - 1) / 2 * lineHeight; // Ajusta verticalmente para centrar

    // Dibujar cada línea de texto
    lineas.forEach((linea, index) => {
        ctx.fillText(linea, canvas.width / 2, posicionInicialY + index * lineHeight);
    });

    // Agregar marca de agua si es necesario
    if (marcaDeAgua) {
        const fuenteMarca = 15 * scale;
        ctx.font = `${fuenteMarca}px ${tipoFuente}`;
        ctx.globalAlpha = 0.5; // Opacidad de la marca de agua
        ctx.fillStyle = "#000000";
        ctx.fillText(marcaDeAgua, canvas.width - 150 * scale, canvas.height - 20 * scale);
        ctx.globalAlpha = 1.0; // Restaurar opacidad
    }
}

// Funciones táctiles para mover y escalar la imagen de fondo
function initCanvasTouchControls() {
    const canvas = document.getElementById("miCanvas");

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touches = e.touches;

        if (touches.length === 1) {
            // Iniciar movimiento
            isDragging = true;
            const touch = touches[0];
            imagenFondoPos.startX = touch.clientX - imagenFondoPos.x;
            imagenFondoPos.startY = touch.clientY - imagenFondoPos.y;
        } else if (touches.length === 2) {
            // Iniciar zoom
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

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Inicializar controles táctiles
document.addEventListener("DOMContentLoaded", () => {
    actualizarCanvas();
    initCanvasTouchControls();
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
