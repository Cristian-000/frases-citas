// cargarAutores.js

fetch('frases.json')
    .then(response => response.json())
    .then(data => {
        const autoresSet = new Set(); // Usamos un Set para evitar duplicados
        data.frases.forEach(frase => {
            autoresSet.add(frase.autor_url);
        });

        const autoresLista = document.getElementById('autores');
        autoresSet.forEach(autor => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `<a href="autor.html?autor=${autor}">${autor.replace(/-/g, ' ')}</a>`;
            autoresLista.appendChild(li);
        });
    })
    .catch(error => console.error('Error al cargar los autores:', error));
