// Mock sign-in (any non-empty credentials work) + 3D tilt interaction.
(function () {
  const SESSION_KEY = "el_session";
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");
  const card = document.getElementById("loginCard");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (!user || !pass) {
      errorMsg.hidden = false;
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, at: Date.now() }));
    window.location.href = "index.html";
  });

  // 3D tilt: rotate the card slightly based on cursor position within it.
  const MAX_TILT = 8; // degrees

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1
    const rotateY = (x - 0.5) * MAX_TILT * 2;
    const rotateX = (0.5 - y) * MAX_TILT * 2;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  });
})();
