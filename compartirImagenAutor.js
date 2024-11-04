document.addEventListener("DOMContentLoaded", () => {
    // Cargar frases desde JSON al cargar la página
    fetch("frases.json")
        .then(response => response.json())
        .then(data => {
            const frasesContainer = document.getElementById("frases-container");
            data.frases.forEach(frase => {
                const fraseItem = document.createElement("button");
                fraseItem.classList.add("frase-item");
                fraseItem.textContent = frase.texto;
                fraseItem.addEventListener("click", () => {
                    mostrarPreview(frase.texto);
                    document.getElementById("customization-options").style.display = "block"; // Mostrar opciones de personalización
                });
                frasesContainer.appendChild(fraseItem);
            });
        })
        .catch(error => console.error("Error al cargar frases:", error));

    // Configuración de eventos para cada control de personalización
    document.getElementById("fondo-selector").addEventListener("change", actualizarPreview);
    document.getElementById("color-selector").addEventListener("change", actualizarPreview);
    document.getElementById("tamano-selector").addEventListener("input", actualizarPreview);
    document.getElementById("fuente-selector").addEventListener("change", actualizarPreview);
    document.getElementById("rotacion-selector").addEventListener("input", actualizarPreview);
    document.getElementById("borde-grosor-selector").addEventListener("input", actualizarPreview);
    document.getElementById("borde-color-selector").addEventListener("change", actualizarPreview);
});

// Función para mostrar la vista previa de la imagen con la frase seleccionada
function mostrarPreview(frase) {
    const canvas = document.getElementById("preview");
    canvas.style.display = "block"; // Mostrar el canvas
    canvas.setAttribute("data-frase", frase); // Guardar la frase en el canvas
    actualizarPreview(); // Llamar a la función de actualización
}

// Función para ajustar el tamaño de fuente para que el texto no se salga del canvas
function ajustarTexto(ctx, text, maxWidth) {
    let fontSize = parseInt(document.getElementById("tamano-selector").value);
    do {
        ctx.font = `${fontSize}px ${document.getElementById("fuente-selector").value}`;
        fontSize--;
    } while (ctx.measureText(text).width > maxWidth && fontSize > 10); // Reducir hasta ajustarse o alcanzar tamaño mínimo
    return fontSize;
}

// Función para actualizar la vista previa en el canvas
function actualizarPreview() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    // Borrar el canvas antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración del color de fondo
    const fondoColor = document.getElementById("fondo-selector").value;
    ctx.fillStyle = fondoColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Añadir borde alrededor del canvas
    const bordeGrosor = parseInt(document.getElementById("borde-grosor-selector").value, 10);
    const bordeColor = document.getElementById("borde-color-selector").value;
    ctx.lineWidth = bordeGrosor;
    ctx.strokeStyle = bordeColor;
    if (bordeGrosor > 0) {
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Configuración del texto
    const fontSize = ajustarTexto(ctx, canvas.getAttribute("data-frase"), canvas.width - 20); // Ajustar para evitar que se salga
    const fontFamily = document.getElementById("fuente-selector").value;
    const textColor = document.getElementById("color-selector").value;
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Rotación del texto
    const rotacionGrados = document.getElementById("rotacion-selector").value;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotacionGrados * Math.PI) / 180);

    // Dibujar la frase en el centro del canvas
    const frase = canvas.getAttribute("data-frase") || "";
    ctx.fillText(frase, 0, 0);

    // Restaurar el contexto tras la rotación
    ctx.restore();
}

// Función para descargar la imagen generada en el canvas
function descargarImagen() {
    const canvas = document.getElementById("preview");
    const enlace = document.createElement("a");
    enlace.download = "frase.png";
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
}

function compartirImagen() {
    const canvas = document.getElementById('preview');
    canvas.toBlob((blob) => {
        const file = new File([blob], 'frase.png', { type: 'image/png' });
        if (navigator.share) {
            navigator.share({
                files: [file],
                title: 'Frase Compartible',
                text: 'Mira esta frase inspiradora que creé'
            });
        } else {
            alert('Tu navegador no soporta compartir archivos.');
        }
    });
}

function descargarImagen() {
    const canvas = document.getElementById('preview');
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'frase.png';
    enlace.click();
}

function togglePanel(panelId) {
    // Cerrar todos los paneles
    document.querySelectorAll('.mini-panel').forEach(panel => panel.classList.remove('active'));

    // Abrir el panel seleccionado
    document.getElementById(panelId).classList.add('active');
}

function mostrarPreview(texto) {
    const canvasContainer = document.getElementById('canvas-container');
    const canvas = document.getElementById('preview');
    const ctx = canvas.getContext('2d');

    // Mostrar el contenedor del canvas
    canvasContainer.classList.remove('hidden');

    // Limpiar el canvas antes de dibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el texto en el canvas
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
}
