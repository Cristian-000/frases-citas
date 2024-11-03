document.addEventListener("DOMContentLoaded", () => {
    const promises = [];

    if (document.getElementById("titulo-autor")) {
        promises.push(cargarAutor());
    }

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
        .then(() => console.log("Carga completada"))
        .catch(error => console.error("Error en la carga:", error));

    // Event listeners para actualizar el preview en tiempo real
    document.getElementById("fondo-selector").addEventListener("change", actualizarPreview);
    document.getElementById("color-selector").addEventListener("change", actualizarPreview);
    document.getElementById("tamano-selector").addEventListener("input", actualizarPreview);
    document.getElementById("fuente-selector").addEventListener("change", actualizarPreview);

     // Event listener para el botón de crear imagen compartible
     document.getElementById("crear-imagen-compartible").addEventListener("click", crearImagenCompartible);

    document.getElementById("compartir-imagen").addEventListener("click", compartirImagen);

});

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
                            <button onclick="setFraseParaCompartir('${fraseObj.frase}', '${fraseObj.autor_url}')">Compartir Imagen</button>
                            <div>
                                <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                                ${fraseObj.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
                            </div>
                        `;
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

let fraseCompartir = '';
let autorCompartir = '';

function setFraseParaCompartir(frase, autor) {
    fraseCompartir = frase;
    autorCompartir = autor;
    document.getElementById("opciones-compartir").style.display = "block";
    actualizarPreview();
}

const texturas = [
    "—Pngtree—simple border png material_4484003.png",
    "pngkey.com-fancy-border-png-71261.png",
    "pngkey.com-fancy-border-png-71261.png"
];
const marcaAgua = 'Tu Marca de Agua';

function actualizarPreview() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configuración de fondo con opacidad
    const fondoColor = document.getElementById("fondo-selector").value;
    const opacidad = document.getElementById("opacidad-selector").value;
    ctx.globalAlpha = opacidad;
    ctx.fillStyle = fondoColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;  // Resetear la opacidad para el resto

    // Cargar y dibujar textura (opcional)
    const texturaImg = new Image();
    texturaImg.src = texturas[0];
    texturaImg.onload = () => {
        ctx.drawImage(texturaImg, 0, 0, canvas.width, canvas.height);

        // Configuración de borde
        const bordeGrosor = document.getElementById("borde-grosor-selector").value;
        const bordeColor = document.getElementById("borde-color-selector").value;
        ctx.lineWidth = bordeGrosor;
        ctx.strokeStyle = bordeColor;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Configuración de texto
        const fontSize = document.getElementById("tamano-selector").value;
        const fontFamily = document.getElementById("fuente-selector").value;
        ctx.fillStyle = document.getElementById("color-selector").value;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = "center";

        // Aplicar rotación de texto
        const rotacion = document.getElementById("rotacion-selector").value;
        ctx.save(); // Guardar el estado antes de rotar
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotacion * Math.PI / 180);

        // Dibujar texto y autor
        const maxAnchoTexto = canvas.width - 40;
        const fraseLineas = dividirTexto(ctx, fraseCompartir, maxAnchoTexto);
        let posicionY = -((fraseLineas.length - 1) * parseInt(fontSize) / 2);

        fraseLineas.forEach(linea => {
            ctx.fillText(linea, 0, posicionY);
            posicionY += parseInt(fontSize) + 5;
        });
        ctx.fillText(`- ${autorCompartir}`, 0, posicionY + 20);
        ctx.restore(); // Restaurar el estado para que no afecte otros elementos

        // Marca de agua
        ctx.font = "12px Arial";
        ctx.fillText(marcaAgua, canvas.width - 50, canvas.height - 10);
    };
}

// Función para dividir el texto en líneas dentro del ancho máximo
function dividirTexto(ctx, texto, maxAncho) {
    const palabras = texto.split(" ");
    const lineas = [];
    let linea = "";

    palabras.forEach(palabra => {
        const lineaPrueba = linea + palabra + " ";
        const anchoPrueba = ctx.measureText(lineaPrueba).width;
        if (anchoPrueba > maxAncho && linea !== "") {
            lineas.push(linea);
            linea = palabra + " ";
        } else {
            linea = lineaPrueba;
        }
    });
    lineas.push(linea.trim()); // Añadir la última línea

    return lineas;
}

function cambiarTextura() {
    const nuevaTextura = texturas[Math.floor(Math.random() * texturas.length)];
    texturas[0] = nuevaTextura;
    actualizarPreview();
}

function crearImagenCompartible() {
    const canvas = document.getElementById("preview");
    const enlace = document.createElement("a");
    enlace.href = canvas.toDataURL("image/png"); // Especificar el formato
    enlace.download = "frase_compartible.png";
    enlace.click();
}// Guarda el canvas como imagen



function compartirImagen() {
    const canvas = document.getElementById("preview");
    canvas.toBlob(blob => {
        const archivoImagen = new File([blob], "frase_compartible.png", { type: "image/png" });
        
        if (navigator.canShare && navigator.canShare({ files: [archivoImagen] })) {
            navigator.share({
                files: [archivoImagen],
                title: 'Frase Compartible',
                text: '¡Mira esta frase!',
            }).then(() => console.log('Imagen compartida exitosamente'))
            .catch(error => console.error('Error al compartir:', error));
        } else {
            alert("La funcionalidad de compartir no está disponible en este dispositivo.");
        }
    });
}