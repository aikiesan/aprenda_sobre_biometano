/**
 * BioGames SP — Motor Nativo Mobile (Estilo NY Times Games)
 * CP2B / NIPE-UNICAMP
 * Experiência limpa, sem travamentos, sem excessos e 100% responsiva.
 */

// =============================================================================
// 1. ÁUDIO SUTIL
// =============================================================================
class NYTAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }

  tap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(380, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
    g.gain.setValueAtTime(0.08, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  ding() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const st = this.ctx.currentTime + i * 0.06;
      osc.frequency.setValueAtTime(f, st);
      g.gain.setValueAtTime(0.1, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.18);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + 0.18);
    });
  }

  fanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const st = this.ctx.currentTime + i * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);
      g.gain.setValueAtTime(0.12, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + 0.3);
    });
  }

  error() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.08, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const sfx = new NYTAudio();

// =============================================================================
// 2. NAVEGAÇÃO ENTRE TELAS
// =============================================================================
function showScreen(screenId) {
  const screens = document.querySelectorAll('.view-screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');

  sfx.tap();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openGame(gameId) {
  showScreen(gameId);
  if (gameId === 'screen-connections') initConnections();
  if (gameId === 'screen-wordle') initWordle();
  if (gameId === 'screen-myths') initMyths();
}

// =============================================================================
// 3. JOGO 1: CONEXÕES DA BIOMASSA (NYT Connections)
// =============================================================================
const connCategories = [
  {
    id: "cana",
    title: "Resíduos da Cana em SP",
    class: "yellow",
    items: ["VINHAÇA", "TORTA DE FILTRO", "BAGAÇO", "PALHA"]
  },
  {
    id: "gases",
    title: "Gases da Biodigestão",
    class: "green",
    items: ["METANO (CH₄)", "GÁS CARBÔNICO", "GÁS SULFÍDRICO", "VAPOR D'ÁGUA"]
  },
  {
    id: "upgrading",
    title: "Tecnologias de Refino",
    class: "blue",
    items: ["MEMBRANAS", "PSA (ADSORÇÃO)", "LAVAGEM DE GÁS", "AMINAS"]
  },
  {
    id: "destinos",
    title: "Destinos do Biometano",
    class: "purple",
    items: ["CAMINHÕES SCANIA", "GASODUTO COMGÁS", "CALDEIRAS", "TRATORES A GÁS"]
  }
];

let connTiles = [];
let connSelected = [];
let connMistakes = 4;
let connSolved = [];

function initConnections() {
  connSolved = [];
  connMistakes = 4;
  connSelected = [];

  connTiles = [];
  connCategories.forEach(cat => {
    cat.items.forEach(item => {
      connTiles.push({ text: item, catId: cat.id });
    });
  });

  shuffle(connTiles);
  renderConnections();
}

function renderConnections() {
  const grid = document.getElementById('conn-board');
  const solved = document.getElementById('conn-solved-container');
  const submitBtn = document.getElementById('btn-submit-conn');
  const modal = document.getElementById('conn-result-modal');
  const mistakesSpan = document.getElementById('conn-mistakes-display');

  if (modal) modal.style.display = 'none';

  if (submitBtn) {
    submitBtn.textContent = `Enviar (${connSelected.length}/4)`;
  }

  if (mistakesSpan) {
    mistakesSpan.textContent = '• '.repeat(connMistakes).trim() || 'Nenhuma';
  }

  // Grupos resolvidos
  if (solved) {
    solved.innerHTML = connSolved.map(cat => `
      <div class="conn-solved-box ${cat.class}">
        <div>${cat.title}</div>
        <div class="conn-solved-items">${cat.items.join(' • ')}</div>
      </div>
    `).join('');
  }

  // Grade 4x4
  if (grid) {
    grid.innerHTML = '';
    connTiles.forEach(tile => {
      const btn = document.createElement('button');
      btn.className = 'conn-tile-btn';
      if (connSelected.includes(tile.text)) btn.classList.add('selected');
      btn.textContent = tile.text;

      btn.addEventListener('click', () => {
        toggleConnTile(tile.text);
      });

      grid.appendChild(btn);
    });
  }
}

function toggleConnTile(text) {
  const idx = connSelected.indexOf(text);
  if (idx > -1) {
    connSelected.splice(idx, 1);
    sfx.tap();
  } else {
    if (connSelected.length < 4) {
      connSelected.push(text);
      sfx.tap();
    }
  }
  renderConnections();
}

function deselectAllConnections() {
  connSelected = [];
  sfx.tap();
  renderConnections();
}

function shuffleConnections() {
  shuffle(connTiles);
  sfx.tap();
  renderConnections();
}

function submitConnections() {
  if (connSelected.length !== 4) {
    alert("Selecione 4 palavras para enviar!");
    return;
  }

  const first = connTiles.find(t => t.text === connSelected[0]);
  const catId = first.catId;
  const match = connSelected.every(t => {
    const item = connTiles.find(x => x.text === t);
    return item && item.catId === catId;
  });

  if (match) {
    const solvedCat = connCategories.find(c => c.id === catId);
    connSolved.push(solvedCat);
    connTiles = connTiles.filter(t => t.catId !== catId);
    connSelected = [];
    sfx.ding();

    if (connSolved.length === 4) {
      renderConnections();
      sfx.fanfare();
      if (window.confetti) window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const modal = document.getElementById('conn-result-modal');
      if (modal) modal.style.display = 'block';
      return;
    }
  } else {
    connMistakes--;
    sfx.error();

    // Checar se faltava apenas 1
    const counts = {};
    connSelected.forEach(t => {
      const tile = connTiles.find(x => x.text === t);
      if (tile) counts[tile.catId] = (counts[tile.catId] || 0) + 1;
    });
    if (Object.values(counts).some(v => v === 3)) {
      alert("Quase! 3 de 4 estão certos.");
    }

    if (connMistakes <= 0) {
      alert("Tentativas esgotadas! Tente novamente.");
      initConnections();
      return;
    }
  }

  renderConnections();
}

function restartConnections() {
  initConnections();
}

// =============================================================================
// 4. JOGO 2: TERMO DO BIOGÁS (Wordle)
// =============================================================================
const wordleTarget = "METANO";
const wordleTries = 6;
let guesses = [];
let currentGuess = "";
let wordleDone = false;

function initWordle() {
  guesses = [];
  currentGuess = "";
  wordleDone = false;

  const modal = document.getElementById('wordle-result-modal');
  if (modal) modal.style.display = 'none';

  renderWordle();
  renderKeyboard();
}

function renderWordle() {
  const grid = document.getElementById('wordle-grid');
  if (!grid) return;

  grid.innerHTML = '';
  for (let r = 0; r < wordleTries; r++) {
    const row = document.createElement('div');
    row.className = 'wordle-grid-row';
    const guess = guesses[r];
    const isCurrent = (r === guesses.length);

    for (let c = 0; c < 6; c++) {
      const box = document.createElement('div');
      box.className = 'wordle-box';

      if (guess) {
        const letter = guess[c];
        box.textContent = letter;
        if (letter === wordleTarget[c]) {
          box.classList.add('correct');
        } else if (wordleTarget.includes(letter)) {
          box.classList.add('present');
        } else {
          box.classList.add('absent');
        }
      } else if (isCurrent) {
        box.textContent = currentGuess[c] || '';
      }

      row.appendChild(box);
    }
    grid.appendChild(row);
  }
}

function renderKeyboard() {
  const container = document.getElementById('wordle-keyboard');
  if (!container) return;

  const layout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
  ];

  container.innerHTML = layout.map(row => `
    <div class="kb-row">
      ${row.map(k => {
        let cls = 'kb-key';
        if (k === 'ENTER' || k === '⌫') cls += ' wide';
        return `<button class="${cls}" onclick="pressKey('${k}')">${k}</button>`;
      }).join('')}
    </div>
  `).join('');
}

window.pressKey = function(k) {
  if (wordleDone) return;

  if (k === '⌫') {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      sfx.tap();
      renderWordle();
    }
  } else if (k === 'ENTER') {
    if (currentGuess.length === 6) {
      submitWordle();
    } else {
      alert("A palavra precisa ter 6 letras!");
    }
  } else {
    if (currentGuess.length < 6) {
      currentGuess += k;
      sfx.tap();
      renderWordle();
    }
  }
};

function submitWordle() {
  guesses.push(currentGuess);
  const win = (currentGuess === wordleTarget);
  currentGuess = "";

  renderWordle();

  if (win) {
    wordleDone = true;
    sfx.fanfare();
    if (window.confetti) window.confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    const modal = document.getElementById('wordle-result-modal');
    if (modal) {
      document.getElementById('wordle-result-title').textContent = "Você Acertou! 🎯";
      document.getElementById('wordle-result-desc').innerHTML = `A palavra era <strong>${wordleTarget}</strong> — a molécula CH₄ da energia limpa!`;
      modal.style.display = 'block';
    }
  } else if (guesses.length >= wordleTries) {
    wordleDone = true;
    sfx.error();
    const modal = document.getElementById('wordle-result-modal');
    if (modal) {
      document.getElementById('wordle-result-title').textContent = "Fim de Jogo!";
      document.getElementById('wordle-result-desc').innerHTML = `A palavra era <strong>${wordleTarget}</strong>.`;
      modal.style.display = 'block';
    }
  } else {
    sfx.ding();
  }
}

function restartWordle() {
  initWordle();
}

// =============================================================================
// 5. JOGO 3: VERDADE OU MENTIRA (Fato ou Mito)
// =============================================================================
const myths = [
  {
    text: "O biometano tem cheiro ruim de lixo no escapamento do caminhão.",
    isFact: false,
    reason: "MENTIRA! No refino, 100% do enxofre é retirado. Ele queima sem cheiro e sem fumaça preta!"
  },
  {
    text: "A vinhaça de cana em São Paulo pode substituir quase 40% do diesel dos caminhões do Estado.",
    isFact: true,
    reason: "VERDADE! A pesquisa científica do CP2B / PILAR-2b comprova o enorme potencial da cana paulista."
  },
  {
    text: "O digestato que sobra no fundo do reator é um lixo tóxico que deve ser enterrado.",
    isFact: false,
    reason: "MENTIRA! O digestato é um super adubo orgânico com NPK para nutrir as lavouras sem químicos caros."
  }
];

let mythIdx = 0;
let mythScore = 0;

function initMyths() {
  mythIdx = 0;
  mythScore = 0;
  const modal = document.getElementById('myth-result-modal');
  if (modal) modal.style.display = 'none';
  renderMyth();
}

function renderMyth() {
  if (mythIdx >= myths.length) {
    const modal = document.getElementById('myth-result-modal');
    const summ = document.getElementById('myth-score-summary');
    if (summ) summ.textContent = `Você acertou ${mythScore} de ${myths.length} afirmativas!`;
    if (modal) modal.style.display = 'block';
    sfx.fanfare();
    if (window.confetti) window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    return;
  }

  const m = myths[mythIdx];
  const countEl = document.getElementById('myth-counter-text');
  const textEl = document.getElementById('myth-text-content');
  const statusEl = document.getElementById('myth-status-msg');

  if (countEl) countEl.textContent = `Pergunta ${mythIdx + 1} de ${myths.length}`;
  if (textEl) textEl.textContent = `"${m.text}"`;
  if (statusEl) statusEl.textContent = "Toque para responder:";
}

window.answerMyth = function(choice) {
  if (mythIdx >= myths.length) return;
  const m = myths[mythIdx];
  const statusEl = document.getElementById('myth-status-msg');

  if (choice === m.isFact) {
    mythScore++;
    sfx.ding();
    if (statusEl) statusEl.innerHTML = `<span style="color:#16a34a; font-weight:900;">✅ Certo!</span> ${m.reason}`;
  } else {
    sfx.error();
    if (statusEl) statusEl.innerHTML = `<span style="color:#dc2626; font-weight:900;">❌ Incorreto!</span> ${m.reason}`;
  }

  setTimeout(() => {
    mythIdx++;
    renderMyth();
  }, 2800);
};

function restartMyths() {
  initMyths();
}

// =============================================================================
// 6. CALCULADORA CIDADÃ (Favorita!)
// =============================================================================
function initCalculator() {
  const sPop = document.getElementById('calc-slider-pop');
  const sVin = document.getElementById('calc-slider-vinasse');
  const sCat = document.getElementById('calc-slider-cattle');

  if (sPop) sPop.addEventListener('input', updateCalcResults);
  if (sVin) sVin.addEventListener('input', updateCalcResults);
  if (sCat) sCat.addEventListener('input', updateCalcResults);

  updateCalcResults();
}

window.stepCalculator = function(type, delta) {
  let slider;
  if (type === 'pop') slider = document.getElementById('calc-slider-pop');
  if (type === 'vinasse') slider = document.getElementById('calc-slider-vinasse');
  if (type === 'cattle') slider = document.getElementById('calc-slider-cattle');

  if (slider) {
    slider.value = parseInt(slider.value) + delta;
    updateCalcResults();
    sfx.tap();
  }
};

function updateCalcResults() {
  const sPop = document.getElementById('calc-slider-pop');
  const sVin = document.getElementById('calc-slider-vinasse');
  const sCat = document.getElementById('calc-slider-cattle');

  const vPop = document.getElementById('calc-val-pop');
  const vVin = document.getElementById('calc-val-vinasse');
  const vCat = document.getElementById('calc-val-cattle');

  const mBuses = document.getElementById('metric-buses');
  const mHouses = document.getElementById('metric-houses');
  const mTrees = document.getElementById('metric-trees');

  const pop = parseInt(sPop?.value || '50000');
  const vin = parseInt(sVin?.value || '50000');
  const cat = parseInt(sCat?.value || '2000');

  if (vPop) vPop.textContent = pop.toLocaleString('pt-BR');
  if (vVin) vVin.textContent = `${vin.toLocaleString('pt-BR')} L/dia`;
  if (vCat) vCat.textContent = cat.toLocaleString('pt-BR');

  // Metano diário gerado
  const dailyM3 = (pop * 0.035) + (vin * 0.012) + (cat * 0.55);
  const buses = Math.max(1, Math.round(dailyM3 / 90));
  const houses = Math.max(50, Math.round((dailyM3 * 3.6) / 5));
  const trees = Math.round(buses * 280);

  if (mBuses) mBuses.textContent = buses.toLocaleString('pt-BR');
  if (mHouses) mHouses.textContent = houses.toLocaleString('pt-BR');
  if (mTrees) mTrees.textContent = trees.toLocaleString('pt-BR');
}

// =============================================================================
// 7. UTILITÁRIOS & INICIALIZAÇÃO
// =============================================================================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const soundBtn = document.getElementById('btn-sound');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = sfx.toggle();
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) sfx.ding();
    });
  }

  const themeBtn = document.getElementById('btn-theme');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
      sfx.tap();
    });
  }

  initCalculator();
});
