// scripts.js
document.addEventListener("DOMContentLoaded", () => {
    const promises = [];

    if (document.getElementById("categorias")) {
        promises.push(cargarCategorias());
        promises.push(cargarFraseDelDia());
        configurarBarraBusqueda();
    }
    if (document.getElementById("titulo-categoria")) {
        promises.push(cargarFrasesPorCategoria());
    }
    if (document.getElementById("titulo-autor")) {
        promises.push(cargarAutor());
    }

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
        .then(() => console.log("Carga completada"))
        .catch(error => console.error("Error en la carga:", error));
});

async function cargarCategorias() {
    try {
        const response = await fetch('frases.json');
        const data = await response.json();

        const listaCategorias = document.getElementById("categorias");
        const categoriasConFrases = {};

        // Contamos cuántas frases hay en cada categoría
        data.frases.forEach(fraseObj => {
            fraseObj.categorias.forEach(categoria => {
                if (!categoriasConFrases[categoria]) {
                    categoriasConFrases[categoria] = 0;
                }
                categoriasConFrases[categoria]++;
            });
        });

        // Creamos los elementos de categoría con la cantidad de frases
        Object.keys(categoriasConFrases).forEach(categoria => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            
            // Agregamos la categoría y el badge con la cantidad de frases
            li.innerHTML = `
                <a href="categoria.html?categoria=${encodeURIComponent(categoria)}">${categoria}</a>
                 <a href="categoria.html?categoria=${encodeURIComponent(categoria)}"> <span class="badge badge-primary">${categoriasConFrases[categoria]} frase${categoriasConFrases[categoria] !== 1 ? 's' : ''}</span></a>
               
            `;
            listaCategorias.appendChild(li);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}


function cargarFraseDelDia() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("fechaFraseDelDia");
    const storedFrase = JSON.parse(localStorage.getItem("fraseDelDia"));

    if (storedDate === today && storedFrase) {
        document.getElementById("frase-del-dia").innerHTML = `
            <p class="frase-dia"><strong>${storedFrase.frase}</strong></p>
            <div>
              <small><a href="autor.html?autor=${storedFrase.autor_url}" class="autor-link">${storedFrase.autor_url}</a></small>

                ${storedFrase.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-primary ml-2">${categoria}</a>`).join(' ')}
            </div>
        `;
    } else {
        return fetch('frases.json')
            .then(response => response.json())
            .then(data => {
                const fraseDelDia = data.frases[Math.floor(Math.random() * data.frases.length)];
                localStorage.setItem("fraseDelDia", JSON.stringify(fraseDelDia));
                localStorage.setItem("fechaFraseDelDia", today);

                document.getElementById("frase-del-dia").innerHTML = `
                    <p>${fraseDelDia.frase}</p>
                    <div>
                        <small><a href="autor.html?autor=${fraseDelDia.autor_url}">${fraseDelDia.autor_url}</a></small>
                        ${fraseDelDia.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
                    </div>
                `;
            })
            .catch(error => console.error("Error al cargar frase del día:", error));
    }
}
function capitalizarIniciales(texto) {
    return texto.toLowerCase().split('-').map(palabra => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }).join(' '); // Reemplazamos el guión por un espacio
}

// Función para copiar la frase y el enlace al portapapeles
function copiarFrase(frase, url) {
    const textoCopiar = `${frase}\n${url}`;
    navigator.clipboard.writeText(textoCopiar)
        .then(() => {
            alert("Frase copiada al portapapeles");
        })
        .catch(err => {
            console.error("Error al copiar:", err);
        });
}
// Función para compartir la frase seleccionada
function compartirFrase(frase, autor) {
    // Añade el salto de línea para que el autor quede debajo de la frase
    const textoCompartir = `${frase}\n- ${capitalizarIniciales(autor)}`;
    const urlCompartir = window.location.href; // URL actual

    if (navigator.share) {
        navigator.share({
            title: "Frase Inspiradora",
            text: textoCompartir,
            url: urlCompartir
        })
        .then(() => console.log("Frase compartida exitosamente"))
        .catch(error => console.error("Error al compartir:", error));
    } else {
        alert("La funcionalidad de compartir no está disponible en este navegador.");
    }
}
function configurarBarraBusqueda() {
    const barraBusqueda = document.getElementById("barra-busqueda");
    const resultadosBusqueda = document.getElementById("resultados-busqueda");

    barraBusqueda.addEventListener("input", () => {
        const query = barraBusqueda.value.toLowerCase();
        resultadosBusqueda.innerHTML = "";

        if (query) {
            fetch('frases.json')
                .then(response => response.json())
                .then(data => {
                    const frasesEncontradas = data.frases.filter(fraseObj => 
                        fraseObj.frase.toLowerCase().includes(query) || 
                        fraseObj.autor_url.toLowerCase().includes(query) || 
                        fraseObj.categorias.some(categoria => categoria.toLowerCase().includes(query))
                    );

                    frasesEncontradas.forEach(fraseObj => {
                        const autorCapitalizado = capitalizarIniciales(fraseObj.autor_url);

                        const li = document.createElement("li");
                        li.className = "d-flex justify-content-between align-items-center";

                        li.innerHTML = `
    <div class="card mb-2 w-100 shadow-sm">
        <div class="card-body">
            <p class="card-text frase-texto">${fraseObj.frase}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center bg-light">
            <small class="text-muted">
                Autor: <a href="autor.html?autor=${fraseObj.autor_url}" class="text-primary">${autorCapitalizado}</a>
            </small>
            <div>
                ${fraseObj.categorias.map(categoria => 
                    `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-primary ml-2">${categoria}</a>`
                ).join(' ')}
            </div>
        </div>
        <div class="card-footer d-flex justify-content-around">
            <button class="btn btn-sm btn-outline-success" onclick="compartirFrase('${fraseObj.frase}', '${autorCapitalizado}');">Compartir</button>
            <button class="btn btn-sm btn-outline-danger" onclick="copiarFrase('${fraseObj.frase}', '${window.location.href}');">Copiar Frase</button>
        </div>
    </div>
`;

                        resultadosBusqueda.appendChild(li);
                    });
                })
                .catch(error => console.error("Error al cargar frases para búsqueda:", error));
        }
    });
}
function cargarFrasesPorCategoria() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get("categoria");

    if (!categoriaSeleccionada) return;

    document.getElementById("titulo-categoria").innerText = `Frases de ${categoriaSeleccionada}`;
    fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaFrases = document.getElementById("lista-frases");
            listaFrases.innerHTML = '';

            const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; // Cargar favoritos

            data.frases.forEach(fraseObj => {
                const autorCapitalizadoCat = fraseObj.autor_url.charAt(0).toUpperCase() + fraseObj.autor_url.slice(1).toLowerCase().replace('-', ' ');

                if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                    const isFavorito = favoritos.some(fav => fav.frase === fraseObj.frase);

                    const li = document.createElement("li");
                    li.className = "list-group-item d-flex justify-content-between align-items-center";

                    li.innerHTML = `
                        <div>
                            <p><strong>${fraseObj.frase}</strong></p>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}">${autorCapitalizadoCat}</a></small>
                            ${fraseObj.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-primary ml-2">${categoria}</a>`).join(' ')}
                        </div>
                        <button class="btn btn-link heart-button" data-frase="${encodeURIComponent(fraseObj.frase)}">
                            <i class="${isFavorito ? 'fas' : 'far'} fa-heart text-danger"></i>
                        </button>
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
