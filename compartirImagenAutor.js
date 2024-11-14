function cargarAutor() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const autorSeleccionado = urlParams.get("autor");

        if (!autorSeleccionado) return resolve();

        document.getElementById("titulo-autor").innerText = `Frases de ${autorSeleccionado}`;
        fetch('frases.json')
            .then(response => response.json())
            .then(data => {
                const listaFrases = document.getElementById("lista-frases");
                listaFrases.innerHTML = '';

                data.frases.forEach(fraseObj => {
                    if (fraseObj.autor_url === autorSeleccionado) {
                        const li = document.createElement("li");
                        li.className = "list-group-item";
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <div>
                                <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                                ${fraseObj.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
                            </div>
                        `;

                        // Crear botón y agregar listener
                        const button = document.createElement("button");
                        button.textContent = "Usar en Canvas";
                        button.onclick = () => {
                            setFraseParaCompartir(fraseObj.frase, fraseObj.autor_url);
                            actualizarCanvas();
                        };
                        li.appendChild(button);

                        listaFrases.appendChild(li);
                    }
                });
                resolve();
            })
            .catch(error => {
                console.error("Error al cargar frases del autor:", error);
                reject(error);
            });
    });
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
    fraseSeleccionada = `${frase} - ${autor}`;
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


function actualizarCanvas() {
    // Escala según la densidad de píxeles de la pantalla
    const scale = window.devicePixelRatio || 1;

    // Tamaño del canvas según el dispositivo
    let canvasWidth = window.innerWidth * 0.9;  // Ancho al 90% de la pantalla
    let canvasHeight = window.innerHeight * 0.8; // Alto al 80% de la pantalla

    // Configuración del tamaño visible del canvas
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Ajuste del tamaño interno del canvas para alta resolución
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    ctx.scale(scale, scale);

    // Limpiar el canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Verificar si se debe quitar el fondo
    const quitarFondo = document.getElementById("removeFondoCheckbox").checked;

    // Fondo del canvas
    if (imagenFondo && !quitarFondo) {
        ctx.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = colorFondoInput.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Configuración de estilo de texto
    ctx.fillStyle = colorFraseInput.value;
    ctx.textAlign = alineacionTextoInput.value;

    // Tamaño inicial de la fuente y ajuste dinámico en caso de desbordamiento
    let fontSize = parseInt(tamanoFraseInput.value) || 16;
    const maxWidth = canvas.width - 40; // Margen lateral
    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;
    
    // Ajustar el texto dentro del ancho disponible en el canvas
    let lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    while (lineas.length * fontSize > canvas.height - 40 && fontSize > 10) {
        fontSize -= 2;  // Disminuir el tamaño de la fuente en 2px para evitar desbordamiento
        lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    }

    // Reaplicar la fuente después del ajuste
    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    // Cálculo de la posición del texto
    const posicionX = alineacionTextoInput.value === 'left' ? 20 :
                      alineacionTextoInput.value === 'right' ? canvas.width - 20 :
                      canvas.width / 2;

    // Centrando el texto verticalmente y aplicando ajustes
    const espacioVerticalDisponible = canvas.height - lineas.length * fontSize;
    let posicionYInicial = espacioVerticalDisponible / 2;

    // Ajustar la posición Y usando el input de posición Y y limitando para que no se salga del canvas
    let posicionY = posicionYInicial + parseInt(posicionYInput.value);

    // Dibujar cada línea de texto
    lineas.forEach((linea, index) => {
        ctx.fillText(linea, posicionX, posicionY + index * fontSize);
    });
}



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
