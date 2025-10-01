// --- VARIÁVEIS DE ESTADO GLOBAL ---
// Estas variáveis dependem do arquivo config.js que deve ser carregado primeiro
let selectedService = null;
let selectedDate = null;
let selectedTime = null;

// Função utilitária para formatar o preço em Reais
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

// Função utilitária para formatar a data (Dia/Mês)
function formatDate(date) {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// --- FUNÇÕES DE RENDERIZAÇÃO E LÓGICA ---

/**
 * Renderiza a lista de serviços na Etapa 1.
 */
function renderServices() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = ''; 

    // O array SERVICES é carregado do config.js
    if (typeof SERVICES === 'undefined') {
        console.error("Erro: O arquivo config.js não foi carregado corretamente.");
        servicesList.innerHTML = '<p class="text-red-500">Erro ao carregar serviços. Verifique o console para detalhes.</p>';
        return;
    }
    
    SERVICES.forEach(service => {
        const item = document.createElement('div');
        item.className = 'box-item flex justify-between items-center';
        item.setAttribute('data-service-id', service.id);
        item.innerHTML = `
            <div class="flex items-start">
                <span class="text-2xl mr-3">${service.icon}</span>
                <div>
                    <h3 class="font-bold text-gray-800">${service.name}</h3>
                    <p class="text-sm text-gray-500">${service.description.substring(0, 50)}...</p>
                </div>
            </div>
            <span class="text-lg font-extrabold text-dark-pink">${formatPrice(service.price)}</span>
        `;
        
        item.addEventListener('click', () => selectService(service, item));
        servicesList.appendChild(item);
    });
}

/**
 * Seleciona um serviço, atualiza o resumo e mostra os detalhes.
 */
function selectService(service, element) {
    // 1. Limpa o estado atual
    document.querySelectorAll('#services-list .box-item').forEach(el => el.classList.remove('selected-item'));
    document.querySelectorAll('.time-slot-item').forEach(el => el.classList.remove('selected-item'));
    document.querySelectorAll('.date-card').forEach(el => el.classList.remove('selected-item'));
    
    // 2. Atualiza variáveis de estado
    selectedService = service;
    selectedDate = null;
    selectedTime = null;

    // 3. Aplica o estilo de seleção
    element.classList.add('selected-item');

    // 4. Preenche a seção de detalhes
    document.getElementById('detail-name').textContent = selectedService.name;
    document.getElementById('detail-description').textContent = selectedService.description;
    document.getElementById('detail-price').textContent = formatPrice(selectedService.price);
    document.getElementById('detail-duration').textContent = selectedService.duration;
    document.getElementById('service-details').classList.remove('hidden');

    // 5. Atualiza o resumo
    updateSummary();

    // 6. Reseta a visualização dos passos futuros
    document.getElementById('step-2').classList.remove('step-visible');
    document.getElementById('step-3').classList.remove('step-visible');
}


/**
 * Confirma o serviço e avança para a seleção de data.
 */
function confirmService() {
    if (!selectedService) return;

    // Mostra o passo 2
    document.getElementById('step-2').classList.add('step-visible');

    // Gera o seletor de datas
    renderDateSelection();

    // Rola para o passo 2
    document.getElementById('step-2').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Gera os cards de data para os próximos 16 dias.
 */
function renderDateSelection() {
    const container = document.getElementById('date-selection-container');
    container.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora para comparação

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 0; i < 16; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const day = date.getDate();
        const dayIndex = date.getDay();
        const dayName = dayNames[dayIndex];
        
        const dateString = date.toISOString().split('T')[0]; // Ex: "2025-10-01"

        const card = document.createElement('div');
        card.className = 'date-card box-item flex-shrink-0';
        card.setAttribute('data-date', dateString);
        card.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="text-xl">${day}</span>
        `;
        
        card.addEventListener('click', () => selectDate(dateString, card));
        container.appendChild(card);
    }
}

/**
 * Seleciona uma data e avança para a seleção de período/horário.
 */
function selectDate(dateString, element) {
    // 1. Limpa o estado atual (datas e horários)
    document.querySelectorAll('#date-selection-container .date-card').forEach(el => el.classList.remove('selected-item'));
    document.querySelectorAll('.time-slot-item').forEach(el => el.classList.remove('selected-item'));
    
    // 2. Atualiza variáveis de estado
    selectedDate = dateString;
    selectedTime = null;

    // 3. Aplica o estilo de seleção
    element.classList.add('selected-item');

    // 4. Mostra o passo 3 (seleção de período e horários)
    document.getElementById('step-3').classList.add('step-visible');
    document.getElementById('period-selection').classList.remove('hidden');
    document.getElementById('time-slots-wrapper').classList.add('hidden'); // Oculta slots até que o período seja escolhido

    // 5. Atualiza o resumo e o botão de agendamento
    updateSummary();
    updateBookButton();

    // 6. Rola para o passo 3
    document.getElementById('step-3').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/**
 * Seleciona um período (Manhã/Tarde) e renderiza os horários.
 */
function selectPeriod(period, element) {
    // 1. Limpa a seleção de período e horário
    document.querySelectorAll('.period-button').forEach(el => el.classList.remove('selected-item'));
    document.querySelectorAll('.time-slot-item').forEach(el => el.classList.remove('selected-item'));
    selectedTime = null;

    // 2. Aplica o estilo de seleção
    element.classList.add('selected-item');

    // 3. Filtra os horários disponíveis (TIME_SLOTS_ALL vem do config.js)
    const availableSlots = TIME_SLOTS_ALL.filter(slot => slot.period === period);
    
    // 4. Renderiza os slots
    const slotsContainer = document.getElementById('time-slots');
    slotsContainer.innerHTML = '';

    availableSlots.forEach(slot => {
        const slotItem = document.createElement('div');
        slotItem.className = 'time-slot-item box-item text-center font-semibold';
        slotItem.textContent = slot.time;
        slotItem.setAttribute('data-time', slot.time);
        
        slotItem.addEventListener('click', () => selectTime(slot.time, slotItem, period));
        slotsContainer.appendChild(slotItem);
    });

    // 5. Atualiza o texto do período
    const periodText = period === 'morning' ? 'Manhã' : 'Tarde';
    document.getElementById('selected-period-text').textContent = periodText;
    document.getElementById('time-slots-wrapper').classList.remove('hidden');

    // 6. Atualiza o botão
    updateBookButton();
}

/**
 * Seleciona um horário e atualiza o resumo.
 */
function selectTime(time, element, period) {
    // 1. Limpa a seleção de horário
    document.querySelectorAll('.time-slot-item').forEach(el => el.classList.remove('selected-item'));
    
    // 2. Atualiza variáveis de estado
    selectedTime = time;

    // 3. Aplica o estilo de seleção
    element.classList.add('selected-item');

    // 4. Atualiza o resumo e o botão de agendamento
    updateSummary();
    updateBookButton();
}

/**
 * Atualiza a barra de resumo final.
 */
function updateSummary() {
    document.getElementById('summary-service').textContent = selectedService ? selectedService.name : '---';
    document.getElementById('summary-date').textContent = selectedDate ? formatDate(selectedDate) : '---';
    document.getElementById('summary-price').textContent = selectedService ? formatPrice(selectedService.price) : '---';
}

/**
 * Ativa/desativa e estiliza o botão final de agendamento.
 * O botão agora é ROSA FORTE o tempo todo, mas usa opacidade quando desativado.
 */
function updateBookButton() {
    const bookButton = document.getElementById('book-button');
    
    if (selectedService && selectedDate && selectedTime) {
        bookButton.disabled = false;
        bookButton.textContent = `Agendar ${selectedService.name} - ${selectedTime}`;
        // Ativado: Remove a opacidade para ficar com a cor total e habilita o hover
        bookButton.classList.remove('opacity-50', 'cursor-not-allowed');
        bookButton.classList.add('hover:bg-dark-pink'); // Garante que o hover rosa escuro funcione
    } else {
        bookButton.disabled = true;
        bookButton.textContent = 'Preencha todos os passos';
        // Desativado: Adiciona opacidade para indicar que está inativo
        bookButton.classList.add('opacity-50', 'cursor-not-allowed');
        bookButton.classList.remove('hover:bg-dark-pink'); // Remove o hover quando inativo
    }
}

/**
 * Finaliza o agendamento e abre o WhatsApp.
 */
function finalizeBooking() {
    if (!selectedService || !selectedDate || !selectedTime) {
        alert("Por favor, selecione o serviço, a data e o horário para agendar.");
        return;
    }

    const formattedPrice = formatPrice(selectedService.price);
    const formattedDate = formatDate(selectedDate);
    
    const message = `Olá, Maiane! Gostaria de agendar o seguinte:\n` +
        `- Serviço: ${selectedService.name}\n` +
        `- Descrição: ${selectedService.description}\n` +
        `- Preço: ${formattedPrice}\n` +
        `- Duração Estimada: ${selectedService.duration}\n\n` +
        `*Data:* ${formattedDate}\n` +
        `*Horário:* ${selectedTime}\n\n` +
        `Aguardo sua confirmação!`;
    
    const whatsappMessage = encodeURIComponent(message);
    
    // O número WHATSAPP_PHONE é carregado do config.js
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${whatsappMessage}`, '_blank');
}


// --- INICIALIZAÇÃO E LISTENERS ---
window.onload = () => {
    // Esta função é vital para mostrar os serviços na tela
    renderServices();

    // Listeners de eventos
    document.getElementById('confirm-service-button').addEventListener('click', confirmService);
    document.getElementById('book-button').addEventListener('click', finalizeBooking);

    // Listener para os botões de período (Manhã/Tarde)
    document.querySelectorAll('.period-button').forEach(button => {
        button.addEventListener('click', (e) => {
            selectPeriod(e.currentTarget.getAttribute('data-period'), e.currentTarget);
        });
    });
};
