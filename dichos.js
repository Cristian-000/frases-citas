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
                li.className = "list-group-item d-flex justify-content-between align-items-center mb-2";

                li.innerHTML = `
                    <div class="dicho-content">
                        <p class="mb-2">${dicho.texto}</p>
                    </div>
                    <div class="button-group d-flex align-items-center mr-1">
                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirDicho('${dicho.texto}', '${window.location.href}');" title="Compartir">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarDicho('${dicho.texto}', '${window.location.href}');" title="Copiar frase">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-link heart-button ml-2" data-texto="${encodeURIComponent(dicho.texto)}">
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
function compartirDicho(dicho, url) {
    const textoCompartir = `${dicho}\n\n${url}`;

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
function copiarDicho(dicho, url) {
    const textoCopiar = `${dicho}\n\n${url}`;

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

function configurarBarraBusquedaDichos() {
    const listaDichos = document.getElementById("lista-dichos");
    const barraBusquedaDich = document.getElementById("barra-busqueda-dich");
    const resultadosBusquedaDich = document.getElementById("resultados-busqueda-dich");

    barraBusquedaDich.addEventListener("input", () => {
        const query = barraBusquedaDich.value.toLowerCase();
        resultadosBusquedaDich.innerHTML = "";

        if (query.trim() === "") {
            listaDichos.style.display = "block";
            resultadosBusquedaDich.style.display = "none";
        } else {
            listaDichos.style.display = "none";
            resultadosBusquedaDich.style.display = "block";

            fetch('dichos.json')
                .then(response => response.json())
                .then(data => {
                    const dichosEncontrados = data.dichos.filter(dicho =>
                        dicho.texto.toLowerCase().includes(query)
                    );

                    const favoritos = JSON.parse(localStorage.getItem("favoritos_dichos")) || [];

                    dichosEncontrados.forEach(dicho => {
                        const isFavorito = favoritos.some(fav => fav.texto === dicho.texto);

                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex justify-content-between align-items-center";

                        li.innerHTML = `
                            <div class="dicho-content">
                                <p class="mb-2">${dicho.texto}</p>
                            </div>
                            <div class="button-group d-flex align-items-center mr-1">
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirDicho('${dicho.texto}', '${window.location.href}');" title="Compartir">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarDicho('${dicho.texto}', '${window.location.href}');" title="Copiar frase">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn btn-link heart-button ml-2" data-texto="${encodeURIComponent(dicho.texto)}">
                                    <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                                </button>
                            </div>
                        `;

                        resultadosBusquedaDich.appendChild(li);

                        li.querySelector(".heart-button").addEventListener("click", (e) => {
                            toggleFavoritoDicho(dicho, e.currentTarget.querySelector("i"));
                        });
                    });

                    if (dichosEncontrados.length === 0) {
                        const noResultLi = document.createElement("li");
                        noResultLi.className = "list-group-item";
                        noResultLi.textContent = "No se encontraron dichos.";
                        resultadosBusquedaDich.appendChild(noResultLi);
                    }

                })
                .catch(error => console.error("Error al cargar dichos para búsqueda:", error));
        }
    });
}

// Llamar a la función para configurar la barra de búsqueda
document.addEventListener("DOMContentLoaded", () => {
    cargarDichos();//se deja esta porque es para que se muestren los dichoss si no se busca nada
    configurarBarraBusquedaDichos();
});
