//Toggle menu hamburger
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

//Roue des jeux
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");
const spinBtn = document.getElementById("spin");
const resetBtn = document.getElementById("reset");

const games = [
  "Age of Empires",
  "Sea of Thieves",
  "Abiotic Factor",
  "Wartales",
  "Grounded",
  "Rejoue"
];

const colors = ["#e70f0f", "#0080ff", "#ff4400", "#451d10", "#108600", "#76007d"];
let startAngle = 0;
let arc = (2 * Math.PI) / games.length;
let spinning = false;
let lastSelectedGame = null;

function resizeCanvas() {
  const size = Math.min(window.innerWidth, 500);
  canvas.width = size;
  canvas.height = size;
}

function drawWheel() {
  resizeCanvas();
  const center = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < games.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center, angle, angle + arc);
    ctx.lineTo(center, center);
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `${Math.floor(center / 10)}px sans-serif`;
    ctx.fillText(games[i], center - 20, 10);
    ctx.restore();
  }
}

function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#00ff33', '#007c30']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#00ff33', '#007c30']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function highlightResult(game) {
  resultDiv.textContent = game;
  resultDiv.style.fontSize = "2.5em";
  resultDiv.style.color = "#2d2d2d";
  resultDiv.style.transition = "all 0.5s ease";
}

function spinWheel() {
  if (spinning) return;
  spinning = true;
  let spinTime = 0;
  const spinDuration = 3000;
  const spinSpeed = Math.random() * 0.05 + 0.25;

  function rotate() {
    spinTime += 30;
    startAngle += spinSpeed;
    drawWheel();

    if (spinTime < spinDuration) {
      requestAnimationFrame(rotate);
    } else {
      let selectedIndex = Math.floor(((2 * Math.PI - (startAngle % (2 * Math.PI))) % (2 * Math.PI)) / arc);
      let selectedGame = games[selectedIndex];

      if (selectedGame === lastSelectedGame) {
        selectedIndex = (selectedIndex + 1) % games.length;
        selectedGame = games[selectedIndex];
      }

      lastSelectedGame = selectedGame;
      highlightResult(selectedGame);
      spinning = false;

      if (selectedGame === "Rejoue") {
        setTimeout(spinWheel, 1000);
      } else {
        launchConfetti();
        showGameInfo(selectedGame);
      }
    }
  }

  rotate();
}

function resetWheel() {
  startAngle = 0;
  spinning = false;
  resultDiv.textContent = "Cliquez sur “Tourner” pour commencer";
  resultDiv.style.fontSize = "1.5em";
  resultDiv.style.color = "white";
  drawWheel();
}

window.addEventListener("resize", drawWheel);
drawWheel();
spinBtn.addEventListener("click", spinWheel);
resetBtn.addEventListener("click", resetWheel);

// 👥 Équipes manuelles
const teamBtn = document.getElementById("team-spin");
const teamResetBtn = document.getElementById("team-reset");
const teamResultDiv = document.getElementById("team-result");
const playerInput = document.getElementById("player-input");

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}

function pickTeams() {
  const rawInput = playerInput.value.trim();
  const presentPlayers = rawInput
    .split(",")
    .map(name => name.trim())
    .filter(name => name.length > 0);

  if (presentPlayers.length < 4) {
    teamResultDiv.innerHTML = `<p style="color:red;">Il faut au moins 4 joueurs pour former deux équipes.</p>`;
    return;
  }

  const shuffled = shuffle([...presentPlayers]);
  const team1 = [shuffled[0], shuffled[1]];
  const team2 = [shuffled[2], shuffled[3]];

  teamResultDiv.innerHTML = `
    <h2>Équipes sélectionnées</h2>
    <div class="team"><strong>Équipe 1 :</strong> ${team1.join(" & ")}</div>
    <div class="team"><strong>Équipe 2 :</strong> ${team2.join(" & ")}</div>
  `;
}

function resetTeams() {
  playerInput.value = "";
  teamResultDiv.innerHTML = "";
}

teamBtn.addEventListener("click", pickTeams);
teamResetBtn.addEventListener("click", resetTeams);

// 💬 Pop-up infos jeu
const modal = document.getElementById("game-modal");
const modalText = document.getElementById("modal-text");
const closeModal = document.querySelector(".close");

const gameInfos = {
  "Age of Empires": {
    title: "Age of Empires",
    description: "Jeu de stratégie en temps réel où tu construis une civilisation, récoltes des ressources, développes des technologies et affrontes des ennemis à travers les âges.",
    tips: [
      "Crée des villageois en continu pour accélérer ta production.",
      "Construis des murailles tôt pour te protéger.",
      "Explore la carte rapidement pour repérer les ressources et les ennemis.",
      "Passe à l’âge suivant dès que possible pour débloquer des unités puissantes."
    ]
  },
  "Sea of Thieves": {
    title: "Sea of Thieves",
    description: "Jeu d’aventure multijoueur en monde ouvert où tu incarnes un pirate. Explore les îles, chasse des trésors, combats des squelettes et affronte d'autres équipages en mer.",
    tips: [
      "Utilise la carte et la boussole pour coordonner ton équipage.",
      "Cache ton butin dans des endroits inattendus.",
      "Prépare-toi à affronter le Kraken et le Megalodon.",
      "Joue de la musique pour détendre l’ambiance ou célébrer une victoire."
    ]
  },
  "Abiotic Factor": {
    title: "Abiotic Factor",
    description: "Jeu coopératif de survie dans un laboratoire souterrain infesté de créatures. Résous des énigmes, fabrique des outils et coopère pour survivre.",
    tips: [
      "Fabrique des outils dès le début pour améliorer ton efficacité.",
      "Analyse les objets pour débloquer des recettes utiles.",
      "Explore méthodiquement chaque zone pour maximiser les ressources.",
      "Coopère avec ton équipe pour éviter les pièges et les embuscades."
    ]
  },
  "Wartales": {
    title: "Wartales",
    description: "RPG tactique en monde ouvert où tu diriges une bande de mercenaires dans un univers médiéval. Explore, combats, recrute et prends des décisions morales.",
    tips: [
      "Gère bien ta nourriture et ton moral pour éviter les mutineries.",
      "Positionne tes unités intelligemment en combat.",
      "Accepte des contrats pour gagner de l’or et de l’expérience.",
      "Spécialise tes personnages pour créer une équipe équilibrée."
    ]
  },
  "Grounded": {
    title: "Grounded",
    description: "Jeu de survie coopératif où tu incarnes un enfant miniaturisé dans un jardin. Construis un abri, affronte des insectes géants et découvre les secrets du monde.",
    tips: [
      "Observe les fourmis : elles ne sont pas toujours hostiles.",
      "Construis ton camp en hauteur pour éviter les araignées.",
      "Fabrique une lampe pour explorer la nuit.",
      "Analyse les matériaux pour débloquer des recettes avancées."
    ]
  }
};

//Affiche la pop-up avec les infos du jeu + équipes si Age of Empires
function showGameInfo(game) {
  const info = gameInfos[game];
  if (!info) return;

  let teamHTML = "";
  if (game === "Age of Empires") {
    const rawInput = playerInput.value.trim();
    const presentPlayers = rawInput
      .split(",")
      .map(name => name.trim())
      .filter(name => name.length > 0);

    const count = presentPlayers.length;

    if (count >= 2 && count <= 8) {
      const shuffled = shuffle([...presentPlayers]);

      if (count % 2 === 0) {
        const half = count / 2;
        const team1 = shuffled.slice(0, half);
        const team2 = shuffled.slice(half);

        teamHTML = `
          <h4>Équipes pour Age of Empires</h4>
          <div class="team"><strong>Équipe 1 :</strong> ${team1.join(" & ")}</div>
          <div class="team"><strong>Équipe 2 :</strong> ${team2.join(" & ")}</div>
        `;
      } else {
        teamHTML = `
          <h4>👥 Équipe de joueurs :</h4>
          <div class="team"><strong>Joueurs :</strong> ${shuffled.join(" & ")}</div>
          <div class="team"><strong>Adversaire :</strong> Ordinateur</div>
        `;
      }
    } else {
      teamHTML = `<p style="color:red;">Il faut entre 2 et 8 joueurs pour former des équipes.</p>`;
    }
  }

  modalText.innerHTML = `
    <h3>${info.title}</h3>
    <p>${info.description}</p>
    <em>Trucs & Astuces :</em>
    <ul>${info.tips.map(tip => `<li>${tip}</li>`).join("")}</ul>
    ${teamHTML}
  `;
  modal.style.display = "block";
}

//Ferme la pop-up
closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

