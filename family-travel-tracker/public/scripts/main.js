// Set up the common variables
const { users, visitedCountries } = window.appState;
let { activeUserID } = window.appState;

const totalCountSpan = document.querySelector(".total-count span"); // The h2 showing total count
let userColor = "teal";

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

// TODO: we need to get color of user and then modify css based on that

function colorTabs() {
  users.forEach((user) => {
    if (user.id === activeUserID) userColor = user.user_color;

    const elementID = document.querySelector(`#userTab${user.id}`);
    if (elementID) {
      elementID.style.backgroundColor = user.user_color;

      const colorParts = user.user_color.split(",");
      const hue = colorParts[0].replace("hsl(", "");
      const saturation = colorParts[1].replace("%", "");
      const lightness = Number(colorParts[2].replace("%)", ""));

      const textL = lightness > 35 ? 20 : 90;
      elementID.style.color = `hsl(${hue}, ${saturation}%, ${textL}%)`;
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
  // Loop through all countries userID
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
