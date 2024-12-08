   document.addEventListener("DOMContentLoaded", () => {
            const emociones = document.querySelectorAll('.emocion');

            emociones.forEach(emocion => {
                emocion.addEventListener('click', () => {
                    const seleccion = emocion.dataset.emocion;
                    const baseUrl = "https://cristian-000.github.io/frases-citas/categoria.html";
                    const url = `${baseUrl}?categoria=${encodeURIComponent(seleccion)}`;
                    window.location.href = url;
                });
            });
        });
