document.addEventListener('DOMContentLoaded', () => {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const emptyEl = document.getElementById('empty-message');
    const gridEl = document.getElementById('products-grid');

    async function fetchProducts() {
        try {
            // Requisição para o backend local (certifique-se de que o backend também responde nessa porta CORS)
            const response = await fetch('http://localhost:3333/produtos');

            if (!response.ok) {
                throw new Error('Falha na resposta do servidor');
            }

            const data = await response.json();

            hideElement(loadingEl);

            if (data.length === 0) {
                showElement(emptyEl);
            } else {
                renderProducts(data);
                showElement(gridEl);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            hideElement(loadingEl);
            showElement(errorEl);
        }
    }

    window.deleteProduct = function (id) {
        fetch(`http://localhost:3333/produtos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na resposta do servidor');
                }
                return response.json();
            })
            .then(data => {
                alert("Produto deletado com sucesso!");
                fetchProducts(); // atualiza a lista após deletar
            })
            .catch(error => {
                console.error('Erro ao excluir produto:', error);
                alert('Erro ao deletar produto');
            });
    };


    function renderProducts(products) {
        gridEl.innerHTML = ''; // Limpa o grid

        products.forEach(product => {
            // Conversão de preco caso venha como string
            const precoFormatado = Number(product.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-header">
                    <h3 class="product-title" title="${product.nome}">${product.nome}</h3>
                    <span class="product-category">${product.categoria}</span>
                </div>
                <div class="product-body">
                    <p class="product-description">${product.descricao}</p>
                    <div class="product-price">
                        <span class="price-currency">R$</span>
                        ${precoFormatado}
                    </div>
                    <div class="product-actions">
                        <button class="btn-action btn-edit" title="Editar">Editar</button>
                        <button class="btn-action btn-delete" title="Excluir" onclick="deleteProduct(${product.id})">Excluir</button>
                    </div>
                </div>
            `;

            gridEl.appendChild(card);
        });
    }



    function hideElement(el) {
        if (el) el.classList.add('hidden');
    }

    function showElement(el) {
        if (el) el.classList.remove('hidden');
    }

    // Inicializa a busca de produtos
    fetchProducts();
});
