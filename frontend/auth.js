// Simple client-side session gate. NOT real authentication — see README.
(function () {
  const SESSION_KEY = "el_session";

  if (!sessionStorage.getItem(SESSION_KEY)) {
    window.location.href = "login.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = "login.html";
    });
  });
})();
