(function () {
  var root = document.documentElement;

  function saved() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }
  }

  root.setAttribute("data-theme", saved() === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    setTheme(root.getAttribute("data-theme"));
    button.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });
})();
