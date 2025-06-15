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
    // Corrected selector for language links:
    const langLinks = languageOptionDiv ? languageOptionDiv.querySelectorAll('.dropdown a.option-link') : [];

    const translations = {
        'pt': {
            'msg-thank-you': "Obrigado a todos os clientes! A empresa está em modo automático. Serviços de consultoria devem ser agendados. (Lorem ipsum dolor sit amet, consectetur adipiscing elit...)",
            'lbl-contact-form-title': "Formulário de Contacto",
            'lbl-name': "Nome:",
            'lbl-email': "Email:",
            'lbl-message': "Mensagem:",
            'lbl-submit': "Enviar"
        },
        'en': {
            'msg-thank-you': "Thank you to all our clients! The company is currently in automatic mode. Consultancy services must be scheduled. (Lorem ipsum dolor sit amet, consectetur adipiscing elit...)",
            'lbl-contact-form-title': "Contact Form",
            'lbl-name': "Name:",
            'lbl-email': "Email:",
            'lbl-message': "Message:",
            'lbl-submit': "Send"
        }
    };

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
        if (!lang || !mainLangIconImg) return; // Keep existing check

        // Update main language icon
        mainLangIconImg.src = './img/flags/' + lang + '.png';
        mainLangIconImg.alt = lang.toUpperCase();
        document.documentElement.lang = lang;

        // Apply translations
        if (translations[lang]) {
            for (const id in translations[lang]) {
                const element = document.getElementById(id);
                if (element) {
                    element.innerText = translations[lang][id];
                } else {
                    console.warn(`Element with ID '${id}' not found for translation.`);
                }
            }
        } else {
            console.warn(`Translations for language '${lang}' not found.`);
        }

        // Update the language switcher link in the dropdown
        if (languageOptionDiv) {
            const linkInDropdown = languageOptionDiv.querySelector('.dropdown a.option-link');
            if (linkInDropdown) {
                if (lang === 'en') {
                    linkInDropdown.href = '?lang=pt';
                    linkInDropdown.innerHTML = '<img src="./img/flags/pt.png" alt="Português" /> Português';
                } else if (lang === 'pt') {
                    linkInDropdown.href = '?lang=en';
                    linkInDropdown.innerHTML = '<img src="./img/flags/en.png" alt="English" /> English';
                }
            }
        }
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

    // --- Event Listeners for Language Options (using corrected langLinks) ---
    langLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            // 'this' refers to the clicked 'a' element
            const urlParams = new URLSearchParams(this.search); // Use 'this.search'
            const selectedLang = urlParams.get('lang');

            if (selectedLang) {
                setCookie('language', selectedLang, 30);
                applyLanguage(selectedLang); // This will now trigger text updates & update dropdown link
            }
        });
    });
});
