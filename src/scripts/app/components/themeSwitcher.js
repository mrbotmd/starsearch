const modeSwitch = document.getElementById("mode-switch");
const body = document.getElementById("body");

modeSwitch.addEventListener("change", function() {
  if (this.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
});
