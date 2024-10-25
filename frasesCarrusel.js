document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("carrusel-frases")) {
        cargarFrasesEnCarrusel();
    }
});

// Cargar frases en el carrusel
function cargarFrasesEnCarrusel() {
    fetch('frases.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const carruselFrases = document.getElementById("carrusel-frases");
            const frases = data.frases;
            if (frases.length > 0) {
                frases.forEach((fraseObj, index) => {
                    const div = document.createElement("div");
                    div.className = index === 0 ? "carousel-item active" : "carousel-item";
                    div.innerHTML = `
                        <div class="d-block w-100 text-center" style="font-size: 1.5rem;">
                            ${fraseObj.frase}
                            <br>
                            <small><em>- ${fraseObj.autor_url}</em></small>
                        </div>
                    `;
                    carruselFrases.appendChild(div);
                });

                // Iniciar el carrusel
                iniciarCarrusel();
            } else {
                console.error("No se encontraron frases en el archivo JSON.");
            }
        })
        .catch(error => console.error("Error al cargar frases para el carrusel:", error));
}

// Función para iniciar el carrusel
function iniciarCarrusel() {
    $('#frase-carrusel').carousel({
        interval: 10000 // Cambia la frase cada 10 segundos
    });
}
