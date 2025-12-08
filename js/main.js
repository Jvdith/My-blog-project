const ham_menu = document.querySelector(".ham-menu");
const off_screen_menu = document.querySelector(".off-screen-menu");
const nav_links = document.querySelectorAll("nav a");

nav_links.forEach((link) => {
  const clone = link.cloneNode(true);
  off_screen_menu.appendChild(clone);
});

ham_menu.addEventListener("click", () => {
  ham_menu.classList.toggle("active");
  off_screen_menu.classList.toggle("active");
});

off_screen_menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    ham_menu.classList.remove("active");
    off_screen_menu.classList.remove("active");
  }
});