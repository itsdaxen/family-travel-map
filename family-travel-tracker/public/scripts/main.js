// Set up the common variables
const { users, visitedCountries } = window.appState;
let { activeUserID } = window.appState;

const totalCountSpan = document.querySelector(".total-count span"); // The h2 showing total count
let userColor = "teal";

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

function colorTabs() {
  users.forEach((user) => {
    if (user.id === activeUserID) userColor = user.user_color;

    const elementID = document.querySelector(`#userTab${user.id}`);
    if (elementID) {
      const colorParts = user.user_color.trim().split(",");
      const hue = colorParts[0].trim().replace("hsl(", "");
      const saturation = colorParts[1].trim().replace("%", "");
      const lightness = Number(colorParts[2].trim().replace("%)", ""));

      // TODO: refactor and modularize the color logic

      // normal background color
      elementID.style.setProperty(
        "--tab-color",
        `hsl(${hue}, ${saturation}%, ${lightness}%)`
      );

      // normal text color
      elementID.style.setProperty(
        "--tab-text-color",
        `hsl(0, 5%, ${lightness > 60 ? 10 : 98}%)`
      );

      // hover background color
      elementID.style.setProperty(
        "--tab-color-hover",
        `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`
      );

      // hover text color
      elementID.style.setProperty(
        "--tab-text-color-hover",
        `hsl(0, 5%, ${lightness - 10 > 60 ? 10 : 98}%)`
      );

      // active background color
      elementID.style.setProperty(
        "--tab-color-active",
        `hsl(${hue}, ${saturation}%, ${lightness - 11}%)`
      );

      // active text color
      elementID.style.setProperty(
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
  // Loop through all countries and check their id
  visitedCountries.forEach((country) => {
    const el = document.getElementById(country.country_code);
    el && Number(country.user_id) === activeUserID
      ? (el.style.fill = userColor)
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

document.addEventListener("DOMContentLoaded", () => {
  colorTabs();
  colorCountries();
  calTotal();
});
