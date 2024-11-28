// Función para cargar los dichos desde el JSON
function cargarDichos() {
    fetch('dichos.json')
        .then(response => response.json())
        .then(data => {
            const listaDichos = document.getElementById("lista-dichos");
            listaDichos.innerHTML = '';

            data.dichos.forEach(dicho => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";

                li.innerHTML = `
                    <div class="dicho-content">
                        <p class="mb-2">${dicho.texto}</p>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-outline-secondary btn-sm mt-2" onclick="compartirDicho('${dicho.texto}');">Compartir</button>
                        <button class="btn btn-outline-secondary btn-sm mt-2" onclick="copiarDicho('${dicho.texto}');">Copiar</button>
                    </div>
                `;

                listaDichos.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar los dichos:", error));
}

// Función para compartir el dicho
function compartirDicho(dicho) {
    const urlCompartir = "https://mipagina.com"; // URL de la página (puedes cambiarla)
    const textoCompartir = `${dicho}\n\n${urlCompartir}`;

    if (navigator.share) {
        navigator.share({
            title: "Dicho Inspirador",
            text: textoCompartir,
            url: urlCompartir
        })
        .then(() => console.log("Dicho compartido exitosamente"))
        .catch(error => console.error("Error al compartir:", error));
    } else {
        alert("La funcionalidad de compartir no está disponible en este navegador.");
    }
}

// Función para copiar el dicho al portapapeles
function copiarDicho(dicho) {
    const urlCompartir = "https://mipagina.com"; // URL de la página (puedes cambiarla)
    const textoCopiar = `${dicho}\n\n${urlCompartir}`;

    navigator.clipboard.writeText(textoCopiar)
        .then(() => alert("Dicho copiado al portapapeles"))
        .catch(error => console.error("Error al copiar:", error));
}

// Cargar los dichos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarDichos();
});
