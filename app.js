// Captura do formulário
const form = document.getElementById('form-contato');
const resposta = document.getElementById('resposta');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (nome === '' || email === '' || mensagem === '') {
        resposta.textContent = 'Por favor, preencha todos os campos.';
        resposta.style.color = 'red';
        return;
    }

    // Aqui você pode adicionar integração com backend ou email
    resposta.textContent = 'Mensagem enviada com sucesso! Obrigado!';
    resposta.style.color = 'green';

    form.reset();
});
