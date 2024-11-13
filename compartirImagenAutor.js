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
    document.getElementById("div-modificadores").style.display = "none";
});

const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let fraseSeleccionada = "";

// Opciones de personalización
const colorFondoInput = document.getElementById('colorFondo');
const colorFraseInput = document.getElementById('colorFrase');
const tamanoFraseInput = document.getElementById('tamanoFrase');
const posicionXInput = document.getElementById('posicionX');
const posicionYInput = document.getElementById('posicionY');
const tipoFuenteInput = document.getElementById('tipoFuente');
// Elemento del selector de alineación
const alineacionTextoInput = document.getElementById('alineacionTexto');

// Establece el tamaño inicial del canvas al tamaño de la ventana
canvas.width = window.innerWidth * 0.8; // 90% del ancho de la ventana
canvas.height = window.innerHeight * 0.8; // 90% del alto de la ventana

// Establecer valor predeterminado de tipo de fuente
tipoFuenteInput.value = "Arial"; // Tipo de fuente por defecto

// Función para establecer una frase seleccionada y mostrar el canvas
function setFraseParaCompartir(frase, autor) {
    fraseSeleccionada = `${frase} - ${autor}`;
    document.getElementById("canvas-container").style.display = "block"; // Mostrar el canvas y los controles de ajuste
    document.getElementById("div-modificadores").style.display = "block";
    actualizarCanvas();
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

// Actualizar el canvas con la frase seleccionada y las opciones de estilo
function actualizarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo del canvas
    ctx.fillStyle = colorFondoInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estilos de texto
    ctx.fillStyle = colorFraseInput.value;
    ctx.textAlign = alineacionTextoInput.value; // Alineación seleccionada

    let fontSize = parseInt(tamanoFraseInput.value) || 16;  // 16 es un valor predeterminado
    const maxWidth = canvas.width - 40;  // Dejar un margen de 20 en cada lado

    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    let lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);

    // Reducir el tamaño de fuente si no cabe en el canvas
    while (lineas.length * fontSize > canvas.height - 40 && fontSize > 10) {
        fontSize -= 2;
        lineas = ajustarTexto(ctx, fraseSeleccionada, maxWidth, fontSize);
    }

    ctx.font = `${fontSize}px ${tipoFuenteInput.value || 'Arial'}`;

    // Ajustar posición en X según la alineación seleccionada
    const posicionX = alineacionTextoInput.value === 'left' ? 0 :
                  alineacionTextoInput.value === 'right' ? canvas.width :
                  canvas.width / 2;

    // Calcular la posición vertical para centrar las líneas
    const posicionYInicial = (canvas.height - lineas.length * fontSize) / 2;

    lineas.forEach((linea, index) => {
        ctx.fillText(linea, posicionX, posicionYInicial + index * fontSize);
    });
}

// Event listeners para actualizar el canvas en tiempo real
colorFondoInput.addEventListener('input', actualizarCanvas);
colorFraseInput.addEventListener('input', actualizarCanvas);
tamanoFraseInput.addEventListener('input', actualizarCanvas);
posicionXInput.addEventListener('input', actualizarCanvas);
posicionYInput.addEventListener('input', actualizarCanvas);
tipoFuenteInput.addEventListener('change', actualizarCanvas); // Cambio de tipo de fuente
alineacionTextoInput.addEventListener('change', actualizarCanvas); // Cambio de alineación

// Función para descargar la imagen del canvas
function descargarImagen() {
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'frase_personalizada.png';
    enlace.click();
}
