//compartirImagenAutor.js
const colorCategorias = {
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
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos

function cargarAutor() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const autorSeleccionado = urlParams.get("autor");

        if (!autorSeleccionado) return resolve(); // Si no hay autor, resuelve inmediatamente

        // Título del autor
        const tituloAutor = document.getElementById("titulo-autor");
        tituloAutor.innerText = `Frases de ${capitalizarIniciales(autorSeleccionado)}`;
        tituloAutor.classList.add("text-center", "mb-4"); // Asegura que el título sea centrado y tenga margen

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
                        li.className = "mb-3"; // Añadir margen entre frases

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
                                    <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" title="Crear Imagen">
                                            <i class="fas fa-image"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${autorCapitalizado}');" title="Compartir">
                                            <i class="fas fa-share-alt"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${window.location.href}');" title="Copiar frase">
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

                        listaFrases.appendChild(li); // Añadir el li a la lista
                    }
                });

                resolve(); // Resolver la promesa después de cargar todas las frases
            })
            .catch(error => {
                console.error("Error al cargar frases del autor:", error);
                reject(error); // Rechazar la promesa si hay error
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
    const urlCompartir = window.location.href; // URL actual

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





// Llama a cargarAutor al cargar la página
document.addEventListener("DOMContentLoaded", () => {
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
// Elemento del selector de alineación
const alineacionTextoInput = document.getElementById('alineacionTexto');
const posicionYInput = document.getElementById('posicionY'); // Captura el control de posición Y
// Establece el tamaño inicial del canvas al tamaño de la ventana
canvas.width = window.innerWidth * 0.9; // 90% del ancho de la ventana
canvas.height = window.innerHeight * 0.8; // 90% del alto de la ventana

// Establecer valor predeterminado de tipo de fuente
tipoFuenteInput.value = "Arial"; // Tipo de fuente por defecto

// Función para establecer una frase seleccionada y mostrar el canvas
function setFraseParaCompartir(frase, autor) {
    // Divide la frase y el autor en líneas separadas usando `\n`
    fraseSeleccionada = `${frase}\n- ${capitalizarIniciales(autor)}`;
    actualizarCanvas();
    document.getElementById("canvas-container").style.display = "block";
    document.getElementById("barra-modificadores").style.display = "flex";
}
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

const imagenFondoInput = document.getElementById('imagenFondo');
let imagenFondo = null;


imagenFondoInput.addEventListener('change', (event) => {
    const archivo = event.target.files[0];
    if (archivo) {
        imagenFondo = new Image();
        imagenFondo.src = URL.createObjectURL(archivo); // Usar createObjectURL
        imagenFondo.onload = () => {
            actualizarCanvas();
        };
    }
});

// _/

// Variable para la marca de agua
const marcaDeAgua = "NombreDeLaPagina.com";

function actualizarCanvas() {
    // Obtener el factor de escala para alta densidad de píxeles
    const scale = window.devicePixelRatio || 1;

    // Calcular el tamaño del canvas en píxeles físicos
    let canvasWidth = window.innerWidth * 0.9;  // Ancho al 90% de la ventana
    let canvasHeight = window.innerHeight * 0.8; // Alto al 80% de la ventana

    // Establecer el tamaño en CSS
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Configurar el tamaño interno del canvas en píxeles físicos para asegurar alta resolución
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;

    // Escalar el contexto para que los elementos se dibujen correctamente
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const quitarFondo = document.getElementById("removeFondoCheckbox").checked;
    
    if (quitarFondo) {
        // Limpia el fondo o establece un fondo transparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        // Dibujar el fondo si está disponible
        if (imagenFondo) {
            ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);
        }
    }
    // Configuración de estilo de texto
    ctx.fillStyle = colorFraseInput.value;
    ctx.textAlign = alineacionTextoInput.value;

    // Tamaño inicial de la fuente y ajuste dinámico
    let fontSize = parseInt(tamanoFraseInput.value) || 16;
    const maxWidth = canvasWidth - 40; // Margen lateral

    // Aplicar el tamaño de la fuente inicial al contexto
    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    // Ajustar el texto al ancho disponible en el canvas
    let lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    while (lineas.length * fontSize > canvasHeight - 40 && fontSize > 10) {
        fontSize -= 2;
        lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    }

    // Reaplicar la fuente después del ajuste
    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    // Calcular los límites verticales del texto
    const textoAlturaTotal = lineas.length * fontSize;
    const minPosY = 0; // El límite superior del canvas
    const maxPosY = canvasHeight - textoAlturaTotal; // El límite inferior, menos la altura del texto

    // Actualizar los límites del control deslizante de `posicionY`
    posicionYInput.min = minPosY;
    posicionYInput.max = maxPosY;

    // Cálculo de la posición del texto
    const posicionX = alineacionTextoInput.value === 'left' ? 20 :
                      alineacionTextoInput.value === 'right' ? canvasWidth - 20 :
                      canvasWidth / 2;

    // Tomar el valor de `posicionY` dentro de los nuevos límites
    let posicionY = parseFloat(posicionYInput.value);
    if (posicionY < minPosY) posicionY = minPosY;
    if (posicionY > maxPosY) posicionY = maxPosY;

    // Dibujar cada línea de texto en el canvas
    lineas.forEach(linea => {
        ctx.fillText(linea, posicionX, posicionY);
        posicionY += fontSize;
    });

    // Dibujar la marca de agua en la esquina inferior derecha
    ctx.font = "14px Arial"; // Tamaño y fuente de la marca de agua
    ctx.globalAlpha = 0.3; // Opacidad para la marca de agua
    ctx.fillStyle = "#000000"; // Color de la marca de agua
    const margen = 10; // Margen desde el borde
    const anchoTextoMarcaDeAgua = ctx.measureText(marcaDeAgua).width;
    ctx.fillText(marcaDeAgua, canvasWidth - anchoTextoMarcaDeAgua - margen, canvasHeight - margen);

    // Restablecer la opacidad global después de dibujar la marca de agua
    ctx.globalAlpha = 1.0;
}
// _\
// Event listeners para actualizar el canvas en tiempo real
posicionYInput.addEventListener('input', actualizarCanvas);
colorFondoInput.addEventListener('input', actualizarCanvas);
colorFraseInput.addEventListener('input', actualizarCanvas);
tamanoFraseInput.addEventListener('input', actualizarCanvas);
//posicionXInput.addEventListener('input', actualizarCanvas);
//posicionYInput.addEventListener('input', actualizarCanvas);
tipoFuenteInput.addEventListener('input', actualizarCanvas);   // Cambiar a 'input' para detectar en tiempo real
alineacionTextoInput.addEventListener('change', actualizarCanvas);  // Usar 'change' para select de alineación

// Configuración de MutationObserver para asegurar que se detecten los cambios
const observer = new MutationObserver(() => actualizarCanvas());
observer.observe(tipoFuenteInput, { attributes: true, childList: true, subtree: true });
observer.observe(alineacionTextoInput, { attributes: true, childList: true, subtree: true });

// Función para descargar la imagen del canvas con nombre personalizado
function descargarImagen() {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const fecha = new Date().toISOString().split('T')[0];

    // Limitar la frase a los primeros 15 caracteres y quitar espacios adicionales
    const fraseCorta = fraseSeleccionada.split(' - ')[0].substring(0, 15).replace(/\s+/g, '_');

    // Generar el nombre del archivo
    const nombreArchivo = `${fraseCorta}_${fecha}.png`;

    // Crear un enlace temporal para la descarga
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = nombreArchivo;
    enlace.click();
}

// Asignar el evento al botón de descarga
document.getElementById('botonDescargar').addEventListener('click', descargarImagen);

document.getElementById('botonShare').addEventListener('click', async () => {
    try {

        // Convierte el canvas a Blob para usarlo en la API Web Share
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        // Verifica que se pueda compartir archivos
        if (navigator.canShare({ files: [new File([blob], "imagen.png", { type: "image/png" })] })) {
            const file = new File([blob], "imagen.png", { type: "image/png" });

            await navigator.share({
                files: [file],
                title: 'Mira esta imagen',
                text: '¡Mira la imagen que creé!',
            });
            console.log("Imagen compartida exitosamente");
        } else {
            // Mensaje alternativo para dispositivos que no pueden compartir archivos
            alert("Tu dispositivo no admite la función de compartir archivos. Puedes descargar la imagen en su lugar.");
        }
        // Verifica si el navegador y dispositivo admiten la API de Web Share
        if (!navigator.canShare || !navigator.share) {
            alert("La opción de compartir no está disponible en este dispositivo.");
            return;
        }

    } catch (error) {
        console.error("Error al compartir la imagen:", error);
        alert("Hubo un error al intentar compartir la imagen.");
    }
});
