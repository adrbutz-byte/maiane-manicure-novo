// --- SERVIÇOS ---
const SERVICES = [
    { id:1, name:"Pé", duration:"1:30 min", price:30.00, description:"Cuidado completo para os seus pés.", icon:"👣" },
    { id:2, name:"Mão", duration:"1:30 min", price:30.00, description:"Tratamento especializado para suas mãos.", icon:"💅" },
    { id:3, name:"Unha Postiça", duration:"1:30 min", price:40.00, description:"Alongamento com unhas postiças.", icon:"✨" },
    { id:4, name:"Combo Pé e Mão", duration:"2:30 min", price:50.00, description:"Pacote completo para sua beleza!", icon:"👑" },
    { id:5, name:"Esmaltação", duration:"1:30 min", price:15.00, description:"Aplicação de esmalte rápido.", icon:"🌈" }
];

// --- HORÁRIOS FIXOS ---
const TIME_SLOTS_ALL = [
    { time:"08:30", period:"morning" },
    { time:"10:00", period:"morning" },
    { time:"13:00", period:"afternoon" },
    { time:"14:30", period:"afternoon" },
    { time:"16:00", period:"afternoon" }
];

// --- SIMULAÇÃO DE HORÁRIOS RESERVADOS ---
const reservedSlots = {}; // Ex: { "2025-10-01": ["08:30"] }

let selectedService = null;
let selectedDate = null;
let selectedPeriod = null;
let selectedTime = null;

// --- FUNÇÕES AUXILIARES ---
function formatCurrency(value){ return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function scrollToElement(id){ const el=document.getElementById(id); if(el){ window.scrollTo({top:el.getBoundingClientRect().top + window.scrollY -70, behavior:'smooth'}); }}
function showStep(stepId){ const el=document.getElementById(stepId); el.classList.add('step-visible'); setTimeout(()=>scrollToElement(stepId),10);}
function getAvailableDates(){ const dates=[]; const today=new Date(); const dayNames=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"]; for(let i=0;i<30;i++){ const date=new Date(today); date.setDate(today.getDate()+i); const value=date.toISOString().split('T')[0]; dates.push({ value, day:date.getDate(), dayName:dayNames[date.getDay()] });} return dates;}

// --- RENDERIZAÇÃO ---
function renderServices(){
    const list=document.getElementById('services-list'); list.innerHTML='';
    SERVICES.forEach(s=>{
        const card=document.createElement('div'); card.id=`service-${s.id}`; card.classList.add('box-item','service-card'); card.innerHTML=`
            <div class="flex items-center justify-between">
                <span class="text-2xl mr-4">${s.icon}</span>
                <div class="flex-grow">
                    <div class="text-lg font-bold text-gray-800">${s.name}</div>
                    <div class="text-xs text-gray-500 mt-1">${s.description}</div>
                </div>
                <div class="text-xl font-extrabold text-primary-pink">${formatCurrency(s.price)}</div>
            </div>
        `;
        card.addEventListener('click',()=>selectService(s.id));
        list.appendChild(card);
    });
}

function renderDateSelection(){
    const container=document.getElementById('date-selection-container'); container.innerHTML='';
    const dates=getAvailableDates();
    dates.forEach(d=>{
        const card=document.createElement('div'); card.classList.add('box-item','date-card'); card.setAttribute('data-date',d.value);
        card.innerHTML=`<span class="day-name">${d.dayName}</span><span class="text-2xl">${d.day}</span>`;
        if(selectedDate===d.value) card.classList.add('selected-item');
        card.addEventListener('click',()=>selectDate(d.value,card));
        container.appendChild(card);
    });
}

function renderTimeSlots(slots){
    const container=document.getElementById('time-slots'); container.innerHTML='';
    if(!slots||slots.length===0){ container.innerHTML='<p class="text-center text-gray-500 col-span-3">Nenhum horário disponível neste período.</p>'; return;}
    slots.forEach(s=>{
        const btn=document.createElement('button'); btn.classList.add('box-item','time-slot-button','text-lg','font-bold','text-center'); btn.textContent=s.time;
        if(reservedSlots[selectedDate]?.includes(s.time)) btn.disabled=true;
        btn.addEventListener('click',e=>selectTimeSlot(s.time,e.currentTarget));
        container.appendChild(btn);
    });
}

// --- SELEÇÃO ---
function selectService(id){
    selectedService=SERVICES.find(s=>s.id===id);
    const detailBox=document.getElementById('service-details');
    document.querySelectorAll('.service-card').forEach(c=>c.classList.remove('selected-item'));
    document.getElementById(`service-${id}`).classList.add('selected-item');
    detailBox.classList.add('selected-item'); detailBox.classList.remove('hidden');
    document.getElementById('detail-name').textContent=selectedService.name;
    document.getElementById('detail-description').textContent=selectedService.description;
    document.getElementById('detail-price').textContent=formatCurrency(selectedService.price);
    document.getElementById('detail-duration').textContent=selectedService.duration;

    selectedDate=null; selectedPeriod=null; selectedTime=null;
    updateSummary(); updateBookButton();
    document.getElementById('step-2').classList.remove('step-visible');
    document.getElementById('step-3').classList.remove('step-visible');
    document.getElementById('period-selection').classList.add('hidden');
    document.getElementById('time-slots-wrapper').classList.add('hidden');
}

function confirmService(){ if(!selectedService) return; showStep('step-2'); renderDateSelection(); }

function selectDate(date,card){
    if(reservedSlots[date] && reservedSlots[date].length===TIME_SLOTS_ALL.length){
        alert("Todos os horários desta data já estão ocupados. Por favor, escolha outra data.");
        return;
    }
    selectedDate=date; selectedPeriod=null; selectedTime=null;
    document.querySelectorAll('.date-card').forEach(c=>c.classList.remove('selected-item'));
    card.classList.add('selected-item');
    document.getElementById('period-selection').classList.remove('hidden');
    document.getElementById('time-slots-wrapper').classList.add('hidden');
    document.getElementById('selected-period-text').textContent='---';
    updateSummary(); updateBookButton(); showStep('step-3'); scrollToElement('period-selection');
}

function selectPeriod(period,btn){
    selectedPeriod=period; selectedTime=null;
    document.querySelectorAll('.period-button').forEach(b=>b.classList.remove('selected-item'));
    btn.classList.add('selected-item');
    document.getElementById('selected-period-text').textContent=(period==='morning'?'Manhã':'Tarde');
    const filtered=TIME_SLOTS_ALL.filter(s=>s.period===selectedPeriod);
    renderTimeSlots(filtered);
    document.getElementById('time-slots-wrapper').classList.remove('hidden');
    updateSummary(); updateBookButton();
}

function selectTimeSlot(time,btn){
    if(reservedSlots[selectedDate]?.includes(time)){
        alert("Este horário já está reservado. Por favor, escolha outro horário.");
        return;
    }
    selectedTime=time;
    document.querySelectorAll('.time-slot-button').forEach(b=>b.classList.remove('selected-item'));
    btn.classList.add('selected-item');
    updateSummary(); updateBookButton();
}

// --- RESUMO E BOTÃO ---
function updateSummary(){
    document.getElementById('summary-service').textContent=selectedService?selectedService.name:'---';
    document.getElementById('summary-price').textContent=selectedService?formatCurrency(selectedService.price):'---';
    if(selectedDate){ const parts=selectedDate.split('-'); document.getElementById('summary-date').textContent=`${parts[2]}/${parts[1]}`; }
    else document.getElementById('summary-date').textContent='---';
}

function updateBookButton(){
    const btn=document.getElementById('book-button');
    if(selectedService && selectedDate && selectedTime){
        btn.disabled=false;
        btn.textContent=`Agendar ${selectedService.name} - ${selectedTime}`;
        btn.classList.remove('bg-gray-300'); btn.classList.add('bg-primary-pink');
    } else {
        btn.disabled=true;
        btn.textContent='Preencha todos os passos';
        btn.classList.add('bg-gray-300'); btn.classList.remove('bg-primary-pink');
    }
}

// --- FINALIZAÇÃO ---
function finalizeBooking(){
    if(!selectedService || !selectedDate || !selectedTime) return;
    // Marca o horário como reservado
    if(!reservedSlots[selectedDate]) reservedSlots[selectedDate]=[];
    reservedSlots[selectedDate].push(selectedTime);

    const price=formatCurrency(selectedService.price);
    const parts=selectedDate.split('-'); const dateStr=`${parts[2]}/${parts[1]}/${parts[0]}`;
    const msg=`Olá, Maiane! Gostaria de agendar:\n- Serviço: ${selectedService.name}\n- Descrição: ${selectedService.description}\n- Preço: ${price}\n- Duração: ${selectedService.duration}\n- Data:
