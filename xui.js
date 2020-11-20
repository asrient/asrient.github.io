//determines if the user has a set theme
function detectColorTheme() {
    var theme = "light";
    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    }
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
    }
    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
    else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

window.detectColorTheme();

matchMedia("(prefers-color-scheme: dark)").addListener(window.detectColorTheme);

window.changeTheme = function (to = 'system') {
    if (to == 'dark') {
        localStorage.setItem('theme', 'dark');
    }
    else if (to == 'light') {
        localStorage.setItem('theme', 'light');
    }
    else {
        localStorage.removeItem('theme');
    }
    window.detectColorTheme();
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

window.isEmail = isEmail

class Api {
    constructor(baseUrl = null, extraHeaders = {}) {
        if (baseUrl)
            this.baseUrl = baseUrl;
        else
            this.baseUrl = "/api/";

        this.extraHeaders = extraHeaders;
    }
    _send(method, url, data, cb) {
        $.ajax({
            url: this.baseUrl + url,
            type: method,
            data,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: this.extraHeaders,
            dataType: 'json',
            success: (result, status, xhr) => {
                cb(xhr.status, result)
            },
            error: (xhr, txtStatus, err) => {
                cb(xhr.status, xhr.responseJSON)
            }
        });
    }
    post(url, data = {}, cb) {
        this._send('POST', url, data, cb)
    }
    get(url, data = {}, cb) {
        this._send('GET', url, data, cb)
    }
    put(url, data = {}, cb) {
        this._send('PUT', url, data, cb)
    }
    SET(url, data = {}, cb) {
        this._send('SET', url, data, cb)
    }
}

window.Api = Api;

const ua = window.navigator.userAgent;
const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
const webkit = !!ua.match(/WebKit/i);
const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);


function toggleSwitch(id, onToggle = function () { }) {
    var isActive = false;
    var button = document.createElement('div');
    button.className += 'toggle-button'
    var circle = document.createElement('div')
    circle.className += 'inner-circle'
    button.appendChild(circle)
    var root = document.getElementById(id)
    root.appendChild(button)
    root.className += 'toggle-container'
    button.addEventListener('click', () => {
        onToggle(isActive);
    })
    return (show = true) => {
        if (show && !isActive) {
            button.classList.toggle('active');
            isActive = true
        }
        else if (!show && isActive) {
            button.classList.toggle('active');
            isActive = false
        }
    }
}

function openLink(link) {
    window.location.href = link
}

$('document').ready(function () {
    $('textarea').autoResize();
})

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}