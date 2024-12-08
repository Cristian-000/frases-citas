  document.addEventListener("DOMContentLoaded", () => {
            const emociones = document.querySelectorAll('.emocion');

            emociones.forEach(emocion => {
                emocion.addEventListener('click', () => {
                    const seleccion = emocion.dataset.emocion;
                    console.log(`Seleccionaste: ${seleccion}`);
                    // Aquí puedes redirigir a otra página
                    window.location.href = `categoria.html?categoria=${encodeURIComponent(seleccion)}`;
                });
            });
        });
