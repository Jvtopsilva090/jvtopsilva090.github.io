// script.js

document.addEventListener("DOMContentLoaded", function () {
  const el = document.querySelector("header h1");
  const texto = el.textContent;
  el.textContent = "";

  let i = 0;
  const escrever = () => {
    if (i < texto.length) {
      el.textContent += texto.charAt(i);
      i++;
      setTimeout(escrever, 100);
    }
  };

  escrever();
});
