/**
 * Ativa/desativa e estiliza o botão final de agendamento.
 * Corrigido: Garante que o texto seja visível quando o botão está DESATIVADO.
 */
function updateBookButton() {
    const bookButton = document.getElementById('book-button');
    if (selectedService && selectedDate && selectedTime) {
        bookButton.disabled = false;
        bookButton.textContent = `Agendar ${selectedService.name} - ${selectedTime}`;
        // ATIVADO: Remove classes de desativado e adiciona Rosa Principal + Texto Branco
        bookButton.classList.remove('bg-gray-300', 'text-gray-600'); 
        bookButton.classList.add('bg-primary-pink', 'hover:bg-dark-pink', 'text-white');
    } else {
        bookButton.disabled = true;
        bookButton.textContent = 'Preencha todos os passos';
        // DESATIVADO: Adiciona Cinza Claro (fundo) e Cinza Escuro (texto) para visibilidade
        bookButton.classList.add('bg-gray-300', 'text-gray-600'); 
        bookButton.classList.remove('bg-primary-pink', 'hover:bg-dark-pink', 'text-white');
    }
}
