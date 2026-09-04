/**
 * Aprenda Biometano — Motor Interativo e Gamificação (Estilo Duolingo)
 * 100% Client-side, pronto para GitHub Pages
 * Cores e Identidade: CP2B / PILAR-2b (NIPE - UNICAMP)
 */

// =============================================================================
// 1. SISTEMA DE GAMIFICAÇÃO & XP
// =============================================================================
let userXP = parseInt(localStorage.getItem('biometano_xp') || '0');
let userHearts = 5;
let userStreak = 1;
let poppedBubblesCount = 0;

function updateHUD() {
  const xpDisplay = document.getElementById('hud-xp');
  const heartsDisplay = document.getElementById('hud-hearts');
  const streakDisplay = document.getElementById('hud-streak');
  const progressBar = document.getElementById('main-progress-fill');

  if (xpDisplay) xpDisplay.textContent = `${userXP} XP`;
  if (heartsDisplay) heartsDisplay.textContent = `${userHearts}/5`;
  if (streakDisplay) streakDisplay.textContent = `${userStreak} dia`;

  // Barra de progresso baseada no XP acumulado (meta: 200 XP para 100%)
  if (progressBar) {
    const progressPercent = Math.min(100, Math.max(15, Math.round((userXP / 200) * 100)));
    progressBar.style.width = `${progressPercent}%`;
  }

  localStorage.setItem('biometano_xp', userXP.toString());
}

function addXP(amount, event = null) {
  userXP += amount;
  updateHUD();

  // Efeito flutuante de "+10 XP" na posição do clique
  if (event) {
    showFloatingXP(amount, event.clientX, event.clientY);
  }
}

function showFloatingXP(amount, x, y) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.textContent = `+${amount} XP! ⚡`;
  popup.style.left = `${x || window.innerWidth / 2}px`;
  popup.style.top = `${y || window.innerHeight / 2}px`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1200);
}

// =============================================================================
// 2. SINTETIZADOR DE ÁUDIO WEB (Procedural Web Audio API)
// =============================================================================
class DuoAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 300 + Math.random() * 200;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 350, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99]; // Dó, Mi, Sol
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const start = this.ctx.currentTime + i * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const start = this.ctx.currentTime + i * 0.09;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const duoAudio = new DuoAudioEngine();

// =============================================================================
// 3. MASCOTE BIOZINHO (Dicas & Humor)
// =============================================================================
const mascotQuotes = [
  "Sabia que um caminhão pesado a biometano faz menos barulho que um aspirador de pó?",
  "A cana-de-açúcar é nossa bateria solar líquida: o sol bate nas folhas e vira energia para o Estado todo!",
  "A vinhaça de Ribeirão Preto e Piracicaba já abastece caminhões sem precisar de 1 gota de petróleo!",
  "O biometano não tem cheiro ruim de lixo! No filtro, todo o enxofre é removido e ele fica puro.",
  "Comer feijão dá gás... mas o esterco da fazenda dá gás para iluminar cidades inteiras!",
  "Para cada litro de etanol feito na usina, sobram 12 litros de vinhaça cheia de energia limpa!"
];

let quoteIdx = 0;
function initMascot() {
  const trigger = document.getElementById('mascot-trigger');
  const quoteElem = document.getElementById('mascot-quote');

  if (trigger && quoteElem) {
    trigger.addEventListener('click', (e) => {
      quoteIdx = (quoteIdx + 1) % mascotQuotes.length;
      quoteElem.textContent = mascotQuotes[quoteIdx];
      duoAudio.playPop();
      addXP(5, e);

      // Animação de pulo no mascote
      trigger.style.transform = 'scale(1.2) rotate(8deg)';
      setTimeout(() => {
        trigger.style.transform = '';
      }, 250);
    });
  }
}

// =============================================================================
// 4. NAVEGAÇÃO DE ABAS
// =============================================================================
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-pill-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');

      duoAudio.playPop();
      window.location.hash = targetId;

      // Ganha 2 XP por explorar nova aba
      addXP(2);
    });
  });

  // Restaurar aba pela URL se existir
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetBtn = document.querySelector(`.tab-pill-btn[data-tab="${hash}"]`);
    if (targetBtn) targetBtn.click();
  }
}

// =============================================================================
// 5. MÓDULO 1: ARENA DE ESTOURAR BOLHAS (Bubble Popping)
// =============================================================================
function initBubbleArena() {
  const arena = document.getElementById('bubble-arena');
  const spawnBtn = document.getElementById('btn-spawn-bubbles');
  const countDisplay = document.getElementById('popped-count');

  function spawnBubbles(amount = 5) {
    if (!arena) return;

    for (let i = 0; i < amount; i++) {
      const bubble = document.createElement('div');
      const isCH4 = Math.random() > 0.35; // 65% Metano, 35% CO2
      bubble.className = isCH4 ? 'floating-bubble' : 'floating-bubble co2-bubble';
      bubble.textContent = isCH4 ? 'CH₄' : 'CO₂';

      // Posição horizontal aleatória
      const leftPos = 10 + Math.random() * 80;
      bubble.style.left = `${leftPos}%`;

      // Duração e delay aleatórios
      const duration = 3.5 + Math.random() * 2.5;
      const delay = Math.random() * 1.5;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;

      // Clique para estourar
      bubble.addEventListener('click', (e) => {
        poppedBubblesCount++;
        if (countDisplay) countDisplay.textContent = poppedBubblesCount;

        duoAudio.playPop();
        addXP(5, e);

        // Feedback de estouro
        bubble.style.transform = 'scale(1.5)';
        bubble.style.opacity = '0';
        setTimeout(() => bubble.remove(), 200);
      });

      arena.appendChild(bubble);

      // Remover automaticamente após o ciclo de animação
      setTimeout(() => {
        if (bubble.parentElement) bubble.remove();
      }, (duration + delay) * 1000);
    }
  }

  if (spawnBtn) {
    spawnBtn.addEventListener('click', (e) => {
      spawnBubbles(6);
      duoAudio.playDing();
      addXP(5, e);
    });
  }

  // Soltar bolhas iniciais
  spawnBubbles(6);
  setInterval(() => {
    if (document.getElementById('tab-intro')?.classList.contains('active')) {
      spawnBubbles(2);
    }
  }, 4000);
}

// =============================================================================
// 6. MÓDULO 2: POLOS DE SÃO PAULO (PILAR-2b)
// =============================================================================
const poleData = {
  cana: {
    icon: "🌾",
    title: "Corredor da Cana e Vinhaça",
    tagline: "Ribeirão Preto, Sertãozinho, Piracicaba e Araçatuba",
    desc: "Para cada 1 litro de etanol produzido, sobram <strong>12 litros de vinhaça líquida rica em nutrientes</strong>. Em vez de descartar, as usinas paulistas colocam a vinhaça em biodigestores gigantes para produzir biometano e abastecer caminhões da safra!",
    fact: "Estudo PILAR-2b: O potencial de biometano da cana em SP equivale a quase 40% de todo o diesel que os caminhões consomem no Estado!"
  },
  urbano: {
    icon: "🏙️",
    title: "Cinturão das Cidades & Sabesp",
    tagline: "Grande São Paulo, Campinas, Sorocaba e Vale do Paraíba",
    desc: "Milhões de pessoas descartam restos de alimentos todos os dias. Nos aterros sanitários modernos e nas Estações de Tratamento de Esgoto (ETEs da Sabesp), o lodo vira biometano de alta qualidade, pronto para entrar na tubulação da Comgás e alimentar indústrias e residências!",
    fact: "Um aterro sanitário de grande porte em SP pode produzir gás suficiente para mover milhares de veículos urbanos todo mês."
  },
  pecuaria: {
    icon: "🐄",
    title: "Interior Pecuário & Frigoríficos",
    tagline: "Presidente Prudente, Barretos, Andradina e Sorocabana",
    desc: "O confinamento de bovinos e granjas de suínos e aves geram grandes volumes de dejetos. No biodigestor, o cheiro forte desaparece em 20 dias e o produtor rural ganha energia elétrica grátis e biofertilizante de primeira linha.",
    fact: "Em granjas de suínos, o biogás gera 100% da eletricidade da fazenda e ainda sobra para vender na rede!"
  }
};

function initPolesModule() {
  const poleCards = document.querySelectorAll('.sp-pole-card');
  const titleElem = document.getElementById('pole-title');
  const taglineElem = document.getElementById('pole-tagline');
  const descElem = document.getElementById('pole-desc');
  const factElem = document.getElementById('pole-fact');
  const iconElem = document.getElementById('pole-icon');

  poleCards.forEach(card => {
    card.addEventListener('click', (e) => {
      poleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const poleKey = card.getAttribute('data-pole');
      const data = poleData[poleKey];
      if (data) {
        if (titleElem) titleElem.textContent = data.title;
        if (taglineElem) taglineElem.textContent = data.tagline;
        if (descElem) descElem.innerHTML = data.desc;
        if (factElem) factElem.textContent = data.fact;
        if (iconElem) iconElem.textContent = data.icon;
      }

      duoAudio.playDing();
      addXP(10, e);
    });
  });
}

// =============================================================================
// 7. MÓDULO 3: ALIMENTE AS BACTÉRIAS
// =============================================================================
function initFeedModule() {
  const feedBtn = document.getElementById('btn-feed-bacteria');
  const feedback = document.getElementById('feed-feedback');
  let feedCount = 0;

  const messages = [
    "😋 Hmmm! As bactérias adoraram as cascas e começaram a borbulhar!",
    "🫧 Aumentando a produção: +50 litros de biogás gerados!",
    "⚡ O digestor está a todo vapor! O biogás está enchendo o gasômetro!",
    "🎉 Parabéns! Você já gerou biogás suficiente para cozinhar um almoço inteiro!"
  ];

  if (feedBtn) {
    feedBtn.addEventListener('click', (e) => {
      feedCount++;
      const msg = messages[(feedCount - 1) % messages.length];
      if (feedback) feedback.textContent = msg;

      duoAudio.playDing();
      addXP(10, e);

      // Efeito de confetes no 4º clique
      if (feedCount % 4 === 0 && window.confetti) {
        window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        duoAudio.playFanfare();
      }
    });
  }
}

// =============================================================================
// 8. MÓDULO 4: FILTRO DESLIZANTE DE PURIFICAÇÃO
// =============================================================================
function initPurifySlider() {
  const range = document.getElementById('duo-purify-range');
  const flame = document.getElementById('duo-flame');
  const ch4Display = document.getElementById('duo-ch4-display');
  const statusText = document.getElementById('duo-status-text');

  if (range && flame && ch4Display && statusText) {
    range.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      ch4Display.textContent = `${val}% Metano`;

      if (val < 70) {
        flame.className = 'duo-flame flame-dirty';
        statusText.textContent = "Chama fraca e amarelada, cheia de gás carbônico. Ainda não pode ir para os motores!";
      } else if (val < 95) {
        flame.className = 'duo-flame';
        flame.style.background = 'linear-gradient(to top, #1d4ed8, #06b6d4)';
        statusText.textContent = "Biogás semi-puro! Já serve para caldeiras industriais, mas ainda precisa de um pouco mais de refino.";
      } else {
        flame.className = 'duo-flame flame-pure';
        statusText.textContent = "🏆 BIOMETANO PURO (Padrão ANP 886)! Chama azul limpa de altíssima temperatura. Pronto para os caminhões Scania e para o gasoduto Comgás!";

        if (val === 98 && window.confetti) {
          window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          duoAudio.playFanfare();
          addXP(25, e);
        }
      }

      if (val % 10 === 0) {
        duoAudio.playWhoosh();
      }
    });
  }
}

// =============================================================================
// 9. MÓDULO 5: SONS DO CAMINHÃO A GÁS
// =============================================================================
window.playTruckSound = function(part) {
  if (part === 'tank') {
    duoAudio.playWhoosh();
  } else if (part === 'engine') {
    duoAudio.playDing();
  } else if (part === 'exhaust') {
    duoAudio.playPop();
  }
  addXP(5);
};

// =============================================================================
// 10. MÓDULO 6: CALCULADORA CIDADÃ
// =============================================================================
function initCitizenCalculator() {
  const popSlider = document.getElementById('slider-pop');
  const vinasseSlider = document.getElementById('slider-vinasse');
  const cattleSlider = document.getElementById('slider-cattle');

  const popDisplay = document.getElementById('display-pop');
  const vinasseDisplay = document.getElementById('display-vinasse');
  const cattleDisplay = document.getElementById('display-cattle');

  const busesElem = document.getElementById('res-friendly-buses');
  const housesElem = document.getElementById('res-friendly-houses');
  const treesElem = document.getElementById('res-friendly-trees');

  function updateCalc() {
    const pop = parseInt(popSlider?.value || '50000');
    const vinasse = parseInt(vinasseSlider?.value || '50000');
    const cattle = parseInt(cattleSlider?.value || '2000');

    if (popDisplay) popDisplay.textContent = `${pop.toLocaleString('pt-BR')} habitantes`;
    if (vinasseDisplay) vinasseDisplay.textContent = `${vinasse.toLocaleString('pt-BR')} litros`;
    if (cattleDisplay) cattleDisplay.textContent = `${cattle.toLocaleString('pt-BR')} animais`;

    // Metano diário gerado:
    // Urbano: ~0.03 m³ biometano / habitante.dia (esgoto + resíduo)
    // Vinhaça: ~0.01 m³ biometano / litro vinhaça
    // Pecuária: ~0.5 m³ biometano / animal.dia
    const dailyBiomethaneM3 = (pop * 0.03) + (vinasse * 0.01) + (cattle * 0.5);

    // 1 ônibus consome ~100 m³ para rodar o dia todo
    const buses = Math.max(1, Math.round(dailyBiomethaneM3 / 100));

    // 1 casa gasta ~5 kWh/dia -> 1 m³ biometano gera ~3.5 kWh
    const houses = Math.max(50, Math.round((dailyBiomethaneM3 * 3.5) / 5));

    // Árvores equivalentes em CO2 fóssil evitado
    const trees = Math.round(buses * 250);

    if (busesElem) busesElem.textContent = buses.toLocaleString('pt-BR');
    if (housesElem) housesElem.textContent = houses.toLocaleString('pt-BR');
    if (treesElem) treesElem.textContent = trees.toLocaleString('pt-BR');
  }

  if (popSlider) popSlider.addEventListener('input', updateCalc);
  if (vinasseSlider) vinasseSlider.addEventListener('input', updateCalc);
  if (cattleSlider) cattleSlider.addEventListener('input', updateCalc);

  updateCalc();
}

// =============================================================================
// 11. MÓDULO 7: QUIZ DUOLINGO (Perguntas Rápidas)
// =============================================================================
const quizData = [
  {
    q: "Qual a diferença do Biometano para o gás fóssil que vem do petróleo?",
    options: [
      "O biometano é 100% renovável, feito do lixo e da cana, sem tirar petróleo da terra.",
      "O biometano é líquido e não pega fogo de jeito nenhum.",
      "O biometano só funciona em carros elétricos com bateria.",
      "Não tem diferença nenhuma, os dois vêm do fundo do mar."
    ],
    correct: 0,
    feedback: "Isso aí! O biometano reaproveita o carbono biológico da cana e dos resíduos, sem aumentar o aquecimento global!"
  },
  {
    q: "No Estado de São Paulo, qual é a maior fonte de energia limpa para fazer biometano?",
    options: [
      "A vinhaça da cana-de-açúcar produzida nas usinas de etanol.",
      "Casca de banana jogada no chão da praia.",
      "Água da chuva acumulada nos telhados.",
      "Óleo de fritura de pastel de feira apenas."
    ],
    correct: 0,
    feedback: "Exatamente! São Paulo tem mais de 160 usinas de cana que produzem bilhões de litros de vinhaça todo ano!"
  },
  {
    q: "O que acontece com a fumaça preta dos caminhões quando eles usam Biometano?",
    options: [
      "Fica roxa e cheira a morango.",
      "A fumaça preta (fuligem) é ELIMINADA! O escapamento fica limpo.",
      "A fumaça aumenta porque o motor fica mais forte.",
      "Sai água quente para lavar o para-brisa."
    ],
    correct: 1,
    feedback: "Perfeito! A queima do gás metano não solta fuligem de carbono, ajudando as pessoas a respirarem melhor."
  },
  {
    q: "O que é o 'Digestato', que sobra no fundo do reator de biogás?",
    options: [
      "Um lixo perigoso que polui o rio.",
      "Um adubo orgânico de ouro (biofertilizante) para colocar nas plantações.",
      "Um tipo de plástico para fazer garrafas.",
      "Pedras pretas que viram carvão."
    ],
    correct: 1,
    feedback: "Show de bola! O digestato é um super biofertilizante que substitui os adubos químicos importados caríssimos."
  },
  {
    q: "O que é o CP2B (Centro Paulista de Estudos em Biogás e Bioprodutos)?",
    options: [
      "Um clube de futebol do interior paulista.",
      "O maior centro científico de pesquisa em biogás do Brasil, sediado na UNICAMP.",
      "Uma fábrica de baterias de celular.",
      "Uma marca de caminhões alemã."
    ],
    correct: 1,
    feedback: "Mandou muito bem! O CP2B pesquisa e mapeia todo o potencial de São Paulo através da plataforma PILAR-2b!"
  }
];

let currentQuizIdx = 0;
let quizScore = 0;

function initQuiz() {
  renderQuiz();
}

function renderQuiz() {
  const stepNum = document.getElementById('quiz-step-num');
  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options-container');
  const feedbackBox = document.getElementById('quiz-feedback-box');

  if (!questionText || !optionsContainer) return;

  if (currentQuizIdx >= quizData.length) {
    // Tela Final de Troféu
    questionText.innerHTML = `
      <div style="text-align:center; padding: 1.5rem 0;">
        <div style="font-size:3.5rem; margin-bottom:0.75rem;">🏆</div>
        <h3 style="color:var(--cp2b-verde); font-size:1.8rem; font-weight:900;">Você Concluiu o Desafio!</h3>
        <p style="color:var(--text-muted); font-size:1.1rem; margin-top:0.5rem;">
          Você acertou <strong>${quizScore}</strong> de <strong>${quizData.length}</strong> perguntas e faturou um bônus de XP!
        </p>
      </div>
    `;
    optionsContainer.innerHTML = `
      <div style="text-align:center;">
        <button class="btn-duo btn-duo-lime" onclick="restartQuiz()">
          🔄 Jogar Novamente!
        </button>
      </div>
    `;
    if (feedbackBox) feedbackBox.style.display = 'none';

    duoAudio.playFanfare();
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
    return;
  }

  const q = quizData[currentQuizIdx];
  if (stepNum) stepNum.textContent = currentQuizIdx + 1;
  questionText.textContent = q.q;

  if (feedbackBox) feedbackBox.style.display = 'none';

  optionsContainer.innerHTML = q.options.map((opt, idx) => `
    <button class="quiz-option-duo" onclick="checkDuoAnswer(${idx}, event)">
      <span style="width:28px; height:28px; border-radius:50%; background:var(--bg-input); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem; flex-shrink:0;">
        ${String.fromCharCode(65 + idx)}
      </span>
      <span>${opt}</span>
    </button>
  `).join('');
}

window.checkDuoAnswer = function(chosenIdx, event) {
  const q = quizData[currentQuizIdx];
  const buttons = document.querySelectorAll('.quiz-option-duo');
  buttons.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById('quiz-feedback-box');

  if (chosenIdx === q.correct) {
    buttons[chosenIdx].classList.add('correct');
    duoAudio.playDing();
    addXP(20, event);
    quizScore++;

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = 'rgba(88, 204, 2, 0.15)';
      feedbackBox.style.border = '2px solid #58cc02';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; color:#1e6b00; font-size:1.15rem; margin-bottom:0.25rem;">✅ Sensacional! Resposta Certa!</div>
        <p style="color:var(--text-main); font-size:0.95rem; margin-bottom:1rem;">${q.feedback}</p>
        <button class="btn-duo btn-duo-green" onclick="nextQuizQuestion()">Continuar ➔</button>
      `;
    }
  } else {
    buttons[chosenIdx].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    duoAudio.playError();
    userHearts = Math.max(0, userHearts - 1);
    updateHUD();

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.style.background = 'rgba(255, 75, 75, 0.12)';
      feedbackBox.style.border = '2px solid #ff4b4b';
      feedbackBox.innerHTML = `
        <div style="font-weight:900; color:#b91c1c; font-size:1.15rem; margin-bottom:0.25rem;">Quase lá! Não foi dessa vez.</div>
        <p style="color:var(--text-main); font-size:0.95rem; margin-bottom:1rem;">${q.feedback}</p>
        <button class="btn-duo btn-duo-blue" onclick="nextQuizQuestion()">Continuar ➔</button>
      `;
    }
  }
};

window.nextQuizQuestion = function() {
  currentQuizIdx++;
  renderQuiz();
};

window.restartQuiz = function() {
  currentQuizIdx = 0;
  quizScore = 0;
  userHearts = 5;
  updateHUD();
  renderQuiz();
};

// =============================================================================
// 12. MÓDULO 8: DICIONÁRIO DESCOMPLICADO
// =============================================================================
const easyGlossary = [
  { term: "Biogás", def: "A mistura de gases que nasce naturalmente quando restos de comida, plantas ou esterco apodrecem sem a presença de oxigênio." },
  { term: "Biometano", def: "O biogás purificado e limpo! Tira-se a sujeira e a umidade e sobra um gás de altíssima energia, pronto para abastecer carros e caminhões." },
  { term: "Biodigestor", def: "O grande tanque hermético onde as bactérias comem a matéria orgânica e produzem o biogás com segurança." },
  { term: "Vinhaça", def: "O caldo escuro e rico que sobra depois de destilar a cana para fazer etanol. É o maior tesouro do interior de São Paulo para fazer energia." },
  { term: "Digestato", def: "O adubo líquido e sólido que sobra no final do biodigestor. Um fertilizante natural que substitui adubos químicos caros na roça." },
  { term: "Metano (CH₄)", def: "O gás principal que queima e produz calor e energia. Uma molécula simples com 1 carbono e 4 hidrogênios." },
  { term: "Upgrading", def: "A palavra em inglês para 'refino' ou 'limpeza'. É a tecnologia que transforma o biogás bruto em biometano 97% puro." },
  { term: "CP2B", def: "Centro Paulista de Estudos em Biogás e Bioprodutos, sediado na UNICAMP, que pesquisa e desenvolve soluções de energia limpa para São Paulo." },
  { term: "PILAR-2b", def: "A plataforma inteligente criada pelo CP2B que mapeia o potencial de biogás em todos os 645 municípios paulistas." },
  { term: "Gás Natural Fóssil", def: "O gás extraído do fundo da terra ou de poços de petróleo submarinos. Diferente do biometano, ele é fóssil e não renovável." }
];

function initGlossary() {
  const input = document.getElementById('easy-glossary-search');
  const listContainer = document.getElementById('easy-glossary-list');

  function render(terms) {
    if (!listContainer) return;
    if (terms.length === 0) {
      listContainer.innerHTML = `<p style="color:var(--text-dim); padding:1rem;">Nenhum termo encontrado com esse nome.</p>`;
      return;
    }

    listContainer.innerHTML = terms.map(item => `
      <div class="duo-card" style="padding:1.25rem;">
        <h4 style="font-size:1.15rem; font-weight:800; color:var(--cp2b-verde); margin-bottom:0.35rem;">${item.term}</h4>
        <p style="font-size:0.9rem; color:var(--text-muted);">${item.def}</p>
      </div>
    `).join('');
  }

  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      const filtered = easyGlossary.filter(item => 
        item.term.toLowerCase().includes(q) || item.def.toLowerCase().includes(q)
      );
      render(filtered);
    });
  }

  render(easyGlossary);
}

// =============================================================================
// 13. INICIALIZAÇÃO GERAL
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateHUD();

  // Controles de Som e Tema
  const soundBtn = document.getElementById('toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = duoAudio.toggleMute();
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) duoAudio.playDing();
    });
  }

  const themeBtn = document.getElementById('toggle-theme');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
      duoAudio.playPop();
    });
  }

  // Inicializar todos os submódulos
  initMascot();
  initTabs();
  initBubbleArena();
  initPolesModule();
  initFeedModule();
  initPurifySlider();
  initCitizenCalculator();
  initQuiz();
  initGlossary();
});
