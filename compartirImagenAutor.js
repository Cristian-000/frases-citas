const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";

// Opciones de personalización
const colorFondoInput = document.getElementById('colorFondo');
const colorFraseInput = document.getElementById('colorFrase');
const tamanoFraseInput = document.getElementById('tamanoFrase');
const posicionXInput = document.getElementById('posicionX');
const posicionYInput = document.getElementById('posicionY');

// Función para establecer una frase seleccionada y actualizar el canvas
function setFraseParaCompartir(frase, autor) {
    fraseSeleccionada = `${frase} - ${autor}`;
    actualizarCanvas();
}

// Ajuste de texto dentro del canvas
function ajustarTexto(ctx, texto, maxWidth, fontSize) {
    const palabras = texto.split(" ");
    let linea = "";
    const lineas = [];
    ctx.font = `${fontSize}px Arial`;

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

// Actualizar el canvas con la frase seleccionada y las opciones de estilo
function actualizarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorFondoInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorFraseInput.value;
    ctx.textAlign = 'center';
    let fontSize = parseInt(tamanoFraseInput.value);
    const maxWidth = canvas.width - 20;

    let lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);

    while (lineas.length * fontSize > canvas.height - 20 && fontSize > 10) {
        fontSize -= 2;
        lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    }

    ctx.font = `${fontSize}px Arial`;

    const posicionYInicial = posicionYInput.value - (lineas.length - 1) * fontSize / 2;

    lineas.forEach((linea, index) => {
        ctx.fillText(linea, posicionXInput.value, posicionYInicial + index * fontSize);
    });
}

// Función para descargar la imagen del canvas
function descargarImagen() {
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'frase_personalizada.png';
    enlace.click();
}
