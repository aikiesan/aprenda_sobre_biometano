# 🌱 Aprenda Biometano — O Guia Divertido da Energia Limpa

Uma plataforma educativa, moderna e interativa em Português (PT-BR) para ensinar o público geral sobre **Biogás e Biometano**, com foco especial na transição energética do **Estado de São Paulo e do Brasil**.

Construído com uma experiência gamificada e amigável inspirada no **Duolingo** (XP, ofensiva, sons e micro-missões) e visualmente alinhado ao **Design System do CP2B (Centro Paulista de Estudos em Biogás e Bioprodutos - NIPE/UNICAMP)** e à plataforma **PILAR-2b**.

---

## 🚀 Acesse Online (GitHub Pages)

🔗 **https://aikiesan.github.io/aprenda_sobre_biometano/**

---

## 🌟 O Que Você Vai Encontrar?

A plataforma é dividida em **8 módulos em abas interativas**, projetadas para serem consumidas em 1 a 2 minutos cada:

1. 💡 **O Que é Esse Tal de Biogás?**
   - Mini-jogo interativo: *Estoure as Bolhas de Biogás* para ganhar XP e descobrir a composição molecular (60% Metano, 40% CO₂).
   - Duelo de Cards: *Biometano Campeão Verde* vs. *Diesel Fóssil Poluente*.
2. 🚀 **O Super Poder de São Paulo (CP2B & PILAR-2b)**
   - Por que São Paulo é chamado de a "Arábia Saudita Verde"?
   - Mapa dos 3 Grandes Polos: **Corredor da Cana** (Ribeirão Preto / Piracicaba), **Cinturão das Cidades** (Sabesp / Aterros) e **Interior Pecuário**.
3. 🦠 **A Cozinha das Bactérias Invisíveis**
   - As 4 etapas da biodigestão explicadas sem complicação: *Picadinho (Hidrólise)*, *O Caldinho (Acidogênese)*, *O Vinagrete (Acetogênese)* e *A Fábrica de Gás (Metanogênese)*.
   - Botão tátil 3D: *Alimente as Bactérias* e veja o gás borbulhar!
4. 🧪 **O Filtro Mágico (Biogás ➔ Biometano)**
   - Alavanca interativa de refino (*upgrading*): arraste a pureza de 50% até 98% e veja a chama mudar de amarelo fuliginoso para o azul cristalino de alta temperatura aprovado pela ANP 886.
5. 🚛 **O Caminhão Verde na Rodovia**
   - Adeus fumaça preta na Rodovia Anhanguera! Inspecione os cilindros a 200 bar, o motor ciclo Otto silencioso e o tesouro do **Biofertilizante (Digestato NPK)**.
6. 🧮 **E na Sua Cidade? (Calculadora Cidadã)**
   - Ajuste os sliders com a população da sua cidade ou animais da fazenda e descubra quantos ônibus rodam a gás e quantas casas ganham luz.
7. 🎮 **Desafios Duolingo do Biometano**
   - Quiz interativo de 5 perguntas com feedback instantâneo, som de acerto "ding!", barra de corações ❤️ e comemoração com confetes!
8. 📚 **Dicionário Fácil & Quem Somos**
   - Glossário descomplicado para o dia a dia e apresentação institucional do **CP2B / PILAR-2b (UNICAMP)**.

---

## 🎨 Identidade Visual (CP2B Design System)

- **Azul Petróleo (`#1E3E4C`)**: Identidade institucional e tecnológica.
- **Verde Escuro (`#00573A`)** e **Verde CP2B (`#5CA032`)**: Sustentabilidade e bioprodutos.
- **Lima Vibrante (`#B6E03B`)**: Cor de acento de alta energia, usada nos botões e na barra de progresso.
- **Âmbar Energia (`#D37402`)**: A chama e o poder calorífico do gás.
- **Mascote Biozinho**: A simpática gotinha/chama de biometano que interage e compartilha dicas com o usuário.

---

## 🔊 Sintetizador de Áudio Procedural (Web Audio API)

Não utiliza arquivos de áudio externos pesados ou que possam expirar. Todos os efeitos sonoros (plops de bolhas, dings festivos, chiados de gás e fanfarras) são gerados em tempo real matematicamente no navegador via **Web Audio API**.

---

## 💻 Como Rodar Localmente

Basta clonar o repositório e abrir o `index.html` em qualquer navegador:

```bash
# Clone o repositório
git clone https://github.com/aikiesan/aprenda_sobre_biometano.git

# Acesse a pasta
cd aprenda_sobre_biometano

# Abra o index.html diretamente no seu navegador ou use um servidor local simples:
# Com Python 3:
python -m http.server 8000
```

Abra no navegador em `http://localhost:8000`.

---

## 🚀 Como Publicar no GitHub Pages

Para publicar este projeto no seu novo repositório `aprenda_sobre_biometano`:

```bash
# 1. Configurar o remote do novo repositório
git remote set-url origin https://github.com/aikiesan/aprenda_sobre_biometano.git

# 2. Adicionar e commitar todos os arquivos
git add .
git commit -m "feat: lancamento do Aprenda Biometano gamificado estilo Duolingo com CP2B Design System"

# 3. Enviar para a branch principal
git branch -M main
git push -u origin main
```

No GitHub:
1. Vá em **Settings** > **Pages**.
2. Em **Source**, selecione `Deploy from a branch` e escolha a branch `main` e pasta `/ (root)`.
3. Salve e em poucos segundos seu site estará no ar!

---

## 🔬 Referências Científicas e Institucionais

- **CP2B** — Centro Paulista de Estudos em Biogás e Bioprodutos (NIPE/UNICAMP - FAPESP).
- **PILAR-2b** — Plataforma Inteligente de Localização e Aproveitamento de Resíduos para Biogás e Bioprodutos.
- **ANP nº 886/2022** — Especificação do Biometano para uso veicular e residencial.
- **CIBiogás & ABiogás** — Associação Brasileira do Biogás.

---

Feito com 💚 pela transição energética sustentável de São Paulo e do Brasil!
