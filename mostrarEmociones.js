document.addEventListener("DOMContentLoaded", () => {
    const emociones = [
        { emocion: "Feliz", categoria: "Vida" },
        { emocion: "Triste", categoria: "Superación" },
        { emocion: "Motivado", categoria: "Motivación" },
        { emocion: "Amoroso", categoria: "Amor" },
        { emocion: "Pensativo", categoria: "Filosofía" },
        { emocion: "Perseverante", categoria: "Inspiración" }
    ];

    const container = document.createElement("div");
    container.className = "row text-center my-4";

    emociones.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-md-2 col-4";
        col.innerHTML = `
            <button class="btn btn-primary btn-block emocion-btn" data-categoria="${item.categoria}">
                ${item.emocion}
            </button>
        `;
        container.appendChild(col);
    });

    document.querySelector(".container").appendChild(container);

    // Evento para redirigir según la emoción seleccionada
    document.querySelectorAll(".emocion-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const categoria = e.target.getAttribute("data-categoria");
            window.location.href = `categorias.html?categoria=${categoria}`;
        });
    });
});
