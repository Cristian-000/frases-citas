function generarImagenFrase(frase, autor, estiloFuente = "20px Arial", color = "#000000", fondo = "#ffffff") {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Configuración de fondo
    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configuración de texto
    ctx.font = estiloFuente;
    ctx.fillStyle = color;

    // Ajuste de posición para centrado
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Dibujar frase y autor
    ctx.fillText(frase, x, y - 10); // Frase principal
    ctx.font = "16px Arial";
    ctx.fillText(`- ${autor}`, x, y + 30); // Autor debajo de la frase
}

function crearImagenCompartible() {
    const frase = "Aquí va la frase seleccionada"; // Reemplaza esto con la frase seleccionada
    const autor = "Autor de la frase"; // Reemplaza esto con el autor correspondiente
    const estiloFuente = document.getElementById("fuente").value;
    const colorTexto = document.getElementById("colorTexto").value;
    const colorFondo = document.getElementById("colorFondo").value;

    // Llamar a la función para generar la imagen en el canvas
    generarImagenFrase(frase, autor, estiloFuente, colorTexto, colorFondo);

    // Convertir canvas a imagen
    const canvas = document.getElementById("canvas");
    const imagenURL = canvas.toDataURL("image/png");

    // Crear enlace de descarga
    const enlace = document.createElement("a");
    enlace.href = imagenURL;
    enlace.download = "frase.png";
    enlace.click();
}

function compartirImagen() {
    const canvas = document.getElementById("canvas");
    canvas.toBlob(blob => {
        const archivo = new File([blob], "frase.png", { type: "image/png" });
        if (navigator.share) {
            navigator.share({
                files: [archivo],
                title: "Frase para Compartir",
                text: "Mira esta frase inspiradora!",
            }).catch(console.error);
        } else {
            alert("Tu navegador no soporta compartir archivos.");
        }
    });
}
