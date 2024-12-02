function cargarDichos() {
    fetch('dichos.json')
        .then(response => response.json())
        .then(data => {
            const listaDichos = document.getElementById("lista-dichos");
            listaDichos.innerHTML = '';

            const favoritos = JSON.parse(localStorage.getItem("favoritos_dichos")) || []; // Cargar favoritos

            data.dichos.forEach(dicho => {
                const isFavorito = favoritos.some(fav => fav.texto === dicho.texto);

                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";

                li.innerHTML = `
                    <div class="dicho-content">
                        <p class="mb-2">${dicho.texto}</p>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-outline-secondary btn-sm mt-2" onclick="compartirDicho('${dicho.texto}');">Compartir</button>
                        <button class="btn btn-outline-secondary btn-sm mt-2" onclick="copiarDicho('${dicho.texto}');">Copiar</button>
                        <button class="btn btn-link heart-button" data-texto="${encodeURIComponent(dicho.texto)}">
                            <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                        </button>
                    </div>
                `;

                // Agregar evento para el corazón
                li.querySelector(".heart-button").addEventListener("click", (e) => {
                    toggleFavoritoDicho(dicho, e.currentTarget.querySelector("i"));
                });

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
            text: textoCompartir
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

// Función para agregar/eliminar dicho de favoritos
function toggleFavoritoDicho(dicho, icon) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos_dichos")) || [];
    const index = favoritos.findIndex(fav => fav.texto === dicho.texto);

    if (index !== -1) {
        // Eliminar de favoritos
        favoritos.splice(index, 1);
        icon.classList.replace("fas", "far");  // Cambiar a corazón vacío
    } else {
        // Agregar a favoritos
        favoritos.push(dicho);
        icon.classList.replace("far", "fas");  // Cambiar a corazón relleno
    }

    // Actualizar localStorage
    localStorage.setItem("favoritos_dichos", JSON.stringify(favoritos));
}

// Cargar los dichos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarDichos();
});
