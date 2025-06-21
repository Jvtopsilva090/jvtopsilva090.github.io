
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
        section.style.opacity = 0;
        section.style.transform = "translateY(40px)";
        setTimeout(() => {
            section.style.transition = "all 0.8s ease";
            section.style.opacity = 1;
            section.style.transform = "translateY(0)";
        }, 400 * index);
    });
});
