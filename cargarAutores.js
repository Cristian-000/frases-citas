Promise.all([fetch('frases.json'), fetch('autores.json')])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([frasesData, autoresData]) => {
        const autoresLista = document.getElementById('autores');

        // Crear un mapa de conteo de frases por autor
        const fraseCount = frasesData.frases.reduce((countMap, frase) => {
            if (frase.autor_url) {
                countMap[frase.autor_url] = (countMap[frase.autor_url] || 0) + 1;
            }
            return countMap;
        }, {});

        // Recorrer la lista de autores
        autoresData.autores.forEach(autor => {
            const count = fraseCount[autor.autor_url] || 0; // Obtener el conteo de frases

            // Verificar que el autor tenga nombre y biografía
            if (autor.nombre && autor.biografia) {
                // Crear un elemento de la lista
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="autor.html?autor=${autor.autor_url}" class="author-link">
                            <h5 class="font-weight-bold text-primary mb-0">${autor.nombre}</h5>
                        </a>
                         <a href="autor.html?autor=${autor.autor_url}" class="author-link">
                            <span class="badge badge-primary">${count} frase${count !== 1 ? 's' : ''}</span>
                        </a>
                        
                    </div>
                    <p class="mb-1 text-muted">${autor.biografia}</p>
                `;
                autoresLista.appendChild(li);
            }
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));
