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
});

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
