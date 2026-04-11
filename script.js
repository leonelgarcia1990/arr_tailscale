const DEFAULT_IP = "192.168.100.43";

const SERVICES = [
  { name: "Sonarr", description: "Gestion de series", port: "8989", color: "bg-tech-blue", protocol: "http", path: "", icon: "TV" },
  { name: "Jellyseerr", description: "Solicitudes de contenido", port: "5055", color: "bg-tech-pink", protocol: "http", path: "", icon: "JS" },
  { name: "qBittorrent", description: "Cliente Torrent", port: "8080", color: "bg-tech-cyan", protocol: "http", path: "", icon: "QB" },
  { name: "Bazarr", description: "Gestion de subtitulos", port: "6767", color: "bg-tech-green", protocol: "http", path: "", icon: "BZ" },
  { name: "Filebrowser", description: "Explorador de archivos", port: "8081", color: "bg-tech-green", protocol: "http", path: "", icon: "FB" },
  { name: "Radarr", description: "Gestion de peliculas", port: "7878", color: "bg-tech-yellow", protocol: "http", path: "", icon: "RD" },
  { name: "Prowlarr", description: "Gestion de indexadores", port: "9696", color: "bg-tech-orange", protocol: "http", path: "", icon: "PR" },
  { name: "Transmission", description: "Cliente Torrent", port: "9091", color: "bg-tech-red", protocol: "http", path: "", icon: "TR" },
  { name: "Firefox", description: "Navegador web", port: "5800", color: "bg-tech-orange", protocol: "http", path: "", icon: "FX" },
  { name: "Portainer", description: "Gestion de Docker", port: "9443", color: "bg-tech-purple", protocol: "https", path: "/#!/home", icon: "PT" }
];

const ipInput = document.getElementById("ipInput");
const pasteBtn = document.getElementById("pasteBtn");
const resetBtn = document.getElementById("resetBtn");
const cardsGrid = document.getElementById("cardsGrid");
const toastContainer = document.getElementById("toastContainer");

const state = {
  inputValue: "",
  activeIp: DEFAULT_IP
};

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add("visible");
  });

  setTimeout(function () {
    toast.classList.remove("visible");
    toast.addEventListener(
      "transitionend",
      function () {
        toast.remove();
      },
      { once: true }
    );
  }, 2300);
}

function getActiveIp() {
  const savedIp = localStorage.getItem("homelab-ip");
  if (!savedIp || !savedIp.trim()) {
    localStorage.setItem("homelab-ip", DEFAULT_IP);
    return DEFAULT_IP;
  }
  return savedIp.trim();
}

function isValidIp() {
  return state.activeIp.trim() !== "";
}

function getServiceUrl(service) {
  return service.protocol + "://" + state.activeIp + ":" + service.port + service.path;
}

function openService(service) {
  if (!isValidIp()) {
    return;
  }
  window.open(getServiceUrl(service), "_blank", "noopener,noreferrer");
}

function cardTemplate(service, index) {
  return (
    '<article class="card" data-index="' + index + '" role="button" tabindex="0">' +
      '<div class="card-inner">' +
        '<div class="card-head">' +
          '<div class="icon-box ' + service.color + '">' + service.icon + '</div>' +
          '<div class="port-pill">:' + service.port + '</div>' +
        '</div>' +
        '<h3>' + service.name + '</h3>' +
        '<p>' + service.description + '</p>' +
      '</div>' +
      '<div class="card-overlay ' + service.color + '"></div>' +
    '</article>'
  );
}

function renderCards() {
  cardsGrid.innerHTML = SERVICES.map(cardTemplate).join("");
  syncCardAvailability();
}

function syncCardAvailability() {
  const disabled = !isValidIp();
  const cards = cardsGrid.querySelectorAll(".card");
  cards.forEach(function (card) {
    card.classList.toggle("disabled", disabled);
    card.setAttribute("tabindex", disabled ? "-1" : "0");
  });
}

function applyIp(raw) {
  const value = raw.trim();
  if (value) {
    state.activeIp = value;
    state.inputValue = value;
    localStorage.setItem("homelab-ip", value);
    showToast("Direccion IP guardada");
  } else {
    state.activeIp = DEFAULT_IP;
    state.inputValue = "";
    localStorage.setItem("homelab-ip", DEFAULT_IP);
  }
  syncCardAvailability();
}

function initInput() {
  ipInput.value = "";
  ipInput.addEventListener("input", function (event) {
    state.inputValue = event.target.value;
  });

  ipInput.addEventListener("change", function () {
    applyIp(state.inputValue);
  });

  ipInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      applyIp(state.inputValue);
      ipInput.blur();
    }
  });
}

function initButtons() {
  function pasteFromClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      showToast("Safari no habilito portapapeles");
      return;
    }

    navigator.clipboard
      .readText()
      .then(function (text) {
        const pasted = text.trim();
        if (!pasted) {
          return;
        }
        state.inputValue = pasted;
        state.activeIp = pasted;
        ipInput.value = pasted;
        localStorage.setItem("homelab-ip", pasted);
        showToast("IP pegada desde el portapapeles");
        syncCardAvailability();
      })
      .catch(function () {
        showToast("Permiti acceso al portapapeles en Safari");
      });
  }

  pasteBtn.addEventListener("click", pasteFromClipboard);
  pasteBtn.addEventListener("touchend", function (event) {
    event.preventDefault();
    pasteFromClipboard();
  });

  resetBtn.addEventListener("click", function () {
    ipInput.value = "";
    state.inputValue = "";
    state.activeIp = DEFAULT_IP;
    localStorage.setItem("homelab-ip", DEFAULT_IP);
    showToast("Volviendo a IP local por defecto");
    syncCardAvailability();
    setTimeout(function () {
      window.location.reload();
    }, 500);
  });
}

function initCardEvents() {
  cardsGrid.addEventListener("click", function (event) {
    const card = event.target.closest(".card[data-index]");
    if (!card) {
      return;
    }
    openService(SERVICES[Number(card.dataset.index)]);
  });

  cardsGrid.addEventListener("auxclick", function (event) {
    if (event.button !== 1) {
      return;
    }
    const card = event.target.closest(".card[data-index]");
    if (!card) {
      return;
    }
    event.preventDefault();
    openService(SERVICES[Number(card.dataset.index)]);
  });

  cardsGrid.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const card = event.target.closest(".card[data-index]");
    if (!card) {
      return;
    }
    event.preventDefault();
    openService(SERVICES[Number(card.dataset.index)]);
  });
}

function init() {
  state.activeIp = getActiveIp();
  renderCards();
  initInput();
  initButtons();
  initCardEvents();
}

init();
