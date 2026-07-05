/* ==========================================================
   PANTALLA DE ENTRADA + MÚSICA DE FONDO
========================================================== */
const introGate = document.getElementById("introGate");
const openGiftBtn = document.getElementById("openGiftBtn");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

openGiftBtn.addEventListener("click", () => {
  introGate.classList.add("is-hidden");
  bgMusic.volume = 0.5;
  bgMusic.play().catch(() => {
    /* si el navegador bloquea el autoplay, el botón de música lo activa manualmente */
  });
  musicToggle.classList.add("is-playing");
});

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.classList.add("is-playing");
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("is-playing");
  }
});

/* ==========================================================
   CORAZONES FLOTANDO DE FONDO (ambiente continuo)
========================================================== */
const ambientContainer = document.getElementById("ambientHearts");
const ambientEmojis = ["💛", "🤍", "✨"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function spawnAmbientHeart() {
  if (reduceMotion) return;
  const h = document.createElement("span");
  h.className = "ambient-heart";
  h.textContent = ambientEmojis[Math.floor(Math.random() * ambientEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 10 + Math.random() * 14 + "px";
  h.style.animationDuration = 9 + Math.random() * 8 + "s";
  ambientContainer.appendChild(h);
  setTimeout(() => h.remove(), 18000);
}
setInterval(spawnAmbientHeart, 1800);

/* ==========================================================
   VALES DE AMOR (flip cards)
========================================================== */
document.querySelectorAll(".coupon").forEach((coupon) => {
  coupon.addEventListener("click", () => coupon.classList.toggle("is-flipped"));
  coupon.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") coupon.classList.toggle("is-flipped");
  });
});

/* ==========================================================
   MENSAJE SECRETO (easter egg: triple clic en el logo)
========================================================== */
const secretLogo = document.getElementById("secretLogo");
const secretOverlay = document.getElementById("secretOverlay");
const closeSecret = document.getElementById("closeSecret");
let logoClicks = 0;
let logoClickTimer = null;

secretLogo.addEventListener("click", () => {
  logoClicks++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => (logoClicks = 0), 800);
  if (logoClicks >= 3) {
    secretOverlay.classList.add("show");
    logoClicks = 0;
  }
});
closeSecret.addEventListener("click", () => secretOverlay.classList.remove("show"));

/* ==========================================================
   QUIZ
   PERSONALIZA AQUÍ: cambia las preguntas, opciones y la
   respuesta correcta (índice, empezando en 0) si quieres
   algo más personal o con bromas internas de ustedes.
========================================================== */
const questions = [
  {
    q: "¿Cuánto te quiero?",
    opts: ["Un poco", "Bastante", "Hasta el infinito y más"],
    correct: 2,
    wrong: "Mmm, no. Intenta de nuevo 😏",
  },
  {
    q: "¿Quién es la persona más especial en mi vida?",
    opts: ["Mi jefe", "Antonella", "Nadie en particular"],
    correct: 1,
    wrong: "Esa definitivamente no es la respuesta.",
  },
  {
    q: "¿Aceptas ver tu regalo final?",
    opts: ["Sí", "¡Obvio que sí!"],
    correct: 0,
    wrong: "",
  },
];

let qIndex = 0;

function renderQuestion() {
  const area = document.getElementById("quiz-area");
  if (qIndex >= questions.length) {
    finishQuiz();
    return;
  }
  const item = questions[qIndex];
  area.innerHTML = `
    <p class="q-question">${item.q}</p>
    <div class="q-options">
      ${item.opts
        .map((o, i) => `<button class="q-opt" data-i="${i}">${o}</button>`)
        .join("")}
    </div>
    <p class="q-feedback" id="feedback"></p>
  `;
  area.querySelectorAll(".q-opt").forEach((btn) => {
    btn.addEventListener("click", () => answer(Number(btn.dataset.i)));
  });
}

function answer(i) {
  const item = questions[qIndex];
  const fb = document.getElementById("feedback");
  if (i === item.correct) {
    fb.className = "q-feedback ok";
    fb.textContent = "✓ correcto";
    setTimeout(() => {
      qIndex++;
      renderQuestion();
    }, 500);
  } else {
    fb.className = "q-feedback no";
    fb.textContent = item.wrong;
  }
}

function finishQuiz() {
  document.getElementById("quiz-area").innerHTML = "";
  const result = document.getElementById("quiz-result");
  result.innerHTML = `<p>✓ Pasaste el reto sin problema.</p><p>Como era de esperar 💛</p>`;
  document.getElementById("unlockBtn").classList.remove("btn-hidden");
}

document.getElementById("unlockBtn").addEventListener("click", () => {
  document.getElementById("carta").scrollIntoView({ behavior: "smooth" });
});

renderQuestion();

/* ==========================================================
   CARTA — efecto de máquina de escribir
   PERSONALIZA AQUÍ: edita el texto y agrega tu nombre
   en la firma al final.
========================================================== */
const cartaLineas = [
  "Antonella,",
  "",
  "hoy el calendario marca una fecha especial: el día en que",
  "el mundo tuvo la mejor idea de su historia.",
  "",
  "Como ingeniero, me gusta pensar que todo en la vida tiene",
  "una lógica, un porqué, una explicación. Pero contigo nada",
  "de eso aplica: no hay algoritmo que explique por qué te quiero",
  "tanto, ni fórmula que calcule cuánto me haces sonreír.",
  "",
  "Eres la excepción que rompe todas mis reglas, el error más",
  "hermoso que le pasó a mi vida (y este sí, jamás quiero",
  "corregirlo).",
  "",
  "Gracias por cada risa, cada abrazo, cada día a tu lado.",
  "Gracias por hacerme mejor persona sin siquiera intentarlo.",
  "",
  "Que este nuevo año te traiga tantas cosas bonitas como las",
  "que tú le traes a mi vida.",
  "",
  "Feliz cumpleaños, mi amor.",
  "Te quiero hoy, mañana, y en cada versión de nosotros que viene.",
  "",
  "— Manuel",
];

let cartaStarted = false;

function startCarta() {
  if (cartaStarted) return;
  cartaStarted = true;

  const container = document.getElementById("letter");
  let li = 0;

  function typeLine() {
    if (li >= cartaLineas.length) {
      document.getElementById("surpriseBtn").classList.remove("btn-hidden");
      return;
    }
    const p = document.createElement("p");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    container.appendChild(p);
    p.appendChild(cursor);

    const text = cartaLineas[li];
    if (text === "") {
      li++;
      setTimeout(typeLine, 150);
      return;
    }
    let ci = 0;
    const interval = setInterval(() => {
      p.insertBefore(document.createTextNode(text[ci]), cursor);
      ci++;
      if (ci >= text.length) {
        clearInterval(interval);
        cursor.remove();
        li++;
        setTimeout(typeLine, 90);
      }
    }, 22);
  }
  typeLine();
}

/* Start the letter animation once it scrolls into view */
const cartaSection = document.getElementById("carta");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) startCarta();
    });
  },
  { threshold: 0.3 }
);
observer.observe(cartaSection);

/* ==========================================================
   SORPRESA FINAL — corazones + mensaje
========================================================== */
document.getElementById("surpriseBtn").addEventListener("click", () => {
  document.getElementById("overlay").classList.add("show");
  spawnHearts();
});

document.getElementById("closeOverlay").addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("show");
});

function spawnHearts() {
  const emojis = ["💛", "💕", "✨", "🎉", "💫"];
  const overlay = document.getElementById("overlay");
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + "vw";
      h.style.fontSize = 14 + Math.random() * 18 + "px";
      h.style.animationDuration = 3.5 + Math.random() * 3 + "s";
      overlay.appendChild(h);
      setTimeout(() => h.remove(), 7000);
    }, i * 90);
  }
}
