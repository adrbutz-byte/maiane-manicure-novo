// --- CONFIGURAÇÃO DE SERVIÇOS E HORÁRIOS ---
const SERVICES = [
    { 
        id: 1, 
        name: "Pé", 
        duration: "1:30 min", 
        price: 30.00, 
        description: "Cuidado completo para os seus pés. Inclui imersão, cutilagem precisa, hidratação e esmaltação com a cor de sua preferência. Pés macios e bem cuidados!", 
        icon: "👣" 
    },
    { 
        id: 2, 
        name: "Mão", 
        duration: "1:30 min", 
        price: 30.00, 
        description: "Tratamento especializado para suas mãos. Cutilagem impecável, massagem relaxante e aplicação de esmalte de alta qualidade para um acabamento perfeito.", 
        icon: "💅" 
    },
    { 
        id: 3, 
        name: "Unha Postiça", 
        duration: "1:30 min", 
        price: 40.00, 
        description: "Alongamento com unhas postiças (tips ou soft gel), seguido de cutilagem e esmaltação. Unhas longas, resistentes e com o formato que você desejar!", 
        icon: "✨" 
    },
    { 
        id: 4, 
        name: "Combo Pé e Mão", 
        duration: "2:30 min", 
        price: 50.00, 
        description: "O pacote completo para sua beleza! Pés e mãos impecáveis em uma única sessão. Inclui cutilagem, hidratação e esmaltação profissional para ambos.", 
        icon: "👑" 
    },
    { 
        id: 5, 
        name: "Esmaltação", 
        duration: "1:30 min", 
        price: 15.00, 
        description: "Serviço rápido focado na aplicação do esmalte. Limpeza superficial e pintura caprichada (cores à escolha do cliente). Ideal para retoques!", 
        icon: "🌈" 
    },
];

// Horários fixos de atendimento agrupados por período
const TIME_SLOTS_ALL = [
    { time: "08:30", period: "morning" },
    { time: "10:00", period: "morning" },
    { time: "13:00", period: "afternoon" },
    { time: "14:30", period: "afternoon" },
    { time: "16:00", period: "afternoon" },
];

// Seu número de telefone (apenas números, incluindo o 55 e DDD)
const WHATSAPP_PHONE = "5573999624432";