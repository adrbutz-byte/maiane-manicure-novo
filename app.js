/**
 * Ativa/desativa e estiliza o botão final de agendamento.
 * NOVO: O botão agora é ROSA FORTE o tempo todo, mas usa opacidade quando desativado.
 */
function updateBookButton() {
    const bookButton = document.getElementById('book-button');
    
    if (selectedService && selectedDate && selectedTime) {
        bookButton.disabled = false;
        bookButton.textContent = `Agendar ${selectedService.name} - ${selectedTime}`;
        // Ativado: Remove a opacidade para ficar com a cor total e habilita o hover
        bookButton.classList.remove('opacity-50', 'cursor-not-allowed');
        bookButton.classList.add('hover:bg-dark-pink');
    } else {
        bookButton.disabled = true;
        bookButton.textContent = 'Preencha todos os passos';
        // Desativado: Adiciona opacidade para indicar que está inativo
        bookButton.classList.add('opacity-50', 'cursor-not-allowed');
        bookButton.classList.remove('hover:bg-dark-pink');
    }
}
