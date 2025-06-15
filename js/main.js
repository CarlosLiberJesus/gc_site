// js/main.js
const COLORS = ['orange', 'blue', 'green'];

// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Not strictly needed for this task, but good to have
// function eraseCookie(name) {
//     document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// }

// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', function() {
    // --- Elements ---
    const colorOptionDiv = document.getElementById('color');
    const languageOptionDiv = document.getElementById('language');
    const mainColorIcon = colorOptionDiv ? colorOptionDiv.querySelector('.icon') : null;
    const mainLangIconImg = languageOptionDiv ? languageOptionDiv.querySelector('.icon img') : null;

    const colorLinks = colorOptionDiv ? colorOptionDiv.querySelectorAll('.dropdown a.option-link') : [];
    const languageLinks = languageOptionDiv ? languageOptionDiv.querySelectorAll('.dropdown a.option-link span.option-color') : [];

    function updateColorDropdown(currentColor) {
        if (!colorOptionDiv) return;
        const dropdown = colorOptionDiv.querySelector('.dropdown');
        dropdown.innerHTML = ''; // Limpa

        // Mostra só as outras cores
        COLORS.filter(c => c !== currentColor).forEach(otherColor => {
            const a = document.createElement('a');
            a.href = '?color=' + otherColor;
            a.className = 'option-link';
            a.innerHTML = `<span class="option-color ${otherColor}">&nbsp;</span>`;
            a.addEventListener('click', function(event) {
                event.preventDefault();
                setCookie('color_theme', otherColor, 30);
                applyColorTheme(otherColor);
                updateColorDropdown(otherColor);
            });
            dropdown.appendChild(a);
        });
    }

    // --- Initial Setup Functions ---
    function applyColorTheme(color) {
        if (!color || !mainColorIcon) return;
        document.getElementById('logoImg').src = './img/logos/logo-' + color + '.png';
        document.body.className = '';
        document.body.classList.add(color + '-theme');
        mainColorIcon.classList.remove('orange', 'blue', 'green');
        if (color === 'default' || color === 'orange') {
            mainColorIcon.classList.add('orange');
        } else {
            mainColorIcon.classList.add(color);
        }
        updateColorDropdown(color); // <--- Adicione isto
    }

    function applyLanguage(lang) {
        if (!lang || !mainLangIconImg) return;
        // Update main language icon
        // Assumes lang codes like 'en', 'pt' and flag images are named accordingly
        mainLangIconImg.src = './img/flags/' + lang + '.png';
        mainLangIconImg.alt = lang.toUpperCase();

        // TODO: Add actual text translation logic here if needed in the future
        // For now, we are just changing the flag and setting the cookie.
        // Also update the html lang attribute
        document.documentElement.lang = lang;
    }

    // --- Load Preferences from Cookies ---
    const savedColor = getCookie('color_theme');
    if (savedColor && COLORS.includes(savedColor)) {
        applyColorTheme(savedColor);
    } else {
        applyColorTheme('orange');
    }

    const savedLang = getCookie('language');
    if (savedLang) {
        applyLanguage(savedLang);
    } else {
        applyLanguage('pt'); // Default language
    }

    // --- Event Listeners for Language Options ---
    languageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            // Extract lang from href, e.g., "?lang=en" -> "en"
            const urlParams = new URLSearchParams(link.search);
            const selectedLang = urlParams.get('lang');

            if (selectedLang) {
                setCookie('language', selectedLang, 30); // Save for 30 days
                applyLanguage(selectedLang);

                // Update other language links to show the current language
                // This logic assumes the dropdown link should always show the *other* language option.
                if (languageOptionDiv) {
                    const allLangLinks = languageOptionDiv.querySelectorAll('.dropdown a.option-link');
                    allLangLinks.forEach(otherLink => {
                        // This assumes there's only one link in the dropdown that needs to be updated.
                        // If there were multiple language options, this logic would need to be more complex.
                        if (selectedLang === 'en') {
                            otherLink.href = '?lang=pt';
                            otherLink.innerHTML = '<img src="./img/flags/pt.png" alt="Português" /> Português';
                        } else if (selectedLang === 'pt') {
                            otherLink.href = '?lang=en';
                            otherLink.innerHTML = '<img src="./img/flags/en.png" alt="English" /> English';
                        }
                    });
                }
            }
        });
    });
});
