
const imagenesPredefinidas = [
    "./img-precarg/1.jpeg",
    "./img-precarg/2.jpeg",
    "./img-precarg/3.jpeg",
    "./img-precarg/4.jpeg",
    "./img-precarg/5.jpeg",
    "./img-precarg/6.jpeg",
    "./img-precarg/7.jpeg",
    "./img-precarg/8.jpeg",
    "./img-precarg/9.jpeg",
    "./img-precarg/11.jpeg",
    "./img-precarg/12.jpeg",
    "./img-precarg/13.jpeg",
    "./img-precarg/14.jpeg",
    "./img-precarg/15.jpeg",
    "./img-precarg/16.jpeg",
    "./img-precarg/17.jpeg",
    "./img-precarg/18.jpeg",
    "./img-precarg/19.jpeg",
    "./img-precarg/20.jpeg",
    "./img-precarg/21.jpeg",
    "./img-precarg/22.jpeg",
    "./img-precarg/23.jpeg",
    "./img-precarg/24.jpeg",
    "./img-precarg/25.jpeg",
    "./img-precarg/26.jpeg",
    "./img-precarg/27.jpeg",
    "./img-precarg/28.jpeg",
    "./img-precarg/29.jpeg",
    "./img-precarg/30.jpeg",
    "./img-precarg/31.jpeg",
    "./img-precarg/32.jpeg",
    "./img-precarg/33.jpeg",
    "./img-precarg/34.jpeg",
    "./img-precarg/35.jpeg",
    
    // ... más imágenes
];

const selectImagenPredefinida = document.getElementById('selectImagenPredefinida');
const modalImagenes = new bootstrap.Modal(document.getElementById('modalImagenes'));
const btnSeleccionarImagen = document.getElementById('btnSeleccionarImagen');
const seleccionarImagenPredefinidaBtn = document.getElementById('seleccionarImagenPredefinida');
/*
// Llenar el select con las opciones
imagenesPredefinidas.forEach((url, index) => {
    const option = document.createElement('option');
    option.value = url;
    option.text = `Imagen ${index + 1}`;
    selectImagenPredefinida.appendChild(option);
});*/
//const modal = new bootstrap.Modal(document.getElementById('modalImagenes'));

const contenedorImagenes = document.getElementById('contenedorImagenes');
let imagenSeleccionada = null; // Guardar la URL de la imagen seleccionada
let imagenFondoOriginal = null;

// Llenar el contenedor con miniaturas
imagenesPredefinidas.forEach((url) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Miniatura';
    img.loading = "lazy"
    img.addEventListener('click', () => {
        // Quitar la clase 'selected' de cualquier otra miniatura
        document.querySelectorAll('#contenedorImagenes img').forEach((img) => img.classList.remove('selected'));
        // Agregar la clase 'selected' a la miniatura clickeada
        img.classList.add('selected');
        // Guardar la URL seleccionada
        imagenSeleccionada = url;
        // Habilitar el botón de selección
        btnSeleccionarImagen.disabled = false;
    });
    contenedorImagenes.appendChild(img);
});
//
btnSeleccionarImagen.addEventListener('click', () => {
    if (imagenSeleccionada) {
        const nuevaImagen = new Image();
        nuevaImagen.src = imagenSeleccionada;
        nuevaImagen.onload = () => {
            imagenFondo = nuevaImagen;
            imagenFondoPos.initialWidth = imagenFondo.width;
            imagenFondoPos.initialHeight = imagenFondo.height;
            //Reseteo de Posicion
            imagenFondoPos.x = (canvas.width - imagenFondo.width) / 2;
            imagenFondoPos.y = (canvas.height - imagenFondo.height) / 2;
            imagenFondoPos.scale = 1
            imagenFondoOriginal = imagenFondo; // Guarda la imagen original
            actualizarCanvas();
            modalImagenes.hide();
        };
    }
});

seleccionarImagenPredefinidaBtn.addEventListener('click', () => {
    modalImagenes.show();
});


btnSeleccionarImagen.addEventListener('click', () => {
    const selectedUrl = selectImagenPredefinida.value;

    // Crear una nueva imagen
    const nuevaImagen = new Image();
    nuevaImagen.src = selectedUrl;

    // Esperar a que la imagen se cargue completamente
    nuevaImagen.onload = () => {
        // Asignar la nueva imagen al fondo del canvas
        imagenFondo = nuevaImagen;

        // Ajustar el tamaño y posición de la imagen en el canvas
        // Aquí puedes ajustar el tamaño y la posición de la imagen según tus necesidades
        // Por ejemplo:
        imagenFondoPos.initialWidth = imagenFondo.width;
        imagenFondoPos.initialHeight = imagenFondo.height;
        // ... (otros ajustes)

        // Redibujar el canvas para mostrar la nueva imagen
        actualizarCanvas();

    };
});
function setFraseParaCompartir(frase, autor) {
    fraseSeleccionada = frase;
    autorSeleccionado = capitalizarIniciales(autor); // Guarda el autor separado
    actualizarCanvas();
    document.getElementById("canvas-container").style.display = "block";
    document.getElementById("barra-modificadores").style.display = "flex";
}

// Configuración del modal para que solo se cierre con el botón de cerrar
const modalElement = document.getElementById('canvasModal');

// Reiniciar contenido del modal cuando se cierre
modalElement.addEventListener('hidden.bs.modal', function () {
    // Limpiar o reiniciar los elementos dentro del modal
    document.getElementById('miCanvas').getContext('2d').clearRect(0, 0, 400, 600);  // Limpiar canvas
    $('.modal-backdrop').remove(); // Elimina el fondo opaco
    // document.getElementById('titulo-autor').innerText = '';  // Limpiar título
    // Otros elementos dentro del modal pueden ser reiniciados aquí
});


const canvas = document.getElementById('miCanvas');
const canvasContainer = document.getElementById('canvas-container');

const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";
let autorSeleccionado = ""; // Autor actual
let mostrarAutor = true; // Control para mostrar/ocultar autor

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
/*colorFondoInput.addEventListener("input", function () {
    actualizarCanvas();
});*/
const removeFondoCheckbox = document.getElementById('removeFondoCheckbox');

tipoFuenteInput.value = "Arial"; // Tipo de fuente predeterminado



// Variable para la marca de agua
const marcaDeAgua = "https://frasescitas.net"; // Cambiar a tu URL deseada

// Variables para la posición y escala de la imagen de fondo
let imagenFondoPos = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, lastScale: 1, initialWidth: 0, initialHeight: 0 }; // Guarda dimensiones originales
let isDragging = false;
let pinchStartDistance = 0;
let dragStart = { x: 0, y: 0 };
let minScale = 0.1; // Escala mínima
let maxScale = 4;   // Escala máxima


imagenFondoInput.addEventListener('change', (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        imagenFondo = new Image();
        imagenFondo.src = URL.createObjectURL(archivo);
        imagenFondo.onload = () => {
            imagenFondoPos = { x: 0, y: 0, scale: 1, startX: 0, startY: 0, lastScale: 1, initialWidth: 0, initialHeight: 0 };
            isDragging = false;
            pinchStartDistance = 0;
            dragStart = { x: 0, y: 0 };
            minScale = 0.1;
            maxScale = 4;
            imagenFondoOriginal = imagenFondo; // Guarda la imagen original
            actualizarCanvas();
        };
    }
});

removeFondoCheckbox.addEventListener("change", function () {
    if (removeFondoCheckbox.checked) {
        imagenFondo = null;
        actualizarCanvas();
    } else {
        imagenFondo = imagenFondoOriginal;
        if(imagenFondo){//verifica que exista una imagen
          actualizarCanvas();
        }
    }
});



function ajustarTexto(ctx, texto, maxWidth, fontSize) {
    const lineasFinales = [];
    const tipoFuente = tipoFuenteInput.value || "Arial";
    const estiloFuenteSelect = document.getElementById('estiloFuente');
    const estiloFuente = estiloFuenteSelect.value;

    let fontStyle = "";
    if (estiloFuente.includes("bold")) {
        fontStyle += "bold ";
    }
    if (estiloFuente.includes("italic")) {
        fontStyle += "italic ";
    }

    // Aplicar el estilo completo
    ctx.font = `${fontStyle}${fontSize}px ${tipoFuente}`;

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


// Función para alternar la visibilidad del autor
function toggleAutor() {
    mostrarAutor = !mostrarAutor; // Cambia el estado de visibilidad del autor

    // Cambiar el icono del botón según el estado
    const botonToggle = document.getElementById("toggleAutor");
    const icono = botonToggle.querySelector("i");

    if (mostrarAutor) {
        icono.classList.remove("fa-user-slash");
        icono.classList.add("fa-user");
    } else {
        icono.classList.remove("fa-user");
        icono.classList.add("fa-user-slash");
    }

    // Actualiza el canvas con o sin el autor
    actualizarCanvas();
}
// Asigna la función al botón
document.getElementById("toggleAutor").addEventListener("click", toggleAutor);



imagenFondoPos.initialized = false;

function actualizarCanvas() {
    //const scale = window.devicePixelRatio || 1;

    const windowHeight = window.innerHeight;
    const desiredHeight = windowHeight * 0.7;
    const canvasHeight = desiredHeight; // Alto fijo
    const canvasWidth = canvasContainer.offsetWidth;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imagenFondo) {
        if (!imagenFondoPos.initialWidth) { // Guarda las dimensiones originales solo una vez
            imagenFondoPos.initialWidth = imagenFondo.width;
            imagenFondoPos.initialHeight = imagenFondo.height;
            imagenFondoPos.x = (canvas.width - imagenFondo.width) / 2;
            imagenFondoPos.y = (canvas.height - imagenFondo.height) / 2;
        }

        const scaledWidth = imagenFondoPos.initialWidth * imagenFondoPos.scale; // Aplica la escala
        const scaledHeight = imagenFondoPos.initialHeight * imagenFondoPos.scale;// Aplica la escala

        // Calcula el centro actual de la imagen
        const currentCenterX = imagenFondoPos.x + scaledWidth / 2;
        const currentCenterY = imagenFondoPos.y + scaledHeight / 2;

        // Dibuja la imagen centrada usando las dimensiones escaladas
        ctx.drawImage(imagenFondo, currentCenterX - scaledWidth / 2, currentCenterY - scaledHeight / 2, scaledWidth, scaledHeight);

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
    const estiloFuenteSelect = document.getElementById('estiloFuente');
    const estiloFuente = estiloFuenteSelect.value;

    // Construcción de `ctx.font` con validación
    let fontWeight = estiloFuente.includes("bold") ? "bold" : "normal";
    let fontStyle = estiloFuente.includes("italic") ? "italic" : "normal";
    let fontDecoration = estiloFuente.includes("underline") ? "underline" : "";
    // Concatenar con los demás valores
    ctx.font = `${fontStyle} ${fontWeight} ${tamanoFrase}px ${tipoFuente}`;

    ctx.fillStyle = colorFrase;

    ctx.textBaseline = "middle";

    const maxWidth = canvas.width * 0.65; 
    const lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, tamanoFrase);

    const lineHeight = tamanoFrase * 1.3;

    posicionYInput.min = 5 + lineHeight; // Valor mínimo (ajustable según tus necesidades)
    posicionYInput.max = (canvas.height - 70) - lineHeight; // Valor máximo, dejando un margen inferior
    
    const desplazamientoY = 50; // Ajusta este valor para mover hacia arriba o abajo
    const posicionInicialY =
        (parseInt(posicionYInput.value) || 
        canvas.height / 2 - ((lineas.length - 1) / 2) * lineHeight) - desplazamientoY;
    lineas.forEach((linea, index) => {
        let posicionX = canvas.width / 2; // Predeterminado para "center"
        if (alineacionTexto === "left") {
            ctx.textAlign = "left";
            posicionX = (canvas.width * 0.02); // Margen izquierdo
        } else if (alineacionTexto === "right") {
            ctx.textAlign = "right";
            posicionX = (canvas.width * 0.98); // Margen derecho
        } else {
            ctx.textAlign = "center";
        }

        if (estiloFuente.includes("underline")) {
            const textWidth = ctx.measureText(linea).width;
            let underlineX = posicionX;
            if (alineacionTexto === "center") {
                underlineX -= textWidth / 2;
            } else if (alineacionTexto === "right") {
                underlineX -= textWidth;
            }
            ctx.strokeStyle = colorFrase; // Color del subrayado
            ctx.lineWidth = tamanoFrase / 15; // Grosor del subrayado (ajustable)
            ctx.beginPath();
            ctx.moveTo(underlineX, posicionInicialY + index * lineHeight + tamanoFrase / 2); // Ajuste vertical
            ctx.lineTo(underlineX + textWidth, posicionInicialY + index * lineHeight + tamanoFrase / 2);
            ctx.stroke();
        }


        ctx.fillText(linea, posicionX, posicionInicialY + index * lineHeight);

    });
    //autor
    if (fraseSeleccionada) {
        const lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, tamanoFrase);
        //const lineHeight = tamanoFrase * 1.3;

        //const posicionInicialY =
          //  parseInt(posicionYInput.value) ||
          //  canvas.height / 2 - ((lineas.length - 1) / 2) * lineHeight;

        // Dibujar las líneas de la frase
        lineas.forEach((linea, index) => {
            let posicionX = canvas.width / 2; // Default para "center"
            if (alineacionTexto === "left") {
                ctx.textAlign = "left";
                posicionX = canvas.width * 0.02;
            } else if (alineacionTexto === "right") {
                ctx.textAlign = "right";
                posicionX = canvas.width * 0.98;
            } else {
                ctx.textAlign = "center";
            }

            ctx.fillText(linea, posicionX, posicionInicialY + index * lineHeight);
        });

        // Dibujar autor si está habilitado
        if (mostrarAutor && autorSeleccionado) {
            const posicionAutorY = posicionInicialY + lineas.length * lineHeight + lineHeight / 2;

            let posicionAutorX = canvas.width / 2; // Default para "center"
            if (alineacionTexto === "left") {
                ctx.textAlign = "left";
                posicionAutorX = canvas.width * 0.02;
            } else if (alineacionTexto === "right") {
                ctx.textAlign = "right";
                posicionAutorX = canvas.width * 0.98;
            } else {
                ctx.textAlign = "center";
            }

            ctx.fillText(`- ${autorSeleccionado}`, posicionAutorX, posicionAutorY);
        }
      

    }
    // Dibujar el emoji en su posición

    if (marcaDeAgua) {
        // Dibujar marca de agua centrada
        const marcaAgua = `Creada en https://frasescitas.net`;
        const tamanoMarca = 13; // Tamaño de fuente fijo o ajustable
        ctx.font = `${tamanoMarca}px Verdana`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Color semitransparente
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Asegura el centrado vertical
        ctx.fillText(marcaAgua, (canvas.width / 2), canvas.height - 20);
    }

}
function initCanvasMouseControls() {
    const canvas = document.getElementById("miCanvas");
    let isDragging = false;
    const dragStart = { x: 0, y: 0 };
    const scaleStep = 0.1; // Ajusta la velocidad del zoom con la rueda
    let lastMouseX;
    let lastMouseY;

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStart.x = e.clientX - imagenFondoPos.x;
        dragStart.y = e.clientY - imagenFondoPos.y;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
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

        const delta = Math.sign(e.deltaY); // 1 para scroll hacia abajo, -1 para arriba
        const prevScale = imagenFondoPos.scale;
        imagenFondoPos.scale = Math.max(minScale, Math.min(maxScale, imagenFondoPos.scale - delta * scaleStep));

        // Calcula las coordenadas del mouse en el canvas *antes* del escalado
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - imagenFondoPos.x) / prevScale;
        const mouseY = (e.clientY - rect.top - imagenFondoPos.y) / prevScale;

        // Ajusta la posición de la imagen para que el mouse se mantenga en el mismo lugar
        imagenFondoPos.x -= mouseX * (imagenFondoPos.scale - prevScale);
        imagenFondoPos.y -= mouseY * (imagenFondoPos.scale - prevScale);

        actualizarCanvas();
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
            const touch1 = touches[0];
            const touch2 = touches[1];
            pinchStartDistance = getDistance(
                touch1.clientX, touch1.clientY,
                touch2.clientX, touch2.clientY
            );
            imagenFondoPos.lastScale = imagenFondoPos.scale;
            dragStart.x = (touch1.clientX + touch2.clientX) / 2 - imagenFondoPos.x;
            dragStart.y = (touch1.clientY + touch2.clientY) / 2 - imagenFondoPos.y;
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
            const touch1 = touches[0];
            const touch2 = touches[1];
            const currentDistance = getDistance(
                touch1.clientX, touch1.clientY,
                touch2.clientX, touch2.clientY
            );

            imagenFondoPos.scale = (currentDistance / pinchStartDistance) * imagenFondoPos.lastScale;
            imagenFondoPos.scale = Math.max(minScale, Math.min(maxScale, imagenFondoPos.scale));
            imagenFondoPos.x = (touch1.clientX + touch2.clientX) / 2 - dragStart.x;
            imagenFondoPos.y = (touch1.clientY + touch2.clientY) / 2 - dragStart.y;

        }

        actualizarCanvas();
    });

    canvas.addEventListener("touchend", (e) => {
        isDragging = false;
        pinchStartDistance = 0;
    });
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("canvas-container").style.display = "none";
    document.getElementById("barra-modificadores").style.display = "none";
    actualizarCanvas();
    initCanvasTouchControls();
    initCanvasMouseControls();

});


// Escuchar cuando el modal se abre para ajustar el canvas
$('#canvasModal').on('shown.bs.modal', function () {
    actualizarCanvas();
});


// Event listeners para actualizaciones en tiempo real
[...document.querySelectorAll("input, select")].forEach(el => {
    el.addEventListener('input', actualizarCanvas);
    el.addEventListener('change', actualizarCanvas); // Para el selec
});

function descargarImagen() {
    // Obtener la fecha en formato YYYY-MM-DD
    const fecha = new Date().toISOString().slice(0, 10);

    // Extraer la frase corta (hasta 15 caracteres)
    const fraseCorta = (fraseSeleccionada.split(' - ')[0] || '').substring(0, 15).replace(/\s+/g, '_');

    // Si no hay frase válida, usar un nombre genérico
    const nombreArchivo = `${fraseCorta || 'imagen_sin_titulo'}_${fecha}.png`;

    // Crear un enlace temporal y descargar la imagen en formato WebP
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = nombreArchivo;
    enlace.click();

    // Limpiar el enlace después de la descarga
    enlace.remove();
}

/*
// Función para descargar la imagen del canvas
function descargarImagen() {
    const fecha = new Date().toISOString().split('T')[0];
    const fraseCorta = fraseSeleccionada.split(' - ')[0].substring(0, 15).replace(/\s+/g, '_');
    const nombreArchivo = `${fraseCorta}_${fecha}.png`;

    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = nombreArchivo;
    enlace.click();
}*/

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







