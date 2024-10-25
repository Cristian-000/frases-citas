document.addEventListener("DOMContentLoaded", () => {
    const promises = []; // Array para almacenar las promesas

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

// Cargar categorías de frases únicas a partir de frases.json
function cargarCategorias() {
    return fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaCategorias = document.getElementById("categorias");
            const categoriasUnicas = new Set();

            // Extraer todas las categorías únicas
            data.frases.forEach(fraseObj => {
                fraseObj.categorias.forEach(categoria => categoriasUnicas.add(categoria));
            });

            // Crear la lista de categorías
            categoriasUnicas.forEach(categoria => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}">${categoria}</a>`;
                listaCategorias.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
}
// Cargar una frase aleatoria del día
function cargarFraseDelDia() {
    const today = new Date().toDateString(); // Obtener la fecha actual en formato de cadena
    const storedDate = localStorage.getItem("fechaFraseDelDia");
    const storedFrase = localStorage.getItem("fraseDelDia");

    if (storedDate === today && storedFrase) {
        // Si la fecha almacenada es igual a la fecha de hoy, usar la frase almacenada
        document.getElementById("frase-del-dia").innerHTML = `
            ${storedFrase.frase} <br>
            <small><a href="autor.html?autor=${storedFrase.autor_url}">${storedFrase.autor_url}</a></small>
        `;
    } else {
        // Si no, cargar una nueva frase aleatoria
        return fetch('frases.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const fraseDelDia = data.frases[Math.floor(Math.random() * data.frases.length)];
                
                // Almacenar la nueva frase y la fecha
                localStorage.setItem("fraseDelDia", JSON.stringify({
                    frase: fraseDelDia.frase,
                    autor_url: fraseDelDia.autor_url
                }));
                localStorage.setItem("fechaFraseDelDia", today); // Almacenar la fecha

                // Mostrar la nueva frase del día
                document.getElementById("frase-del-dia").innerHTML = `
                    ${fraseDelDia.frase} <br>
                    <small><a href="autor.html?autor=${fraseDelDia.autor_url}">${fraseDelDia.autor_url}</a></small>
                `;
            })
            .catch(error => console.error("Error al cargar frase del día:", error));
    }
}

// Configurar la barra de búsqueda para filtrar frases
function configurarBarraBusqueda() {
    const barraBusqueda = document.getElementById("barra-busqueda");
    const resultadosBusqueda = document.getElementById("resultados-busqueda");

    barraBusqueda.addEventListener("input", () => {
        const query = barraBusqueda.value.toLowerCase();
        resultadosBusqueda.innerHTML = ""; // Limpiar resultados anteriores

        if (query) {
            fetch('frases.json')
                .then(response => response.json())
                .then(data => {
                    const frasesEncontradas = data.frases.filter(fraseObj => {
                        return fraseObj.frase.toLowerCase().includes(query) || fraseObj.autor_url.toLowerCase().includes(query);
                    });

                    // Mostrar resultados en la lista
                    frasesEncontradas.forEach(fraseObj => {
                        const li = document.createElement("a");
                        li.className = "list-group-item list-group-item-action";
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                        `;
                        resultadosBusqueda.appendChild(li);
                    });
                })
                .catch(error => console.error("Error al cargar frases para búsqueda:", error));
        }
    });
}

// Cargar frases de la categoría seleccionada en categoria.html
function cargarFrasesPorCategoria() {
    return new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaSeleccionada = urlParams.get("categoria");

        if (!categoriaSeleccionada) return resolve();

        document.getElementById("titulo-categoria").innerText = `Frases de ${categoriaSeleccionada}`;
        fetch('frases.json')
            .then(response => response.json())
            .then(data => {
                const listaFrases = document.getElementById("lista-frases");
                data.frases.forEach(fraseObj => {
                    if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                        const li = document.createElement("li");
                        li.className = "list-group-item";
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                        `;
                        listaFrases.appendChild(li);
                    }
                });
                resolve(); // Resolver la promesa al finalizar la carga
            })
            .catch(error => {
                console.error("Error al cargar frases por categoría:", error);
                reject(error); // Rechazar la promesa en caso de error
            });
    });
}

// Cargar información del autor en autor.html
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
                data.frases.forEach(fraseObj => {
                    if (fraseObj.autor_url === autorSeleccionado) {
                        const li = document.createElement("li");
                        li.className = "list-group-item";
                        li.innerHTML = `<p>${fraseObj.frase}</p>`;
                        listaFrases.appendChild(li);
                    }
                });
                resolve(); // Resolver la promesa al finalizar la carga
            })
            .catch(error => {
                console.error("Error al cargar frases del autor:", error);
                reject(error); // Rechazar la promesa en caso de error
            });
    });
}
