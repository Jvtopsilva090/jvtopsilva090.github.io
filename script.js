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
    if (!themeButton) {
      return;
    }

    const lightThemeActive = body.classList.contains("light-theme");

    themeButton.textContent = lightThemeActive ? "🌙" : "☀️";
    themeButton.setAttribute(
      "aria-label",
      lightThemeActive
        ? "Ativar tema escuro"
        : "Ativar tema claro"
    );

    themeButton.title = lightThemeActive
      ? "Ativar tema escuro"
      : "Ativar tema claro";
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
});
