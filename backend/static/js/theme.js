// Core Theme Handler
function applyTheme(themeName) {
    if (themeName === "light") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", themeName);
    }
    localStorage.setItem("theme", themeName);
    
    // Update switch UI
    const toggleInput = document.getElementById("light-mode-toggle");
    if (toggleInput) {
        toggleInput.checked = (themeName === "light");
    }
    
    // Update Settings UI Cards if present
    const cards = document.querySelectorAll(".theme-card");
    cards.forEach(card => {
        if (card.dataset.themeValue === themeName) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });

    // Re-render chart dynamically if it exists on page
    if (typeof updateChartTheme === 'function') {
        updateChartTheme();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Default to 'midnight' if no preference
    let savedTheme = localStorage.getItem("theme");
    if (!savedTheme) savedTheme = "midnight"; 
    
    applyTheme(savedTheme);

    // Sidebar Switch (Toggles between current dark variant and light)
    const toggleInput = document.getElementById("light-mode-toggle");
    if (toggleInput) {
        toggleInput.addEventListener("change", (e) => {
            if (e.target.checked) {
                applyTheme("light");
            } else {
                // If they turn off light mode, revert to Midnight (or Dark if they explicitly selected it in settings before)
                applyTheme("midnight"); 
            }
        });
    }

    // Settings Page Cards
    const themeCards = document.querySelectorAll(".theme-card");
    themeCards.forEach(card => {
        card.addEventListener("click", () => {
            applyTheme(card.dataset.themeValue);
        });
    });
});
