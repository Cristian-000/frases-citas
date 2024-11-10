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
    const personalizationOptions = [
        "fondo-selector", "color-selector", "tamano-selector",
        "fuente-selector", "rotacion-selector", "borde-grosor-selector", "borde-color-selector"
    ];
    personalizationOptions.forEach(id => {
        document.getElementById(id)?.addEventListener("change", actualizarPreview);
    });
});

// Función para mostrar la vista previa de la imagen con la frase seleccionada
function mostrarPreview(frase) {
    const canvasContainer = document.getElementById("canvas-container");
    const canvas = document.getElementById("preview");

    // Mostrar el contenedor del canvas
    canvasContainer.classList.remove("hidden");
    canvas.setAttribute("data-frase", frase);

    // Llamar a la función de actualización de vista previa
    actualizarPreview();
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

// Función para dividir el texto en líneas si es demasiado largo
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > maxWidth && line) {
            lines.push(line.trim());
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    lines.push(line.trim());
    return lines;
}

// Función para actualizar la vista previa en el canvas
function actualizarPreview() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");
    const frase = canvas.getAttribute("data-frase");

    if (!frase) return;

    // Configuración del canvas y fondo
    const fondoColor = document.getElementById("fondo-selector").value;
    ctx.fillStyle = fondoColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar borde si es necesario
    const bordeGrosor = parseInt(document.getElementById("borde-grosor-selector").value, 10);
    if (bordeGrosor > 0) {
        ctx.lineWidth = bordeGrosor;
        ctx.strokeStyle = document.getElementById("borde-color-selector").value;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Configuración del texto
    const fontSize = ajustarTexto(ctx, frase, canvas.width - 20);
    const fontFamily = document.getElementById("fuente-selector").value;
    ctx.fillStyle = document.getElementById("color-selector").value;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dibujar y rotar el texto
    const rotacionGrados = document.getElementById("rotacion-selector").value;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotacionGrados * Math.PI) / 180);

    // En caso de que sea necesario dividir el texto en líneas
    const lines = wrapText(ctx, frase, canvas.width - 40);
    const lineHeight = fontSize * 1.2;
    lines.forEach((line, index) => {
        ctx.fillText(line, 0, (index - lines.length / 2) * lineHeight);
    });

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

// Función para compartir la imagen generada
function compartirImagen() {
    const canvas = document.getElementById("preview");
    canvas.toBlob(async (blob) => {
        const file = new File([blob], "frase.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Frase Generada",
                    text: "Aquí tienes una frase especial!"
                });
                console.log("Compartido con éxito");
            } catch (error) {
                console.error("Error al compartir:", error);
            }
        } else {
            alert("La opción de compartir no es compatible con este navegador.");
        }
    });
}
