const IMAGE_PATH = "img/";

const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {
  const clone = link.cloneNode(true);
  offScreenMenu.appendChild(clone);
});

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

offScreenMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    hamMenu.classList.remove("active");
    offScreenMenu.classList.remove("active");
  }
});
