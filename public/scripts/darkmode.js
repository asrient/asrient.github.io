// https://tailwindcss.com/docs/dark-mode
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
window.updateMode = function (mode = null) {
    if (mode !== null) {
        localStorage.theme = mode;
    }
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }    
}

window.updateMode();
