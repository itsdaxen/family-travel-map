// Set up the common variables
const { users, visitedCountries } = window.appState;
let { activeUserID } = window.appState;

const totalCountSpan = document.querySelector(".total-count span"); // The h2 showing total count
let activeUserColor;

const newUserForm = document.querySelector(".new-user-form");
const overlay = document.querySelector(".overlay");

function handleClickOnUserTab(id) {
  document.querySelectorAll(".user-tab-container ul li").forEach((li) => {
    li.classList.remove("active");
  });
  activeUserID = id;
  document.querySelector(`#userTab${id}`).classList.add("active");
  document.querySelector("#activeUserField").value = activeUserID;
  colorTabs();
  colorCountries();
  calTotal();
}

function handleAddNewUser() {
  // On click this button submits a hidden form to the server
  newUserForm.style.animation = "newUserFormZoomIn 0.125s ease";
  overlay.style.animation = "fadeIn 0.125s ease";

  newUserForm.classList.add("active");
  overlay.classList.add("active");
  document.querySelector('input[name="newUserName"]').focus();
  document.body.classList.add("no-scroll");
}

function handleCloseNewUserForm() {
  newUserForm.style.animation = "fadeOut 0.125s ease";
  overlay.style.animation = "fadeOut 0.125s ease";

  setTimeout(() => {
    newUserForm.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }, 125);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") handleCloseNewUserForm();
});

function hexToHSL(hex) {
  hex = hex.replace("#", ""); // Drop the #

  // TODO: consider the case of short hex
  // Part the hex
  const firstPart = hex.slice(0, 2);
  const secondPart = hex.slice(2, 4);
  const thirdPart = hex.slice(4, 6);

  // Convert each part to the equivalent decimal value to get RGB
  const r = parseInt(firstPart, 16) / 255;
  const g = parseInt(secondPart, 16) / 255;
  const b = parseInt(thirdPart, 16) / 255;

  // Find max, min, and delta
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // TODO: ...
  // Calculate HSL values
  // Find lightness
  let l = (max + min) / 2;
  // Find hue
  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  // Find saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  h = Math.round(h);
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  result = `hsl(${h}, ${s}%, ${l}%)`;
  return result;
}

function colorTabs() {
  const hslPattern =
    /^hsl\(\s*(\d{1,3}(?:\.\d+)?)\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*,\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/i;
  let fallBackColor = "hsl(230, 80%, 45%)";

  users.forEach((user) => {
    let color = hslPattern.test(user.user_color)
      ? user.user_color
      : fallBackColor;

    if (activeUserID === user.id) activeUserColor = color;

    const tabID = document.querySelector(`#userTab${user.id}`);

    if (tabID) {
      const colorParts = color.trim().split(",");
      const hue = colorParts[0].trim().replace("hsl(", "");
      const saturation = colorParts[1].trim().replace("%", "");
      const lightness = Number(colorParts[2].trim().replace("%)", ""));

      // TODO: refactor and modularize the color logic

      // normal background color
      tabID.style.setProperty(
        "--tab-color",
        `hsl(${hue}, ${saturation}%, ${lightness}%)`
      );

      // normal text color
      tabID.style.setProperty(
        "--tab-text-color",
        `hsl(0, 5%, ${lightness > 60 ? 10 : 98}%)`
      );

      // hover background color
      tabID.style.setProperty(
        "--tab-color-hover",
        `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`
      );

      // hover text color
      tabID.style.setProperty(
        "--tab-text-color-hover",
        `hsl(0, 5%, ${lightness - 10 > 60 ? 10 : 98}%)`
      );

      // active background color
      tabID.style.setProperty(
        "--tab-color-active",
        `hsl(${hue}, ${saturation}%, ${lightness - 11}%)`
      );

      // active text color
      tabID.style.setProperty(
        "--tab-text-color-active",
        `hsl(0, 5%, ${lightness - 11 > 60 ? 10 : 98}%)`
      );
    }
  });
}

function colorCountries() {
  // Visited countries logic
  Array.from(document.querySelector(".ag-canvas_svg").children).forEach(
    (child) => (child.style.fill = null)
  );
  console.log(document.body.children);
  console.log(Array.from(document.body.children));

  // Loop through all countries and check their id
  visitedCountries.forEach((country) => {
    const el = document.getElementById(country.country_code);
    el && Number(country.user_id) === activeUserID
      ? (el.style.fill = activeUserColor)
      : null;
  });
}

function calTotal() {
  // Loop through all countries for the userID
  const sum = visitedCountries.filter(
    (country) => Number(country.user_id) === activeUserID
  ).length;

  //To be implemented by onClick and by DOM load
  totalCountSpan.innerHTML = sum;
  totalCountSpan.style.animation = "none"; // Remove existing animation
  void totalCountSpan.offsetWidth; // Force reflow (browser hack)
  totalCountSpan.style.animation = null; // Allow animation to run again
}

// TODO: check why called on load
document.querySelector("#newUser").addEventListener("submit", (e) => {
  const hex = document.querySelector("#newUserColorHex").value;
  const hsl = hexToHSL(hex);
  document.querySelector('input[name="newUserColorHSL"]').value = hsl;
});

document.addEventListener("DOMContentLoaded", () => {
  colorTabs();
  colorCountries();
  calTotal();

  // TEST: testing hexToHSL
  hexToHSL();
});
