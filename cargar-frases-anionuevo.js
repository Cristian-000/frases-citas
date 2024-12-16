
document.addEventListener("DOMContentLoaded", () => {
    cargarFrasesPorCategoriaAnnuev();
    configurarBarraBusquedaAnnuev();
});



function configurarBarraBusquedaAnnuev() {
    const listaFrasesCat = document.getElementById("lista-frases-cat-anuev"); // Assuming "cat" in ID refers to category
    const barraBusquedaCat = document.getElementById("barra-busqueda-cat");
    const resultadosBusquedaCat = document.getElementById("resultados-busqueda-cat");
  
    barraBusquedaCat.addEventListener("input", () => {
      const query = barraBusquedaCat.value.toLowerCase();
      resultadosBusquedaCat.innerHTML = "";
  
      if (query.trim() === "") {
        // Show main Christmas list (pre-loaded), hide search results
        listaFrasesCat.style.display = "block";
        resultadosBusquedaCat.style.display = "none";
      } else {
        // Hide main list, show search results
        listaFrasesCat.style.display = "none";
        resultadosBusquedaCat.style.display = "block";
  
        fetch('frases.json')
          .then(response => response.json())
          .then(data => {
            const frasesEncontradas = data.frases.filter(fraseObj => {
              const matchesQuery = fraseObj.frase.toLowerCase().includes(query) ||
                fraseObj.autor_url.toLowerCase().includes(query) ||
                fraseObj.categorias.some(categoria => categoria.toLowerCase().includes(query));
  
              // Consider selected category only if a category is selected in the URL (not applicable here)
              return matchesQuery; // No category filtering as "Navidad" is pre-loaded
            });
  
            const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos
  
            if (frasesEncontradas.length === 0) {
              const noResultados = document.createElement("li");
              noResultados.classList.add("list-group-item", "text-center", "text-muted");
              noResultados.textContent = "No se encontraron coincidencias";
              resultadosBusquedaCat.appendChild(noResultados);
            } else {
              frasesEncontradas.forEach(fraseObj => {
                const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);
                const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);
  
                const li = document.createElement("li");
                li.className = "d-flex justify-content-between align-items-center";
                // ... Rest of the code to create the list item (li) with phrase details ...
                li.innerHTML = `
                <div class="w-100 frase-content frase-content-search-cat">
                    <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}" class="autor-link">${autorCapitalizado}</a></small>
                            ${fraseObj.categorias.map(categoria => {
                            // Aplicar la función obtenerClaseColor para obtener el color adecuado
                            const claseColor = obtenerClaseColor(categoria);
                            return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
                        }).join(' ')}
                        </div>
                        <div class="button-group d-flex align-items-center mr-1">
                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="setFraseParaCompartir('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}'); actualizarCanvas();" data-bs-toggle="modal" data-bs-target="#canvasModal" title="Crear Imagen">
                                    <i class="fas fa-image"></i>
                                </button>
                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}');" title="Compartir">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
                resultadosBusquedaCat.appendChild(li);
  
                // Asignar el evento de clic al botón de favoritos
                li.querySelector(".heart-button").addEventListener("click", (e) => {
                    toggleFavorito(fraseObj, e.currentTarget.querySelector("i"));
                });
              });
            }
          })
          .catch(error => console.error("Error al cargar frases para búsqueda:", error));
      }
    });
  }

  const categoriaSeleccionada = "Año Nuevo";
function cargarFrasesPorCategoriaAnnuev() {
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaFrases = document.getElementById("lista-frases-cat-anuev");
            listaFrases.innerHTML = '';

            const navidadFrases = data.frases.filter(fraseObj =>
                fraseObj.categorias.some(categoria => categoria.toLowerCase().trim().includes("año nuevo"))
            );
            console.log(navidadFrases)
            navidadFrases.forEach(fraseObj => {
                const autorCapitalizadoCat = fraseObj.autor_url.charAt(0).toUpperCase() + fraseObj.autor_url.slice(1).toLowerCase().replace('-', ' ');
                const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos
                if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                    const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);

                    const li = document.createElement("li");
                    li.className = "d-flex justify-content-between align-items-center";
                    li.innerHTML = `
                <div class="w-100 frase-content">
                    <p class="mb-1"><strong>${fraseObj.frase}</strong></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="badges">
                            <small><a href="autor.html?autor=${fraseObj.autor_url}" class="autor-link">${autorCapitalizadoCat}</a></small>
                            ${fraseObj.categorias.map(categoria => {
                        const claseColor = obtenerClaseColor(categoria);
                        return `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge ${claseColor} ml-2">${categoria}</a>`;
                    }).join(' ')}
                        </div>
                        <div class="button-group d-flex align-items-center mr-1">
                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="compartirFrase('${fraseObj.frase}', '${capitalizarIniciales(fraseObj.autor_url)}');" title="Compartir">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary border-0" onclick="copiarFrase('${fraseObj.frase}', '${urlCompartir}');" title="Copiar frase">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-link heart-button ml-2" data-frase="${encodeURIComponent(fraseObj.frase)}">
                                <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                            </button>
                     
                        </div>
                    </div>
                </div>
            `;


                    // Agregar evento para el corazón
            li.querySelector(".heart-button").addEventListener("click", (e) => {
            toggleFavorito(fraseObj, e.currentTarget.querySelector("i"));
            });

            listaFrases.appendChild(li);
            }
            });
        })
        .catch(error => console.error("Error al cargar frases por categoría:", error));
};

const colorCategorias = {
    "Navidad": "badge-navidad",
    "Año Nuevo": "badge-ano-nuevo",
    "Futuro": "badge-futuro",
    "Acción": "badge-accion",
    "Sueños": "badge-sueños",
    "Esperanza": "badge-esperanza",
    "Melancolía": "badge-melancolia",
    "Fuerza": "badge-fuerza",
    "Felicidad": "badge-felicidad",
    "Filosofía": "badge-filosofia",
    "Amor": "badge-amor",
    "Educación": "badge-educacion",
    "Trabajo": "badge-trabajo",
    "Motivación": "badge-motivacion",
    "Vida": "badge-vida",
    "Tristeza": "badge-tristeza",
    "Inspiración": "badge-inspiracion",
    "Superación": "badge-superacion",
    "default": "badge-primary" // Color por defecto
};
// Define la URL base como una variable global
const urlCompartir = "https://cristian-000.github.io/frases-citas/index.html";

function obtenerClaseColor(categoria) {
    return colorCategorias[categoria] || colorCategorias["default"];
}

// Función para copiar la frase y el enlace al portapapeles
function copiarFrase(frase, url) {
    const textoCopiar = `${frase}\n${url}`;
    navigator.clipboard.writeText(textoCopiar)
        .then(() => {
            console.log(textoCopiar)
            //   alert("Frase copiada al portapapeles");
        })
        .catch(err => {
            console.error("Error al copiar:", err);
        });
}
// Función para compartir la frase seleccionada

function compartirFrase(frase, autor) {
    // Formatear el texto para compartir
    const textoCompartir = autor
        ? `"${frase}"\n- ${capitalizarIniciales(autor)}`
        : `"${frase}"`;
    const mensajeFinal = `${textoCompartir}\n\n`;

    if (navigator.share) {
        navigator.share({
            title: "Frase",
            text: mensajeFinal,
            url: urlCompartir // Algunos navegadores prefieren incluirlo aquí
        })
            .then(() => console.log("Frase compartida exitosamente"))
            .catch(error => console.error("Error al compartir:", error));
    } else {
        alert("La funcionalidad de compartir no está disponible en este navegador.");
    }
}

// Función para capitalizar iniciales del autor
function capitalizarIniciales(nombre) {
    return nombre
        .split(" ")
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
        .join(" ");
}

function toggleFavorito(fraseObj, icon) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const index = favoritos.findIndex(fav => fav.frase === fraseObj.frase);

    if (index !== -1) {
        // Eliminar de favoritos
        favoritos.splice(index, 1);
        icon.classList.replace("fas", "far");  // Cambiar a corazón vacío
    } else {
        // Agregar a favoritos
        favoritos.push(fraseObj);
        icon.classList.replace("far", "fas");  // Cambiar a corazón relleno
    }

    // Actualizar localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
