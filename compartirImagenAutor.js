document.addEventListener("DOMContentLoaded", () => {
    const promises = [];

    if (document.getElementById("titulo-autor")) {
        promises.push(cargarAutor());
    }

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
        .then(() => console.log("Carga completada"))
        .catch(error => console.error("Error en la carga:", error));
});

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

let fraseCompartir = '';
let autorCompartir = '';

function setFraseParaCompartir(frase, autor) {
    fraseCompartir = frase;
    autorCompartir = autor;
    document.getElementById("opciones-compartir").style.display = "block";
    actualizarPreview();
}

const texturas = [
    "—Pngtree—simple border png material_4484003.png",
    "pngkey.com-fancy-border-png-71261.png",
    "pngkey.com-fancy-border-png-71261.png"
];
const marcaAgua = 'Tu Marca de Agua';

function actualizarPreview() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = document.getElementById("fondo-selector").value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texturaImg = new Image();
    texturaImg.src = texturas[0];
    texturaImg.onload = () => {
        ctx.drawImage(texturaImg, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = document.getElementById("color-selector").value;
        ctx.font = `${document.getElementById("tamano-selector").value}px ${document.getElementById("fuente-selector").value}`;
        ctx.textAlign = "center";
        ctx.fillText(fraseCompartir, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`- ${autorCompartir}`, canvas.width / 2, canvas.height / 2 + 40);

        ctx.font = "12px Arial";
        ctx.fillText(marcaAgua, canvas.width - 50, canvas.height - 10);
    };
}

function cambiarTextura() {
    const nuevaTextura = texturas[Math.floor(Math.random() * texturas.length)];
    texturas[0] = nuevaTextura;
    actualizarPreview();
}

function crearImagenCompartible() {
    const canvas = document.getElementById("preview");
    const enlace = document.createElement("a");
    enlace.href = canvas.toDataURL();
    enlace.download = "frase_compartible.png";
    enlace.click();
}
