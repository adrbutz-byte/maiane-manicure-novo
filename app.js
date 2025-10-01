// O app.js agora depende dos dados do config.js (SERVICES, TIME_SLOTS_ALL, WHATSAPP_PHONE)

// --- ESTADO DA APLICAÇÃO ---
let selectedService = null;
let selectedDate = null;
let selectedPeriod = null;
let selectedTime = null;

// --- FUNÇÕES AUXILIARES ---

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

function showStep(stepId) {
    const stepElement = document.getElementById(stepId);
    stepElement.classList.add('step-visible');
    setTimeout(() => {
        scrollToElement(stepId);
    }, 10);
}

function getAvailableDates() {
    const dates = [];
    const today = new Date();
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const numberOfDays = 30;
    
    for (let i = 0; i < numberOfDays; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const value = date.toISOString().split('T')[0];
        const day = date.getDate();
        const dayName = dayNames[date.getDay()];
        
        dates.push({ value, day, dayName });
    }
    return dates;
}

// --- LÓGICA DE RENDERIZAÇÃO ---

function renderServices() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    SERVICES.forEach(service => {
        const card = document.createElement('div');
        card.id = `service-${service.id}`;
        card.classList.add('box-item', 'service-card', 'hover:border-primary-pink');
        card.setAttribute('data-id', service.id);
        
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-2xl mr-4">${service.icon}</span>
                <div class="flex-grow">
                    <div class="text-lg font-bold text-gray-800">${service.name}</div>
                    <div class="text-xs text-gray-500 mt-1">${service.description}</div>
                </div>
                <div class="text-xl font-extrabold text-primary-pink">${formatCurrency(service.price)}</div>
            </div>
        `;

        card.addEventListener('click', () => selectService(service.id));
        servicesList.appendChild(card);
    });
}

function renderDateSelection() {
    const container = document.getElementById('date-selection-container');
    container.innerHTML = '';
    const dates = getAvailableDates();

    dates.forEach(dateObj => {
        const card = document.createElement('div');
        card.classList.add('box-item', 'date-card', 'hover:border-primary-pink');
        card.setAttribute('data-date', dateObj.value);
        
        card.innerHTML = `
            <span class="day-name">${dateObj.dayName}</span>
            <span class="text-2xl">${dateObj.day}</span>
        `;
        
        if (selectedDate === dateObj.value) {
            card.classList.add('selected-item');
        }

        card.addEventListener('click', (e) => selectDate(dateObj.value, e.currentTarget));
        container.appendChild(card);
    });
}

function renderTimeSlots(slots) {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '';

    if (!slots || slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-3">Nenhum horário disponível neste período.</p>';
        return;
    }

    slots.forEach(slot => {
        const button = document.createElement('button');
        button.classList.add('box-item', 'time-slot-button', 'text-lg', 'font-bold', 'text-center', 'hover:border-primary-pink');
        button.textContent = slot.time;
        button.setAttribute('data-time', slot.time);
        
        button.addEventListener('click', (e) => selectTimeSlot(slot.time, e.currentTarget));
        timeSlotsContainer.appendChild(button);
    });
}


// --- LÓGICA DE SELEÇÃO E FLUXO ---
function selectService(id) {
    selectedService = SERVICES.find(s => s.id === id);
    const detailBox = document.getElementById('service-details');

    document.querySelectorAll('.service-card').forEach(card => card.classList.remove('selected-item'));
    
    const currentCard = document.getElementById(`service-${id}`);
    currentCard.classList.add('selected-item');
    
    detailBox.classList.add('selected-item');
    
    document.getElementById('detail-name').textContent = selectedService.name;
    document.getElementById('detail-description').textContent = selectedService.description;
    document.getElementById('detail-price').textContent = formatCurrency(selectedService.price);
    document.getElementById('detail-duration').textContent = selectedService.duration;
    detailBox.classList.remove('hidden');
    
    selectedDate = null;
    selectedPeriod = null;
    selectedTime = null;
    updateSummary();
    
    document.getElementById('step-2').classList.remove('step-visible');
    document.getElementById('step-3').classList.remove('step-visible');
    document.getElementById('period-selection').classList.add('hidden');
    document.getElementById('time-slots-wrapper').classList.add('hidden');
    
    updateBookButton();
}

function confirmService() {
    if (!selectedService) return;
    
    showStep('step-2');
    renderDateSelection();
}

function selectDate(dateString, cardElement) {
    selectedDate = dateString;
    selectedTime = null;
    selectedPeriod = null;
    
    document.querySelectorAll('.date-card').forEach(card => card.classList.remove('selected-item'));
    cardElement.classList.add('selected-item');
    
    document.querySelectorAll('.period-button').forEach(btn => btn.classList.remove('selected-item'));
    document.getElementById('time-slots').innerHTML = '';
    document.getElementById('time-slots-wrapper').classList.add('hidden');
    
    updateSummary();
    updateBookButton();

    showStep('step-3');
    document.getElementById('period-selection').classList.remove('hidden');
    document.getElementById('selected-period-text').textContent = '---';
    scrollToElement('period-selection');
}

function selectPeriod(period, buttonElement) {
    selectedPeriod = period;
    selectedTime = null;
    
    document.querySelectorAll('.period-button').forEach(btn => btn.classList.remove('selected-item'));
    buttonElement.classList.add('selected-item');
    
    document.getElementById('selected-period-text').textContent = (period === 'morning' ? 'Manhã' : 'Tarde');
    
    const filteredSlots = TIME_SLOTS_ALL.filter(slot => slot.period === selectedPeriod);
    renderTimeSlots(filteredSlots);

    document.getElementById('time-slots-wrapper').classList.remove('hidden');
    
    updateSummary();
    updateBookButton();
}

function selectTimeSlot(time, button) {
    selectedTime = time;
    
    document.querySelectorAll('.time-slot-button').forEach(btn => btn.classList.remove('selected-item'));
    button.classList.add('selected-item');
    
    updateSummary();
    updateBookButton();
}

function updateSummary() {
    document.getElementById('summary-service').textContent = selectedService ? selectedService.name : '---';
    document.getElementById('summary-price').textContent = selectedService ? formatCurrency(selectedService.price) : '---';
    
    if (selectedDate) {
        const dateParts = selectedDate.split('-');
        document.getElementById('summary-date').textContent = `${dateParts[2]}/${dateParts[1]}`;
    } else {
        document.getElementById('summary-date').textContent = '---';
    }
}

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


function finalizeBooking() {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const formattedPrice = formatCurrency(selectedService.price);
    const dateParts = selectedDate.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    const message = 
        `Olá, Maiane! Gostaria de agendar o seguinte:\n\n` +
        `- Serviço: ${selectedService.name}\n` +
        `- Descrição: ${selectedService.description}\n` +
        `- Preço: ${formattedPrice}\n` +
        `- Duração Estimada: ${selectedService.duration}\n\n` +
        `*Data:* ${formattedDate}\n` +
        `*Horário:* ${selectedTime}\n\n` +
        `Aguardo sua confirmação!`;
    
    const whatsappMessage = encodeURIComponent(message);
    
    // Usa a constante do arquivo de configuração (config.js)
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${whatsappMessage}`, '_blank');
}


// --- INICIALIZAÇÃO E LISTENERS ---
window.onload = () => {
    renderServices();

    document.getElementById('confirm-service-button').addEventListener('click', confirmService);
    document.getElementById('book-button').addEventListener('click', finalizeBooking);

    document.querySelectorAll('.period-button').forEach(button => {
        button.addEventListener('click', (e) => {
            selectPeriod(e.currentTarget.getAttribute('data-period'), e.currentTarget);
        });
    });
};
