// Language Switcher for Blueprint Vault
let currentLanguage = localStorage.getItem('blueprintLang') || 'en';
let translations = {};

// Load translations
async function loadTranslations() {
  try {
    const response = await fetch('/translations.json');
    translations = await response.json();
    applyLanguage(currentLanguage);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Apply language to page
function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('blueprintLang', lang);
  
  // Update URL parameter
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
  
  // Update all data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Update language dropdown
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = lang;
  }
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Trigger custom event
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Initialize language from URL or storage
function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  if (urlLang && translations[urlLang]) {
    applyLanguage(urlLang);
  } else {
    applyLanguage(currentLanguage);
  }
}

// Listen for language changes
document.addEventListener('DOMContentLoaded', () => {
  loadTranslations();
  
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }
});
