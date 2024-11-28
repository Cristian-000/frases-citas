document.addEventListener("DOMContentLoaded", () => {
    const listaDichos = document.getElementById("lista-dichos");

    fetch('dichos.json')
        .then(response => response.json())
        .then(data => {
            data.dichos.forEach(dichoObj => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = dichoObj.dicho;
                listaDichos.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar los dichos:", error));
});
