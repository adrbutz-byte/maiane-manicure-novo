// Serviços disponíveis
const services = [
  { name: "Pé", price: "R$ 30,00", description: "Cutilagem e esmaltação", duration: "40 min" },
  { name: "Mão", price: "R$ 25,00", description: "Cutilagem e esmaltação", duration: "30 min" },
  { name: "Pé + Mão", price: "R$ 50,00", description: "Combo completo", duration: "1h10" }
];

// Elementos DOM
const servicesList = document.getElementById("services-list");
const serviceDetails = document.getElementById("service-details");
const detailName = document.getElementById("detail-name");
const detailDescription = document.getElementById("detail-description");
const detailPrice = document.getElementById("detail-price");
const detailDuration = document.getElementById("detail-duration");
const confirmServiceButton = document.getElementById("confirm-service-button");

const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-3");

const dateSelectionContainer = document.getElementById("date-selection-container");
const dateWarning = document.getElementById("date-warning");

const periodSelection = document.getElementById("period-selection");
const timeSlotsWrapper = document.getElementById("time-slots-wrapper");
const timeSlots = document.getElementById("time-slots");
const selectedPeriodText = document.getElementById("selected-period-text");

const summaryService = document.getElementById("summary-service");
const summaryDate = document.getElementById("summary-date");
const summaryPeriod = document.getElementById("summary-period");
const summaryTime = document.getElementById("summary-time");
const summaryPrice = document.getElementById("summary-price");
const bookButton = document.getElementById("book-button");

// Variáveis de estado
let selectedService = null;
let selectedDate = null;
let selectedPeriod = null;
let selectedTime = null;

// Renderizar serviços
services.forEach((s, index) => {
  const div = document.createElement("div");
  div.className = "box-item";
  div.textContent = `${s.name} - ${s.price}`;
  div.onclick = () => showServiceDetails(index);
  servicesList.appendChild(div);
});

// Mostrar detalhes
function showServiceDetails(i) {
  const s = services[i];
  selectedService = s;

  detailName.textContent = s.name;
  detailDescription.textContent = s.description;
  detailPrice.textContent = s.price;
  detailDuration.textContent = s.duration;

  serviceDetails.classList.remove("hidden");
}

// Confirmar serviço
confirmServiceButton.addEventListener("click", () => {
  if (!selectedService) return;
  summaryService.textContent = selectedService.name;
  summaryPrice.textContent = selectedService.price;

  step2.classList.remove("hidden-step");
  renderDates();
});

// Renderizar datas (próximos 7 dias)
function renderDates() {
  dateSelectionContainer.innerHTML = "";
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const btn = document.createElement("button");
    btn.className = "box-item min-w-[90px]";
    btn.textContent = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });

    btn.onclick = () => {
      selectedDate = d.toLocaleDateString("pt-BR");
      summaryDate.textContent = selectedDate;
      step3.classList.remove("hidden-step");
      periodSelection.classList.remove("hidden");
    };

    dateSelectionContainer.appendChild(btn);
  }
}

// Seleção de período
document.querySelectorAll(".period-button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedPeriod = btn.dataset.period;
    summaryPeriod.textContent = selectedPeriod === "morning" ? "Manhã" : "Tarde";
    selectedPeriodText.textContent = summaryPeriod.textContent;

    renderTimeSlots(selectedPeriod);
    timeSlotsWrapper.classList.remove("hidden");
  });
});

// Renderizar horários
function renderTimeSlots(period) {
  timeSlots.innerHTML = "";

  const hours = period === "morning"
    ? ["08:00","09:00","10:00","11:00"]
    : ["13:00","14:00","15:00","16:00"];

  hours.forEach(h => {
    const btn = document.createElement("button");
    btn.className = "box-item";
    btn.textContent = h;

    btn.onclick = () => {
      selectedTime = h;
      summaryTime.textContent = h;
      bookButton.disabled = false;
      bookButton.classList.remove("bg-gray-300");
      bookButton.classList.add("bg-dark-pink","hover:bg-primary-pink");
      bookButton.textContent = "Confirmar Agendamento";
    };

    timeSlots.appendChild(btn);
  });
}

// Enviar para WhatsApp
bookButton.addEventListener("click", () => {
  if (!selectedService || !selectedDate || !selectedPeriod || !selectedTime) return;

  const msg = `Olá, quero agendar:\n\n💅 Serviço: ${selectedService.name}\n📅 Data: ${selectedDate}\n⏰ Horário: ${selectedTime}\n💲 Valor: ${selectedService.price}`;
  const url = `https://wa.me/5571999999999?text=${encodeURIComponent(msg)}`; // coloque seu número aqui
  window.open(url, "_blank");
});
