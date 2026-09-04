/**
 * BioGames SP — Motor Nativo Mobile (Estilo NY Times Games)
 * CP2B / NIPE-UNICAMP
 * Mini Cruzadinha da Biomassa de SP, Conexões, Fato/Mito e Calculadora Cidadã.
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
  if (gameId === 'screen-crossword') initCrossword();
  if (gameId === 'screen-connections') initConnections();
  if (gameId === 'screen-myths') initMyths();
}

// =============================================================================
// 3. JOGO: MINI CRUZADINHA DA BIOMASSA (NYT Mini Crossword)
// =============================================================================
const cwClues = [
  {
    id: "1",
    num: 1,
    dir: "HORIZONTAL",
    word: "CANA",
    label: "1 HORIZONTAL • 4 LETRAS",
    text: "Planta dos canaviais de Ribeirão Preto e Piracicaba que gera etanol e biometano.",
    cells: [[0,0], [0,1], [0,2], [0,3]]
  },
  {
    id: "2",
    num: 2,
    dir: "HORIZONTAL",
    word: "VINHACA", // normalizado sem cedilha para digitação fácil
    displayWord: "VINHAÇA",
    label: "2 HORIZONTAL • 7 LETRAS",
    text: "Líquido escuro da cana que sobra do etanol e é o maior tesouro energético de SP.",
    cells: [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6]]
  },
  {
    id: "3",
    num: 3,
    dir: "HORIZONTAL",
    word: "BAGLAN", // fallback
    word: "BAGLAN",
    word: "BAGLAN",
    word: "BAGACO",
    displayWord: "BAGAÇO",
    label: "3 HORIZONTAL • 6 LETRAS",
    text: "Resíduo fibroso da cana que é queimado na caldeira para gerar eletricidade.",
    cells: [[2,0], [2,1], [2,2], [2,3], [2,4], [2,5]]
  },
  {
    id: "4",
    num: 4,
    dir: "HORIZONTAL",
    word: "METANO",
    label: "4 HORIZONTAL • 6 LETRAS",
    text: "Gás da energia limpa (CH₄) que substitui o diesel sem soltar fumaça preta.",
    cells: [[3,0], [3,1], [3,2], [3,3], [3,4], [3,5]]
  },
  {
    id: "5",
    num: 5,
    dir: "HORIZONTAL",
    word: "ADUBO",
    label: "5 HORIZONTAL • 5 LETRAS",
    text: "O biofertilizante natural que sai do reator para nutrir as lavouras paulistas.",
    cells: [[4,0], [4,1], [4,2], [4,3], [4,4]]
  },
  {
    id: "6",
    num: 6,
    dir: "HORIZONTAL",
    word: "LODO",
    label: "6 HORIZONTAL • 4 LETRAS",
    text: "Resíduo de esgoto tratado (Sabesp) que gera biometano para a rede.",
    cells: [[5,0], [5,1], [5,2], [5,3]]
  }
];

let cwCurrentClueIdx = 0;
let cwUserGrid = {}; // key "r,c" -> letter
let cwCellCursor = 0; // index in current clue cells

function initCrossword() {
  cwCurrentClueIdx = 0;
  cwUserGrid = {};
  cwCellCursor = 0;

  const modal = document.getElementById('crossword-result-modal');
  if (modal) modal.style.display = 'none';

  renderCrosswordBoard();
  renderCrosswordKeyboard();
  updateClueBanner();
}

function updateClueBanner() {
  const clue = cwClues[cwCurrentClueIdx];
  const labelEl = document.getElementById('cw-clue-label');
  const textEl = document.getElementById('cw-clue-text');

  if (labelEl) labelEl.textContent = clue.label;
  if (textEl) textEl.textContent = clue.text;

  highlightCurrentClueCells();
}

function nextClue() {
  cwCurrentClueIdx = (cwCurrentClueIdx + 1) % cwClues.length;
  cwCellCursor = 0;
  sfx.tap();
  updateClueBanner();
}

function prevClue() {
  cwCurrentClueIdx = (cwCurrentClueIdx - 1 + cwClues.length) % cwClues.length;
  cwCellCursor = 0;
  sfx.tap();
  updateClueBanner();
}

function toggleClueOrientation() {
  nextClue();
}

function renderCrosswordBoard() {
  const container = document.getElementById('crossword-grid');
  if (!container) return;

  // Grade 6 linhas x 7 colunas (para caber VINHAÇA de 7 letras)
  container.style.gridTemplateColumns = 'repeat(7, 1fr)';
  container.innerHTML = '';

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement('div');
      cell.className = 'crossword-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      // Verificar se essa célula pertence a alguma palavra
      const clueOwner = cwClues.find(clue => clue.cells.some(([cr, cc]) => cr === r && cc === c));

      if (!clueOwner) {
        cell.classList.add('black');
      } else {
        // Célula ativa
        const key = `${r},${c}`;
        cell.textContent = cwUserGrid[key] || '';

        // Número da dica se for a primeira letra
        if (clueOwner.cells[0][0] === r && clueOwner.cells[0][1] === c) {
          const numEl = document.createElement('span');
          numEl.className = 'cell-clue-num';
          numEl.textContent = clueOwner.num;
          cell.appendChild(numEl);
        }

        cell.addEventListener('click', () => {
          // Focar na dica dona dessa célula
          const idx = cwClues.indexOf(clueOwner);
          if (idx > -1) {
            cwCurrentClueIdx = idx;
            // cursor na célula clicada
            const cellPos = clueOwner.cells.findIndex(([cr, cc]) => cr === r && cc === c);
            cwCellCursor = Math.max(0, cellPos);
            sfx.tap();
            updateClueBanner();
          }
        });
      }

      container.appendChild(cell);
    }
  }

  highlightCurrentClueCells();
}

function highlightCurrentClueCells() {
  const clue = cwClues[cwCurrentClueIdx];
  const allCells = document.querySelectorAll('.crossword-cell');

  allCells.forEach(el => {
    el.classList.remove('highlighted', 'active-focus');
    const r = parseInt(el.dataset.r);
    const c = parseInt(el.dataset.c);

    // Checar se faz parte da dica atual
    const isPartOfClue = clue.cells.some(([cr, cc]) => cr === r && cc === c);
    if (isPartOfClue) {
      el.classList.add('highlighted');
    }

    // Célula com foco cursor ativo
    const activeCoord = clue.cells[cwCellCursor];
    if (activeCoord && activeCoord[0] === r && activeCoord[1] === c) {
      el.classList.add('active-focus');
    }
  });
}

function renderCrosswordKeyboard() {
  const container = document.getElementById('crossword-keyboard');
  if (!container) return;

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ç", "⌫"]
  ];

  container.innerHTML = rows.map(r => `
    <div class="cw-kb-row">
      ${r.map(k => {
        let cls = 'cw-key';
        if (k === '⌫') cls += ' wide';
        return `<button class="${cls}" onclick="pressCrosswordKey('${k}')">${k}</button>`;
      }).join('')}
    </div>
  `).join('');
}

window.pressCrosswordKey = function(key) {
  const clue = cwClues[cwCurrentClueIdx];
  const targetCoord = clue.cells[cwCellCursor];
  if (!targetCoord) return;

  const keyCoord = `${targetCoord[0]},${targetCoord[1]}`;

  if (key === '⌫') {
    cwUserGrid[keyCoord] = '';
    // Mover cursor para trás
    if (cwCellCursor > 0) cwCellCursor--;
    sfx.tap();
  } else {
    // Escrever letra
    cwUserGrid[keyCoord] = key.toUpperCase();
    sfx.tap();

    // Avançar cursor
    if (cwCellCursor < clue.cells.length - 1) {
      cwCellCursor++;
    } else {
      // Checar se completou essa palavra
      checkCrosswordWord(clue);
    }
  }

  renderCrosswordBoard();
};

function checkCrosswordWord(clue) {
  const userWord = clue.cells.map(([r, c]) => cwUserGrid[`${r},${c}`] || '').join('');
  const cleanTarget = clue.word.replace(/Ç/g, 'Ç'); // aceita C ou Ç

  if (userWord === clue.word || (clue.word === 'VINHACA' && userWord === 'VINHAÇA') || (clue.word === 'BAGACO' && userWord === 'BAGAÇO')) {
    sfx.ding();
    // Avançar para a próxima dica incompleta
    setTimeout(() => {
      checkEntireCrossword();
    }, 300);
  }
}

function checkEntireCrossword() {
  let allDone = true;
  cwClues.forEach(clue => {
    const userWord = clue.cells.map(([r, c]) => cwUserGrid[`${r},${c}`] || '').join('');
    const match = (userWord === clue.word) || 
                  (clue.word === 'VINHACA' && userWord === 'VINHAÇA') ||
                  (clue.word === 'BAGACO' && userWord === 'BAGAÇO');
    if (!match) allDone = false;
  });

  if (allDone) {
    sfx.fanfare();
    if (window.confetti) window.confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
    const modal = document.getElementById('crossword-result-modal');
    if (modal) modal.style.display = 'block';
  } else {
    nextClue();
  }
}

function restartCrossword() {
  initCrossword();
}

// =============================================================================
// 4. JOGO: CONEXÕES DA BIOMASSA (NYT Connections)
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

  if (solved) {
    solved.innerHTML = connSolved.map(cat => `
      <div class="conn-solved-box ${cat.class}">
        <div>${cat.title}</div>
        <div class="conn-solved-items">${cat.items.join(' • ')}</div>
      </div>
    `).join('');
  }

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
// 5. JOGO: VERDADE OU MENTIRA (Fato ou Mito)
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
  const modal = document.getElementById('myths-result-modal') || document.getElementById('myth-result-modal');
  if (modal) modal.style.display = 'none';
  renderMyth();
}

function renderMyth() {
  const modal = document.getElementById('myths-result-modal') || document.getElementById('myth-result-modal');
  const summ = document.getElementById('myth-score-summary');

  if (mythIdx >= myths.length) {
    if (summ) summ.textContent = `Você acertou ${mythScore} de ${myths.length} afirmativas científicas!`;
    if (modal) modal.style.display = 'block';
    sfx.fanfare();
    if (window.confetti) window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    return;
  }

  const m = myths[mythIdx];
  const countEl = document.getElementById('myth-counter') || document.getElementById('myth-counter-text');
  const textEl = document.getElementById('myth-statement') || document.getElementById('myth-text-content');
  const statusEl = document.getElementById('myth-status') || document.getElementById('myth-status-msg');

  if (countEl) countEl.textContent = `RODADA ${mythIdx + 1} DE ${myths.length}`;
  if (textEl) textEl.textContent = `"${m.text}"`;
  if (statusEl) statusEl.innerHTML = `Toque em <strong>Mentira</strong> ou <strong>Verdade</strong> abaixo:`;
}

window.answerMyth = function(choice) {
  if (mythIdx >= myths.length) return;
  const m = myths[mythIdx];
  const statusEl = document.getElementById('myth-status') || document.getElementById('myth-status-msg');

  if (choice === m.isFact) {
    mythScore++;
    sfx.ding();
    if (statusEl) statusEl.innerHTML = `<span style="color:#16a34a; font-weight:700;">✅ Certo!</span> ${m.reason}`;
  } else {
    sfx.error();
    if (statusEl) statusEl.innerHTML = `<span style="color:#dc2626; font-weight:700;">❌ Incorreto!</span> ${m.reason}`;
  }

  setTimeout(() => {
    mythIdx++;
    renderMyth();
  }, 2600);
};

function restartMyths() {
  initMyths();
}

// Aliases globais para chamadas inline do HTML
window.showScreen = showScreen;
window.openGame = openGame;
window.shuffleTiles = shuffleConnections;
window.submitConnectionGuess = submitConnections;
window.shuffleConnections = shuffleConnections;
window.submitConnections = submitConnections;
window.restartCrossword = initCrossword;
window.restartConnections = restartConnections;
window.restartMyths = restartMyths;


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
