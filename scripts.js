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

// Variables globales para compartir
const marcaAgua = 'TuPáginaWeb.com'; // Variable para la marca de agua
let fraseCompartir = "Tu frase aquí"; // Frase de ejemplo
let autorCompartir = "Autor aquí"; // Autor de ejemplo

function setFraseParaCompartir(frase, autor) {
    fraseCompartir = frase;
    autorCompartir = autor;
    mostrarOpcionesCompartir();
}

function mostrarOpcionesCompartir() {
    const opcionesDiv = document.getElementById("opciones-compartir");
    opcionesDiv.style.display = "block"; // Muestra el contenedor de opciones
}

function generarImagenFrase(texto, colorTexto = '#000000', colorFondo = '#ffffff', fuente = 'Arial', tamanoFuente = '40') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Configura el tamaño del canvas (vertical)
    canvas.width = 400;
    canvas.height = 800;

    // Configura el fondo
    context.fillStyle = colorFondo;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Configura el estilo de la fuente
    context.font = `${tamanoFuente}px ${fuente}`; // Tamaño de fuente desde el selector
    context.fillStyle = colorTexto;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Dibuja el texto en el canvas
    const lineHeight = parseInt(tamanoFuente) * 1.2; // Ajuste de la altura de línea
    const words = texto.split(" ");
    let line = "";
    let y = canvas.height / 2 - (lineHeight * (Math.ceil(words.length / 2))) / 2; // Centrar verticalmente

    // Ajuste para evitar que el texto se salga del canvas
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > canvas.width && line) {
            context.fillText(line, canvas.width / 2, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, canvas.width / 2, y); // Última línea

    // Agregar la marca de agua
    context.font = '20px Arial';
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Color con opacidad para la marca de agua
    context.textAlign = 'center';
    context.fillText(marcaAgua, canvas.width / 2, canvas.height - 30); // Posición de la marca de agua

    return canvas.toDataURL('image/png'); // Devuelve la imagen en formato base64
}
function crearImagenCompartible() {
    const textoImagen = `${fraseCompartir}\n- ${autorCompartir}`;
    const colorTexto = document.getElementById("color-selector").value; // Obtener el color de texto
    const colorFondo = document.getElementById("fondo-selector").value; // Obtener el color de fondo
    const fuente = document.getElementById("fuente-selector").value; // Obtener la fuente seleccionada
    const tamanoFuente = document.getElementById("fuente-tamano-selector").value; // Obtener el tamaño de fuente

    const imagenDataURL = generarImagenFrase(textoImagen, colorTexto, colorFondo, fuente, tamanoFuente); // Pasar tamaño de fuente

    // Mostrar la vista previa
    const previewCanvas = document.getElementById("preview");
    const previewContext = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewContext.drawImage(img, 0, 0);
    }
    img.src = imagenDataURL;

    // Crear un enlace para compartir la imagen
    const link = document.createElement('a');
    link.href = imagenDataURL;
    link.download = `${fraseCompartir}.png`; // Nombre del archivo de la imagen
    document.body.appendChild(link);
    link.click(); // Simular un clic en el enlace
    document.body.removeChild(link); // Limpiar el DOM
}

function actualizarPreview() {
    const textoImagen = `${fraseCompartir}\n- ${autorCompartir}`;
    const colorTexto = document.getElementById("color-selector").value; // Obtener el color de texto
    const colorFondo = document.getElementById("fondo-selector").value; // Obtener el color de fondo
    const fuente = document.getElementById("fuente-selector").value; // Obtener la fuente seleccionada
    const tamanoFuente = document.getElementById("fuente-tamano-selector").value; // Obtener el tamaño de fuente

    const imagenDataURL = generarImagenFrase(textoImagen, colorTexto, colorFondo, fuente, tamanoFuente);

    // Mostrar la vista previa
    const previewCanvas = document.getElementById("preview");
    const previewContext = previewCanvas.getContext('2d');
    const img = new Image();
    img.onload = function() {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewContext.drawImage(img, 0, 0);
    }
    img.src = imagenDataURL;
}

// Agregar eventos de cambio a los selectores
document.getElementById("color-selector").addEventListener("input", actualizarPreview);
document.getElementById("fondo-selector").addEventListener("input", actualizarPreview);
document.getElementById("fuente-selector").addEventListener("change", actualizarPreview);
document.getElementById("fuente-tamano-selector").addEventListener("change", actualizarPreview); // Evento para el tamaño de fuente

// Llamar a la función para generar el preview inicial
actualizarPreview();
// Event listener para el botón de crear imagen compartible
document.getElementById("btn-crear-imagen").addEventListener("click", crearImagenCompartible);