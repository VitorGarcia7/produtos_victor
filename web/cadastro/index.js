document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('feedback-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os dados do form
        const nome = document.getElementById('nome').value;
        const preco = document.getElementById('preco').value;
        const categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value;

        const produto = {
            nome,
            preco: parseFloat(preco),
            categoria,
            descricao
        };

        // Estado de Loading
        setLoadingState(true);

        try {
            const response = await fetch('http://localhost:3333/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.mensagem || 'Falha ao cadastrar');
            }

            showFeedback(result.mensagem || 'Produto cadastrado com sucesso!', 'success');
            form.reset();

        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            showFeedback(error.message || 'Ocorreu um erro ao cadastrar o produto.', 'error');
        } finally {
            setLoadingState(false);

            // Oculta a mensagem após alguns segundos
            setTimeout(() => {
                feedbackBox.classList.add('hidden');
            }, 5000);
        }
    });

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner-small"></div>';
            feedbackBox.classList.add('hidden');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Adicionar Produto';
        }
    }

    function showFeedback(message, type) {
        feedbackBox.textContent = message;
        feedbackBox.className = `feedback-message ${type}`;
        feedbackBox.classList.remove('hidden');
    }
});
