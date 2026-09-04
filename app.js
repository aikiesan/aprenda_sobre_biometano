/**
 * BioGames SP — Lógica Mobile-First (Estilo NY Times Games)
 * CP2B (Centro Paulista de Estudos em Biogás e Bioprodutos - UNICAMP)
 * Jogos independentes, sem acúmulo de XP, foco em ensino científico e Calculadora Cidadã.
 */

// =============================================================================
// 1. ÁUDIO SUTIL (Web Audio API)
// =============================================================================
class MobileAudio {
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

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + i * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + i * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }
}

const audio = new MobileAudio();

// =============================================================================
// 2. NAVEGAÇÃO ENTRE TELAS E ABAS
// =============================================================================
function navigateTo(screenId) {
  const screens = document.querySelectorAll('.view-screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');

  // Atualizar botões da barra inferior
  const navBtns = document.querySelectorAll('.nav-tab-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active');
    if (
      (screenId === 'screen-hub' && btn.textContent.includes('Jogos')) ||
      (screenId === 'screen-calculator' && btn.textContent.includes('Calculadora')) ||
      (screenId === 'screen-about' && btn.textContent.includes('CP2B'))
    ) {
      btn.classList.add('active');
    }
  });

  audio.playTap();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openGame(gameId) {
  navigateTo(gameId);

  // Inicializações sob demanda
  if (gameId === 'screen-connections') initConnections();
  if (gameId === 'screen-wordle') initWordle();
  if (gameId === 'screen-myths') initMyths();
  if (gameId === 'screen-reactor') startReactorGame();
}

// =============================================================================
// 3. JOGO 1: CONEXÕES DA BIOMASSA (NYT Connections Style)
// =============================================================================
const connectionsCategories = [
  {
    id: "cana",
    title: "Resíduos da Cana em SP",
    class: "cat-yellow",
    explanation: "Subprodutos gerados nas usinas sucroalcooleiras paulistas com alto poder de geração de biometano.",
    items: ["VINHAÇA", "TORTA DE FILTRO", "BAGAÇO", "PALHA"]
  },
  {
    id: "gases",
    title: "Gases da Biodigestão",
    class: "cat-green",
    explanation: "Compostos químicos presentes na mistura gasosa bruta do biodigestor.",
    items: ["METANO (CH₄)", "GÁS CARBÔNICO", "GÁS SULFÍDRICO", "VAPOR D'ÁGUA"]
  },
  {
    id: "upgrading",
    title: "Tecnologias de Refino (Upgrading)",
    class: "cat-blue",
    explanation: "Processos industriais para purificar o biogás e transformá-lo em biometano >95% puro.",
    items: ["MEMBRANAS", "PSA (ADSORÇÃO)", "LAVAGEM COM ÁGUA", "AMINAS"]
  },
  {
    id: "destinos",
    title: "Destinos do Biometano",
    class: "cat-purple",
    explanation: "Aplicações práticas do biometano limpo substituindo combustíveis fósseis.",
    items: ["CAMINHÕES PESADOS", "GASODUTO COMGÁS", "CALDEIRAS", "TRATORES A GÁS"]
  }
];

let connCurrentTiles = [];
let connSelectedTiles = [];
let connMistakesRemaining = 4;
let connSolvedCategories = [];

function initConnections() {
  connSolvedCategories = [];
  connMistakesRemaining = 4;
  connSelectedTiles = [];

  // Planificar todos os 16 itens
  connCurrentTiles = [];
  connectionsCategories.forEach(cat => {
    cat.items.forEach(item => {
      connCurrentTiles.push({ text: item, catId: cat.id });
    });
  });

  shuffleArray(connCurrentTiles);
  renderConnectionsUI();
}

function renderConnectionsUI() {
  const grid = document.getElementById('conn-grid');
  const solvedContainer = document.getElementById('conn-solved-container');
  const modal = document.getElementById('conn-result-modal');

  if (modal) modal.style.display = 'none';

  // Renderizar categorias resolvidas
  if (solvedContainer) {
    solvedContainer.innerHTML = connSolvedCategories.map(cat => `
      <div class="solved-card ${cat.class}">
        <div>${cat.title}</div>
        <div class="solved-items">${cat.items.join(' • ')}</div>
      </div>
    `).join('');
  }

  // Renderizar bolinhas de erros
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`dot-1`);
    const dotEl = document.getElementById(`dot-${i}`);
    if (dotEl) {
      dotEl.className = i <= connMistakesRemaining ? 'dot' : 'dot lost';
    }
  }

  // Renderizar grade
  if (grid) {
    grid.innerHTML = '';
    connCurrentTiles.forEach(tile => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'conn-tile';
      if (connSelectedTiles.includes(tile.text)) tileDiv.classList.add('selected');
      tileDiv.textContent = tile.text;

      tileDiv.addEventListener('click', () => {
        toggleConnectionTile(tile.text);
      });

      grid.appendChild(tileDiv);
    });
  }
}

function toggleConnectionTile(text) {
  const index = connSelectedTiles.indexOf(text);
  if (index > -1) {
    connSelectedTiles.splice(index, 1);
    audio.playTap();
  } else {
    if (connSelectedTiles.length < 4) {
      connSelectedTiles.push(text);
      audio.playTap();
    }
  }
  renderConnectionsUI();
}

function deselectAllConnections() {
  connSelectedTiles = [];
  audio.playTap();
  renderConnectionsUI();
}

function shuffleConnections() {
  shuffleArray(connCurrentTiles);
  audio.playTap();
  renderConnectionsUI();
}

function submitConnections() {
  if (connSelectedTiles.length !== 4) {
    alert("Selecione 4 palavras para enviar!");
    return;
  }

  // Checar se as 4 pertencem à mesma categoria
  const firstItem = connCurrentTiles.find(t => t.text === connSelectedTiles[0]);
  const targetCatId = firstItem.catId;
  const allMatch = connSelectedTiles.every(t => {
    const found = connCurrentTiles.find(x => x.text === t);
    return found && found.catId === targetCatId;
  });

  if (allMatch) {
    // Categoria resolvida!
    const matchedCategory = connectionsCategories.find(c => c.id === targetCatId);
    connSolvedCategories.push(matchedCategory);

    // Remover itens da grade
    connCurrentTiles = connCurrentTiles.filter(t => t.catId !== targetCatId);
    connSelectedTiles = [];

    audio.playDing();

    if (connSolvedCategories.length === 4) {
      // Venceu o jogo!
      renderConnectionsUI();
      audio.playFanfare();
      if (window.confetti) window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const modal = document.getElementById('conn-result-modal');
      if (modal) modal.style.display = 'block';
      return;
    }
  } else {
    // Errou
    connMistakesRemaining--;
    audio.playError();

    // Checar se estava a 1 de distância (3 de 4 certos)
    const countsByCat = {};
    connSelectedTiles.forEach(t => {
      const tile = connCurrentTiles.find(x => x.text === t);
      if (tile) countsByCat[tile.catId] = (countsByCat[tile.catId] || 0) + 1;
    });
    const hasThree = Object.values(countsByCat).some(v => v === 3);
    if (hasThree) {
      alert("Por pouco! 3 de 4 estão corretos.");
    }

    if (connMistakesRemaining <= 0) {
      alert("Fim das tentativas! Mas não desanime, toque em 'Jogar Novamente' para tentar outra vez.");
      initConnections();
      return;
    }
  }

  renderConnectionsUI();
}

function restartConnections() {
  initConnections();
}

// =============================================================================
// 4. JOGO 2: TERMO DO BIOGÁS (Wordle / Termo Style)
// =============================================================================
const wordleSecret = "METANO";
const wordleMaxTries = 6;
let wordleGuesses = [];
let wordleCurrentGuess = "";
let wordleGameOver = false;

function initWordle() {
  wordleGuesses = [];
  wordleCurrentGuess = "";
  wordleGameOver = false;

  const modal = document.getElementById('wordle-result-modal');
  if (modal) modal.style.display = 'none';

  renderWordleBoard();
  renderWordleKeyboard();
}

function renderWordleBoard() {
  const board = document.getElementById('wordle-board');
  if (!board) return;

  board.innerHTML = '';
  for (let r = 0; r < wordleMaxTries; r++) {
    const row = document.createElement('div');
    row.className = 'wordle-row';

    const guess = wordleGuesses[r];
    const isCurrentRow = (r === wordleGuesses.length);

    for (let c = 0; c < 6; c++) {
      const cell = document.createElement('div');
      cell.className = 'wordle-cell';

      if (guess) {
        // Palpite já submetido
        const letter = guess[c];
        cell.textContent = letter;

        if (letter === wordleSecret[c]) {
          cell.classList.add('correct');
        } else if (wordleSecret.includes(letter)) {
          cell.classList.add('present');
        } else {
          cell.classList.add('absent');
        }
      } else if (isCurrentRow) {
        // Linha em digitação
        cell.textContent = wordleCurrentGuess[c] || '';
      }

      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

function renderWordleKeyboard() {
  const kbContainer = document.getElementById('keyboard-mobile');
  if (!kbContainer) return;

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
  ];

  kbContainer.innerHTML = rows.map(r => `
    <div class="keyboard-row">
      ${r.map(k => {
        let cls = 'key-btn';
        if (k === 'ENTER' || k === '⌫') cls += ' key-action';
        return `<button class="${cls}" onclick="handleWordleKey('${k}')">${k}</button>`;
      }).join('')}
    </div>
  `).join('');
}

window.handleWordleKey = function(key) {
  if (wordleGameOver) return;

  if (key === '⌫') {
    if (wordleCurrentGuess.length > 0) {
      wordleCurrentGuess = wordleCurrentGuess.slice(0, -1);
      audio.playTap();
      renderWordleBoard();
    }
  } else if (key === 'ENTER') {
    if (wordleCurrentGuess.length === 6) {
      submitWordleGuess();
    } else {
      alert("A palavra deve ter 6 letras!");
    }
  } else {
    if (wordleCurrentGuess.length < 6) {
      wordleCurrentGuess += key;
      audio.playTap();
      renderWordleBoard();
    }
  }
};

function submitWordleGuess() {
  wordleGuesses.push(wordleCurrentGuess);
  const isWin = (wordleCurrentGuess === wordleSecret);
  wordleCurrentGuess = "";

  renderWordleBoard();

  if (isWin) {
    wordleGameOver = true;
    audio.playFanfare();
    if (window.confetti) window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    const modal = document.getElementById('wordle-result-modal');
    if (modal) {
      document.getElementById('wordle-result-title').textContent = "Acertou em cheio! 🎯";
      document.getElementById('wordle-result-desc').innerHTML = `A palavra secreta era <strong>${wordleSecret}</strong>. A molécula CH₄ é o coração da transição energética!`;
      modal.style.display = 'block';
    }
  } else if (wordleGuesses.length >= wordleMaxTries) {
    wordleGameOver = true;
    audio.playError();
    const modal = document.getElementById('wordle-result-modal');
    if (modal) {
      document.getElementById('wordle-result-title').textContent = "Quase lá!";
      document.getElementById('wordle-result-desc').innerHTML = `A palavra secreta era <strong>${wordleSecret}</strong>. Tente novamente para dominar o vocabulário!`;
      modal.style.display = 'block';
    }
  } else {
    audio.playDing();
  }
}

function restartWordle() {
  initWordle();
}

// =============================================================================
// 5. JOGO 3: FATO OU MITO?
// =============================================================================
const mythsData = [
  {
    statement: "O biometano tem cheiro ruim de lixo no escapamento do caminhão.",
    isFact: false,
    explanation: "MITO! No processo de refino (upgrading), o enxofre (H₂S) que dá cheiro de ovo podre é 100% removido. O biometano queima limpinho, sem odor e sem fumaça preta!"
  },
  {
    statement: "A vinhaça de cana de São Paulo pode substituir quase 40% do diesel dos caminhões do Estado.",
    isFact: true,
    explanation: "FATO! Estudos oficiais do CP2B / PILAR-2b mostram que o potencial da cana paulista é gigantesco, equivalente a bilhões de litros de diesel fóssil por ano."
  },
  {
    statement: "O que sobra no fundo do reator (digestato) é um lixo tóxico que deve ser jogado fora.",
    isFact: false,
    explanation: "MITO! O digestato é um super biofertilizante orgânico de alto valor, rico em Nitrogênio, Fósforo e Potássio (NPK), que substitui adubos químicos na lavoura!"
  }
];

let mythIndex = 0;
let mythScore = 0;

function initMyths() {
  mythIndex = 0;
  mythScore = 0;
  const modal = document.getElementById('myth-result-modal');
  if (modal) modal.style.display = 'none';

  renderMythCard();
}

function renderMythCard() {
  if (mythIndex >= mythsData.length) {
    const modal = document.getElementById('myth-result-modal');
    const scoreElem = document.getElementById('myth-final-score');
    if (scoreElem) scoreElem.textContent = `Você acertou ${mythScore} de ${mythsData.length} afirmações científicas!`;
    if (modal) modal.style.display = 'block';
    audio.playFanfare();
    if (window.confetti) window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    return;
  }

  const data = mythsData[mythIndex];
  const stepElem = document.getElementById('myth-step-text');
  const stmtElem = document.getElementById('myth-statement-text');
  const feedElem = document.getElementById('myth-feedback-text');

  if (stepElem) stepElem.textContent = `Afirmação ${mythIndex + 1} de ${mythsData.length}`;
  if (stmtElem) stmtElem.textContent = `"${data.statement}"`;
  if (feedElem) feedElem.textContent = "Toque em FATO ou MITO para responder!";
}

window.answerMyth = function(userChoice) {
  if (mythIndex >= mythsData.length) return;
  const data = mythsData[mythIndex];
  const isCorrect = (userChoice === data.isFact);

  const feedElem = document.getElementById('myth-feedback-text');

  if (isCorrect) {
    mythScore++;
    audio.playDing();
    if (feedElem) feedElem.innerHTML = `<span style="color:var(--cp2b-verde); font-weight:800;">✅ Certa resposta!</span> ${data.explanation}`;
  } else {
    audio.playError();
    if (feedElem) feedElem.innerHTML = `<span style="color:#ef4444; font-weight:800;">❌ Incorreto!</span> ${data.explanation}`;
  }

  // Avançar após breve pausa para leitura
  setTimeout(() => {
    mythIndex++;
    renderMythCard();
  }, 3200);
};

function restartMyths() {
  initMyths();
}

// =============================================================================
// 6. JOGO 4: EQUILÍBRIO DO REATOR (Desafio 20s)
// =============================================================================
let reactorTimerInterval;
let reactorTime = 20;
let reactorSolved = false;

function startReactorGame() {
  clearInterval(reactorTimerInterval);
  reactorTime = 20;
  reactorSolved = false;

  const modal = document.getElementById('reactor-result-modal');
  if (modal) modal.style.display = 'none';

  const timerElem = document.getElementById('reactor-timer');
  if (timerElem) timerElem.textContent = `${reactorTime}s`;

  // Sliders
  const sTemp = document.getElementById('slider-reactor-temp');
  const sPH = document.getElementById('slider-reactor-ph');
  const sMix = document.getElementById('slider-reactor-mix');

  if (sTemp) sTemp.value = 24;
  if (sPH) sPH.value = 5.8;
  if (sMix) sMix.value = 30;

  updateReactorSliderLabels();

  reactorTimerInterval = setInterval(() => {
    reactorTime--;
    if (timerElem) timerElem.textContent = `${reactorTime}s`;

    checkReactorBalance();

    if (reactorTime <= 0 && !reactorSolved) {
      clearInterval(reactorTimerInterval);
      audio.playError();
      alert("O tempo esgotou! O reator esfriou antes da metanogênese. Tente novamente!");
      startReactorGame();
    }
  }, 1000);
}

function updateReactorSliderLabels() {
  const sTemp = document.getElementById('slider-reactor-temp');
  const sPH = document.getElementById('slider-reactor-ph');
  const sMix = document.getElementById('slider-reactor-mix');

  const vTemp = document.getElementById('val-reactor-temp');
  const vPH = document.getElementById('val-reactor-ph');
  const vMix = document.getElementById('val-reactor-mix');

  if (vTemp && sTemp) vTemp.textContent = `${sTemp.value}°C`;
  if (vPH && sPH) vPH.textContent = parseFloat(sPH.value).toFixed(1);
  if (vMix && sMix) vMix.textContent = `${sMix.value}%`;
}

function checkReactorBalance() {
  const sTemp = parseFloat(document.getElementById('slider-reactor-temp')?.value || 0);
  const sPH = parseFloat(document.getElementById('slider-reactor-ph')?.value || 0);
  const sMix = parseFloat(document.getElementById('slider-reactor-mix')?.value || 0);

  // Faixa ótima: Temp 35-39°C, pH 6.9-7.5, Agitação 60-80%
  const tempOk = (sTemp >= 35 && sTemp <= 39);
  const phOk = (sPH >= 6.9 && sPH <= 7.5);
  const mixOk = (sMix >= 60 && sMix <= 80);

  const statusBox = document.getElementById('reactor-status-box');

  if (tempOk && phOk && mixOk) {
    if (!reactorSolved) {
      reactorSolved = true;
      clearInterval(reactorTimerInterval);
      audio.playFanfare();
      if (window.confetti) window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const modal = document.getElementById('reactor-result-modal');
      if (modal) modal.style.display = 'block';
    }
  } else {
    if (statusBox) {
      if (!tempOk) statusBox.textContent = "Ajuste a temperatura para ~37°C (mesofílica)!";
      else if (!phOk) statusBox.textContent = "Equilibre o pH para ~7.2 para não azedar!";
      else if (!mixOk) statusBox.textContent = "Ajuste a agitação mecânica para ~70%!";
    }
  }
}

function restartReactorGame() {
  startReactorGame();
}

// =============================================================================
// 7. TELA 2: CALCULADORA CIDADÃ (O Destaque Amado!)
// =============================================================================
function initCalculatorScreen() {
  const sPop = document.getElementById('calc-slider-pop');
  const sVin = document.getElementById('calc-slider-vinasse');
  const sCat = document.getElementById('calc-slider-cattle');

  const vPop = document.getElementById('calc-val-pop');
  const vVin = document.getElementById('calc-val-vinasse');
  const vCat = document.getElementById('calc-val-cattle');

  const mBuses = document.getElementById('metric-buses');
  const mHouses = document.getElementById('metric-houses');
  const mTrees = document.getElementById('metric-trees');

  function updateCitizenMetrics() {
    const pop = parseInt(sPop?.value || '50000');
    const vin = parseInt(sVin?.value || '50000');
    const cat = parseInt(sCat?.value || '2000');

    if (vPop) vPop.textContent = `${pop.toLocaleString('pt-BR')} hab`;
    if (vVin) vVin.textContent = `${vin.toLocaleString('pt-BR')} L/dia`;
    if (vCat) vCat.textContent = `${cat.toLocaleString('pt-BR')} animais`;

    // Metano gerado por dia:
    // Cidadão urbano (esgoto + RSU): ~0.035 m³ biometano
    // Vinhaça de cana: ~0.012 m³ biometano / litro
    // Pecuária: ~0.55 m³ biometano / animal
    const dailyM3 = (pop * 0.035) + (vin * 0.012) + (cat * 0.55);

    // 1 ônibus urbano consome ~90 m³ para rodar a linha toda o dia
    const buses = Math.max(1, Math.round(dailyM3 / 90));

    // 1 casa gasta ~5 kWh/dia (1 m³ gera ~3.6 kWh elétricos)
    const houses = Math.max(50, Math.round((dailyM3 * 3.6) / 5));

    // Árvores equivalentes em fumaça fóssil evitada
    const trees = Math.round(buses * 280);

    if (mBuses) mBuses.textContent = buses.toLocaleString('pt-BR');
    if (mHouses) mHouses.textContent = houses.toLocaleString('pt-BR');
    if (mTrees) mTrees.textContent = trees.toLocaleString('pt-BR');
  }

  if (sPop) sPop.addEventListener('input', updateCitizenMetrics);
  if (sVin) sVin.addEventListener('input', updateCitizenMetrics);
  if (sCat) sCat.addEventListener('input', updateCitizenMetrics);

  updateCitizenMetrics();

  // Listeners para os sliders do reator também
  const rTemp = document.getElementById('slider-reactor-temp');
  const rPH = document.getElementById('slider-reactor-ph');
  const rMix = document.getElementById('slider-reactor-mix');

  if (rTemp) rTemp.addEventListener('input', () => { updateReactorSliderLabels(); checkReactorBalance(); });
  if (rPH) rPH.addEventListener('input', () => { updateReactorSliderLabels(); checkReactorBalance(); });
  if (rMix) rMix.addEventListener('input', () => { updateReactorSliderLabels(); checkReactorBalance(); });
}

// =============================================================================
// 8. INICIALIZAÇÃO GERAL
// =============================================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Controle de Som
  const soundBtn = document.getElementById('btn-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = audio.toggle();
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) audio.playDing();
    });
  }

  // Controle de Tema
  const themeBtn = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
      audio.playTap();
    });
  }

  initCalculatorScreen();
});
