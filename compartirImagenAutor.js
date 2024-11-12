// Frases de ejemplo
const frases = [
    "La vida es bella y aún más si es contigo.",
    "Nada es imposible para un corazón decidido.",
    "Sigue adelante, el éxito está a la vuelta de la esquina."
];

// Elementos HTML
const listaFrases = document.getElementById('lista-frases');
const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";

// Variables de personalización
const colorFondoInput = document.getElementById('colorFondo');
const colorFraseInput = document.getElementById('colorFrase');
const tamanoFraseInput = document.getElementById('tamanoFrase');
const posicionXInput = document.getElementById('posicionX');
const posicionYInput = document.getElementById('posicionY');

// Cargar las frases en la lista
function cargarFrases() {
    frases.forEach((frase, index) => {
        const listItem = document.createElement('li');
        listItem.className = "list-group-item";
        const link = document.createElement('a');
        link.href = "#";
        link.innerText = frase;
        link.onclick = () => seleccionarFrase(frase);
        listItem.appendChild(link);
        listaFrases.appendChild(listItem);
    });
}

// Seleccionar una frase y mostrarla en el canvas
function seleccionarFrase(frase) {
    fraseSeleccionada = frase;
    actualizarCanvas();
}

// Actualizar el contenido del canvas con las opciones seleccionadas
function actualizarCanvas() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo personalizado
    ctx.fillStyle = colorFondoInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la frase seleccionada con las opciones de estilo
    ctx.font = `${tamanoFraseInput.value}px Arial`;
    ctx.fillStyle = colorFraseInput.value;
    ctx.textAlign = 'center';
    ctx.fillText(fraseSeleccionada, posicionXInput.value, posicionYInput.value);
}

// Descargar la imagen del canvas
function descargarImagen() {
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'mi-imagen.png';
    enlace.click();
}

// Compartir la imagen (usando la API de Web Share si está disponible)
function compartirImagen() {
    if (navigator.share) {
        canvas.toBlob((blob) => {
            const file = new File([blob], 'mi-imagen.png', { type: 'image/png' });
            navigator.share({
                title: 'Frase Personalizada',
                text: 'Mira esta frase que personalicé',
                files: [file]
            });
        });
    } else {
        alert("La API de compartición no está disponible en tu navegador.");
    }
}

// Inicializar
cargarFrases();
