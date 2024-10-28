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

function cargarCategorias() {
    return fetch('frases.json')
        .then(response => response.json())
        .then(data => {
            const listaCategorias = document.getElementById("categorias");
            const categoriasUnicas = new Set();

            data.frases.forEach(fraseObj => {
                fraseObj.categorias.forEach(categoria => categoriasUnicas.add(categoria));
            });

            categoriasUnicas.forEach(categoria => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}">${categoria}</a>`;
                listaCategorias.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
}

function cargarFraseDelDia() {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("fechaFraseDelDia");
    const storedFrase = JSON.parse(localStorage.getItem("fraseDelDia"));

    if (storedDate === today && storedFrase) {
        document.getElementById("frase-del-dia").innerHTML = `
            <p>${storedFrase.frase}</p>
            <div>
                <small><a href="autor.html?autor=${storedFrase.autor_url}">${storedFrase.autor_url}</a></small>
                ${storedFrase.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
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
                        fraseObj.frase.toLowerCase().includes(query) || fraseObj.autor_url.toLowerCase().includes(query)
                    );

                    frasesEncontradas.forEach(fraseObj => {
                        const li = document.createElement("a");
                        li.className = "list-group-item list-group-item-action";
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <div>
                                <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                                ${fraseObj.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
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

            data.frases.forEach(fraseObj => {
                if (fraseObj.categorias.includes(categoriaSeleccionada)) {
                    const li = document.createElement("li");
                    li.className = "list-group-item";
                    li.innerHTML = `
                        <p>${fraseObj.frase}</p>
                        <div>
                            <small><a href="autor.html?autor=${fraseObj.autor_url}">${fraseObj.autor_url}</a></small>
                            ${fraseObj.categorias.map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`).join(' ')}
                        </div>
                    `;
                    listaFrases.appendChild(li);
                }
            });
        })
        .catch(error => console.error("Error al cargar frases por categoría:", error));
}


function cargarAutorasdasdasd() {
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

                        // Crear enlaces de categorías con estilos
                        const categorias = fraseObj.categorias
                            .map(categoria => `<a href="categoria.html?categoria=${encodeURIComponent(categoria)}" class="badge badge-secondary ml-2">${categoria}</a>`)
                            .join(' ');

                        // Agregar la frase y las categorías formateadas en el HTML
                        li.innerHTML = `
                            <p>${fraseObj.frase}</p>
                            <div>
                                 ${categorias}
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

//canvas test

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

// imagen preview y demás
// Opciones de textura de fondo
const texturas = [
    "—Pngtree—simple border png material_4484003.png",
    "/—Pngtree—simple border png material_4484003.png",
    "pngkey.com-fancy-border-png-71261.png"
];

// Marca de agua personalizada
const marcaAgua = 'Tu Marca de Agua';

function actualizarPreview() {
    const textoImagen = `${fraseCompartir}\n- ${autorCompartir}`;
    const colorTexto = document.getElementById("color-selector").value;
    const colorFondo = document.getElementById("fondo-selector").value;
    const fuente = document.getElementById("fuente-selector").value;
    const tamanoFuente = parseInt(document.getElementById("fuente-tamano-selector").value);
    const borde = document.getElementById("borde-selector").value;
    const sombra = document.getElementById("sombra-selector").checked;
    const gradienteFondo = document.getElementById("gradiente-selector").checked;

    const imagenDataURL = generarImagenFrase(textoImagen, colorTexto, colorFondo, fuente, tamanoFuente, borde, sombra, gradienteFondo);

    // Mostrar la vista previa
    const previewCanvas = document.getElementById("preview");
    const previewContext = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewContext.drawImage(img, 0, 0);
    };
    img.src = imagenDataURL;
}

function generarImagenFrase(texto, colorTexto, colorFondo, fuente, tamanoFuente, borde, sombra, gradienteFondo) {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");

    // Fondo con gradiente o textura
    if (gradienteFondo) {
        const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradiente.addColorStop(0, colorFondo);
        gradiente.addColorStop(1, "#FFFFFF"); // Cambia el color final del gradiente si lo deseas
        ctx.fillStyle = gradiente;
    } else {
        ctx.fillStyle = colorFondo;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fondo con textura si no se usa gradiente
    if (!gradienteFondo) {
        const textura = new Image();
        textura.src = texturas[Math.floor(Math.random() * texturas.length)];
        textura.onload = () => {
            ctx.globalAlpha = 0.3; // Ajustar transparencia de la textura
            ctx.drawImage(textura, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
        };
    }

    // Configuración de borde
    if (borde !== 'none') {
        ctx.lineWidth = 10;
        ctx.strokeStyle = borde;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Sombra de texto
    if (sombra) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 10;
    }

    // Configuración de texto
    ctx.font = `${tamanoFuente}px ${fuente}`;
    ctx.fillStyle = colorTexto;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lineasTexto = texto.split("\n");
    lineasTexto.forEach((linea, index) => {
        ctx.fillText(linea, canvas.width / 2, canvas.height / 2 + index * (tamanoFuente + 10));
    });

    // Marca de agua
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillText(marcaAgua, canvas.width - 100, canvas.height - 30);

    return canvas.toDataURL("image/png");
}

function crearImagenCompartible() {
    const fraseCompartir = "Tu frase aquí";
    const autorCompartir = "Autor";
    const textoImagen = `${fraseCompartir}\n- ${autorCompartir}`;

    const colorTexto = document.getElementById("color-selector").value;
    const colorFondo = document.getElementById("fondo-selector").value;
    const fuente = document.getElementById("fuente-selector").value;
    const tamanoFuente = parseInt(document.getElementById("fuente-tamano-selector").value);
    const borde = document.getElementById("borde-selector").value;
    const sombra = document.getElementById("sombra-selector").checked;
    const gradienteFondo = document.getElementById("gradiente-selector").checked;

    const imagenDataURL = generarImagenFrase(textoImagen, colorTexto, colorFondo, fuente, tamanoFuente, borde, sombra, gradienteFondo);

    // Generar preview de la imagen
    const previewCanvas = document.getElementById("preview");
    const previewContext = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewContext.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
    };
    img.src = imagenDataURL;

    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = imagenDataURL;
    link.download = `${fraseCompartir}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners para actualizaciones en tiempo real
document.getElementById("color-selector").addEventListener("input", actualizarPreview);
document.getElementById("fondo-selector").addEventListener("input", actualizarPreview);
document.getElementById("fuente-selector").addEventListener("change", actualizarPreview);
document.getElementById("fuente-tamano-selector").addEventListener("change", actualizarPreview);
document.getElementById("borde-selector").addEventListener("change", actualizarPreview);
document.getElementById("sombra-selector").addEventListener("change", actualizarPreview);
document.getElementById("gradiente-selector").addEventListener("change", actualizarPreview);

// Event listener para el botón de crear imagen compartible
document.getElementById("btn-crear-imagen").addEventListener("click", crearImagenCompartible);

// Inicializar el preview
actualizarPreview();
