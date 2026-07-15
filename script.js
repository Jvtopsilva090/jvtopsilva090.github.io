"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeButton = document.getElementById("themeButton");
  const currentYear = document.getElementById("currentYear");
  const revealElements = document.querySelectorAll(".reveal");

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    body.classList.add("light-theme");
  }

  updateThemeButton();

  themeButton?.addEventListener("click", () => {
    body.classList.toggle("light-theme");

    const activeTheme = body.classList.contains("light-theme")
      ? "light"
      : "dark";

    localStorage.setItem("portfolio-theme", activeTheme);
    updateThemeButton();
  });

  function updateThemeButton() {
    if (!themeButton) return;

    const lightThemeActive = body.classList.contains("light-theme");

    themeButton.textContent = lightThemeActive ? "🌙" : "☀️";
    themeButton.setAttribute(
      "aria-label",
      lightThemeActive ? "Ativar tema escuro" : "Ativar tema claro"
    );
    themeButton.title = lightThemeActive
      ? "Ativar tema escuro"
      : "Ativar tema claro";
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  initializeMusicPlayer();
  initializeAiAssistant();
});

/* ======================================================
   ASSISTENTE VIRTUAL DO PORTFÓLIO

   Esta versão funciona sem API externa.
   Ela responde perguntas sobre o João usando informações
   salvas diretamente no JavaScript.
====================================================== */

function initializeAiAssistant() {
  const assistantButton = document.getElementById("aiFloatingButton");
  const assistantPanel = document.getElementById("aiChatPanel");
  const closeButton = document.getElementById("aiCloseButton");
  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");
  const suggestionButtons = document.querySelectorAll(
    ".ai-suggestions button"
  );

  if (!assistantButton || !assistantPanel || !chatForm || !chatInput) {
    return;
  }

  assistantButton.addEventListener("click", () => {
    const panelVisible = assistantPanel.classList.contains("is-visible");

    if (panelVisible) {
      closeAiAssistant();
    } else {
      openAiAssistant();
    }
  });

  closeButton?.addEventListener("click", closeAiAssistant);

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) {
      return;
    }

    processAiQuestion(question);
    chatInput.value = "";
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;

      if (question) {
        processAiQuestion(question);
      }
    });
  });
}

function openAiAssistant() {
  const assistantButton = document.getElementById("aiFloatingButton");
  const assistantPanel = document.getElementById("aiChatPanel");
  const notificationDot = document.querySelector(".ai-notification-dot");
  const chatInput = document.getElementById("aiChatInput");

  assistantPanel?.classList.add("is-visible");
  assistantPanel?.setAttribute("aria-hidden", "false");

  assistantButton?.classList.add("is-open");
  assistantButton?.setAttribute("aria-expanded", "true");

  if (notificationDot) {
    notificationDot.style.display = "none";
  }

  window.setTimeout(() => {
    chatInput?.focus();
  }, 250);
}

function closeAiAssistant() {
  const assistantButton = document.getElementById("aiFloatingButton");
  const assistantPanel = document.getElementById("aiChatPanel");

  assistantPanel?.classList.remove("is-visible");
  assistantPanel?.setAttribute("aria-hidden", "true");

  assistantButton?.classList.remove("is-open");
  assistantButton?.setAttribute("aria-expanded", "false");
}

function processAiQuestion(question) {
  addAiMessage(question, "user");
  showAiTypingIndicator();

  window.setTimeout(() => {
    removeAiTypingIndicator();

    const response = generatePortfolioResponse(question);

    addAiMessage(response, "assistant");
  }, 650);
}

function addAiMessage(text, sender) {
  const messagesContainer = document.getElementById("aiMessages");

  if (!messagesContainer) {
    return;
  }

  const message = document.createElement("div");
  message.className = `ai-message ai-message-${sender}`;

  if (sender === "assistant") {
    const avatar = document.createElement("span");
    avatar.className = "ai-message-avatar";
    avatar.textContent = "JV";

    message.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "ai-message-content";
  content.textContent = text;

  message.appendChild(content);
  messagesContainer.appendChild(message);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showAiTypingIndicator() {
  const messagesContainer = document.getElementById("aiMessages");

  if (!messagesContainer) {
    return;
  }

  const message = document.createElement("div");
  message.className = "ai-message ai-message-assistant";
  message.id = "aiTypingMessage";

  message.innerHTML = `
    <span class="ai-message-avatar">JV</span>

    <div class="ai-message-content">
      <span class="ai-typing" aria-label="Digitando">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
  `;

  messagesContainer.appendChild(message);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeAiTypingIndicator() {
  document.getElementById("aiTypingMessage")?.remove();
}

/* ======================================================
   BASE DE RESPOSTAS DO ASSISTENTE

   Para adicionar novos assuntos, crie outra condição.
====================================================== */

function generatePortfolioResponse(question) {
  const normalizedQuestion = normalizeAiText(question);

  if (
    includesAiTerm(normalizedQuestion, [
      "tecnologia",
      "tecnologias",
      "linguagem",
      "linguagens",
      "stack",
      "java",
      "flutter",
      "dart"
    ])
  ) {
    return (
      "João trabalha principalmente com Java, Spring Boot, JavaFX, " +
      "Flutter, Dart, PostgreSQL, SQLite, Firebase, Supabase, Git, " +
      "GitHub, Linux, Windows, Bash e APIs REST."
    );
  }

  if (
    includesAiTerm(normalizedQuestion, [
      "projeto",
      "projetos",
      "calculadora",
      "crud",
      "sistema"
    ])
  ) {
    return (
      "Entre os projetos do João estão a Calculadora CPL em Java, " +
      "um CRUD desenvolvido com Dart e Flutter, sistemas de gestão, " +
      "aplicações mobile e ferramentas de automação. Você pode acessar " +
      "os repositórios pela seção Projetos deste portfólio."
    );
  }

  if (
    includesAiTerm(normalizedQuestion, [
      "contato",
      "email",
      "e-mail",
      "linkedin",
      "instagram",
      "falar",
      "contratar"
    ])
  ) {
    return (
      "Você pode falar com o João pelo e-mail " +
      "jvtopdasilvinha0901@gmail.com ou pelo LinkedIn disponível " +
      "na seção de contato do portfólio."
    );
  }

  if (
    includesAiTerm(normalizedQuestion, [
      "formacao",
      "faculdade",
      "curso",
      "puc",
      "estuda"
    ])
  ) {
    return (
      "João estuda Análise e Desenvolvimento de Sistemas na PUC Goiás " +
      "e concentra seus estudos em backend, desenvolvimento mobile, " +
      "bancos de dados e automação."
    );
  }

  if (
    includesAiTerm(normalizedQuestion, [
      "objetivo",
      "objetivos",
      "oportunidade",
      "trabalho",
      "vaga"
    ])
  ) {
    return (
      "O objetivo do João é construir aplicações modernas e úteis, " +
      "participar de projetos relevantes e conquistar oportunidades " +
      "profissionais em desenvolvimento backend e mobile."
    );
  }

  if (
    includesAiTerm(normalizedQuestion, [
      "ola",
      "oi",
      "bom dia",
      "boa tarde",
      "boa noite"
    ])
  ) {
    return (
      "Olá! 😄 Posso te apresentar as tecnologias, projetos, formação " +
      "e formas de contato do João Vitor."
    );
  }

  return (
    "Ainda estou aprendendo a responder essa pergunta. Você pode perguntar " +
    "sobre as tecnologias, projetos, formação, objetivos ou contato do João."
  );
}

function normalizeAiText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesAiTerm(text, terms) {
  return terms.some((term) => text.includes(normalizeAiText(term)));
}


/* ======================================================
   PLAYER DE MÚSICA — YOUTUBE
====================================================== */

const YOUTUBE_VIDEO_ID = "9vWNauaZAgg";
const DEFAULT_MUSIC_VOLUME = 25;

let youtubeMusicPlayer = null;
let musicPlayerReady = false;
let musicStarted = false;
let musicPlaying = false;
let pendingPlayRequest = false;

function initializeMusicPlayer() {
  const musicToggle = document.getElementById("musicToggle");
  const musicPanel = document.getElementById("musicPanel");
  const musicClose = document.getElementById("musicClose");
  const musicPlayPause = document.getElementById("musicPlayPause");
  const musicVolume = document.getElementById("musicVolume");

  if (!musicToggle || !musicPanel) return;

  musicToggle.addEventListener("click", toggleMusic);

  musicPlayPause?.addEventListener("click", () => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  });

  musicClose?.addEventListener("click", closeMusicPanel);

  musicVolume?.addEventListener("input", (event) => {
    const volume = Number(event.target.value);

    if (youtubeMusicPlayer && musicPlayerReady) {
      youtubeMusicPlayer.setVolume(volume);
    }

    localStorage.setItem("portfolio-music-volume", String(volume));
  });

  loadYouTubeApi();
  updateMusicInterface();
}

function loadYouTubeApi() {
  if (window.YT?.Player) {
    createYouTubePlayer();
    return;
  }

  if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    return;
  }

  const youtubeScript = document.createElement("script");
  youtubeScript.src = "https://www.youtube.com/iframe_api";
  youtubeScript.async = true;
  youtubeScript.onerror = handleMusicError;

  document.head.appendChild(youtubeScript);
}

window.onYouTubeIframeAPIReady = function () {
  createYouTubePlayer();
};

function createYouTubePlayer() {
  if (
    youtubeMusicPlayer ||
    !document.getElementById("youtubePlayer") ||
    !window.YT?.Player
  ) {
    return;
  }

  youtubeMusicPlayer = new YT.Player("youtubePlayer", {
    width: 356,
    height: 200,
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 1,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      origin: window.location.origin
    },
    events: {
      onReady: handleMusicPlayerReady,
      onStateChange: handleMusicStateChange,
      onError: handleMusicError
    }
  });
}

function handleMusicPlayerReady(event) {
  musicPlayerReady = true;

  const savedVolume = Number(
    localStorage.getItem("portfolio-music-volume")
  );

  const initialVolume = Number.isFinite(savedVolume)
    ? Math.min(100, Math.max(0, savedVolume))
    : DEFAULT_MUSIC_VOLUME;

  event.target.setVolume(initialVolume);

  const musicVolume = document.getElementById("musicVolume");

  if (musicVolume) {
    musicVolume.value = String(initialVolume);
  }

  if (pendingPlayRequest) {
    pendingPlayRequest = false;
    event.target.playVideo();
  }
}

function handleMusicStateChange(event) {
  if (!window.YT?.PlayerState) return;

  if (event.data === YT.PlayerState.PLAYING) {
    musicPlaying = true;
    musicStarted = true;
  } else if (
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.ENDED ||
    event.data === YT.PlayerState.CUED
  ) {
    musicPlaying = false;
  }

  updateMusicInterface();
}

function handleMusicError() {
  musicPlaying = false;
  pendingPlayRequest = false;

  const musicStatus = document.getElementById("musicStatus");
  const musicIcon = document.getElementById("musicIcon");

  if (musicStatus) {
    musicStatus.textContent = "Música indisponível";
  }

  if (musicIcon) {
    musicIcon.textContent = "⚠️";
  }
}

function openMusicPanel() {
  const musicPanel = document.getElementById("musicPanel");

  musicPanel?.classList.add("is-visible");
  musicPanel?.setAttribute("aria-hidden", "false");
}

function closeMusicPanel() {
  const musicPanel = document.getElementById("musicPanel");

  musicPanel?.classList.remove("is-visible");
  musicPanel?.setAttribute("aria-hidden", "true");
}

function startMusic() {
  openMusicPanel();

  if (!youtubeMusicPlayer || !musicPlayerReady) {
    pendingPlayRequest = true;
    loadYouTubeApi();
    return;
  }

  youtubeMusicPlayer.playVideo();
}

function pauseMusic() {
  if (!youtubeMusicPlayer || !musicPlayerReady) return;

  youtubeMusicPlayer.pauseVideo();
}

function toggleMusic() {
  openMusicPanel();

  if (!musicStarted || !musicPlaying) {
    startMusic();
  } else {
    pauseMusic();
  }
}

function updateMusicInterface() {
  const musicToggle = document.getElementById("musicToggle");
  const musicPlayPause = document.getElementById("musicPlayPause");
  const musicStatus = document.getElementById("musicStatus");
  const musicIcon = document.getElementById("musicIcon");

  musicToggle?.classList.toggle("is-playing", musicPlaying);
  musicToggle?.setAttribute("aria-pressed", String(musicPlaying));

  if (musicPlaying) {
    if (musicStatus) musicStatus.textContent = "Rock tocando";
    if (musicIcon) musicIcon.textContent = "🔊";
    if (musicPlayPause) musicPlayPause.textContent = "Pausar";
    return;
  }

  if (musicStatus) {
    musicStatus.textContent = musicStarted
      ? "Continuar rock"
      : "Ligar rock";
  }

  if (musicIcon) musicIcon.textContent = "🎸";
  if (musicPlayPause) musicPlayPause.textContent = "Tocar";
}
