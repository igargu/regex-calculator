let loginContainer = document.getElementById("loginContainer");
let inUser = document.getElementById("inUser");
let inPass = document.getElementById("inPass");
let btLogin = document.getElementById("btLogin");

let regexContainer = document.getElementById("regexContainer");
let inRegex = document.getElementById("inRegex");
let btRegex = document.getElementById("btRegex");
let taRegex = document.getElementById("taRegex");

let alertContainerLogin = document.getElementById("alertContainerLogin");
let alertContainerRegex = document.getElementById("alertContainerRegex");

let loader = document.getElementById("spLoader");
let loaderLogin = document.getElementById("spLoaderLogin");

let token = "";
let cont = 0;
let exp = 0;

let socket = null;
let state = false;

const MAX_LONG = -3.590768;
const MIN_LONG = -3.592621;
const MIN_LATI = 37.160317;
const MAX_LATI = 37.161525;

const proxy = new Proxy(
  {
    login: accesGranted,
    regex: sendMsgThroughWebSocket,
  },
  {
    get: function (target, prop) {
      if (prop === "login") {
        target.login();
      }
    },
    set: function (target, prop, value) {
      if (prop === "regex") {
        target.regex(value);
        return true;
      }
    },
  }
);

btLogin.addEventListener("click", () => {
  alertContainerLogin.innerHTML = "";
  if (inUser.value == "" || inPass.value == "") {
    alertContainerLogin.innerHTML = "Introduce tu usuario y contraseña";
  } else {
    checkPosition();
  }
});

function checkPosition() {
  loaderLogin.toggleAttribute("hidden");
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      loaderLogin.toggleAttribute("hidden");
      if (
        MIN_LATI < pos.coords.latitude < MAX_LATI &&
        MIN_LONG > pos.coords.longitude > MAX_LONG
      ) {
        proxy.login;
      } else {
        alertContainerLogin.innerHTML = "Tu ubicación no está permitida";
      }
    },
    function (err) {
      loaderLogin.toggleAttribute("hidden");
      console.log(`Error ${err.code} : ${err.message}`);
      if (err.code == 1) {
        alertContainerLogin.innerHTML = "Acceso a ubicación denegado";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    }
  );
}

function accesGranted() {
  let user = inUser.value;
  let pass = inPass.value;
  const url = "http://localhost:3000/login";
  const options = {
    method: "POST",
    headers: {
      user: user,
      pass: pass,
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (data.data != null) {
        token = data.data;
        loginContainer.classList.toggle("display-none");
        regexContainer.classList.toggle("display-none");
        inUser.value = "";
        inPass.value = "";
        taRegex.value = "";
        exp = Date.now();
        connectToWebSocket({
          ip: "localhost",
          port: "3030",
        });
      } else {
        alertContainerLogin.innerHTML = "Usuario o contraseña no válidos";
      }
    })
    .catch((err) => console.error("error:" + err));
}

function connectToWebSocket(config) {
  socket = new WebSocket("ws://" + config.ip + ":" + config.port);

  socket.onmessage = (event) => {
    loader.toggleAttribute("hidden");
    taRegex.value += `${JSON.parse(event.data).result}\n\n`;
    if (cont == 5) {
      btRegex.classList.toggle("display-none");
      alertContainerRegex.innerHTML =
        'Gastaste tus consultas, vuelve a <u id="linkLogin">loguearte</u>';
      inRegex.value = "";
      cont = 0;
      exp = 0;
      document.getElementById("linkLogin").addEventListener("click", () => {
        loginContainer.classList.toggle("display-none");
        regexContainer.classList.toggle("display-none");
        alertContainerRegex.innerHTML = "";
        taRegex.value = "";
        btRegex.classList.toggle("display-none");
      });
    }
  };

  socket.onclose = () => {
    state = false;
  };

  socket.onerror = () => {
    state = false;
  };
}

btRegex.addEventListener("click", () => {
  if (Date.now() >= exp + 600000) {
    alertContainerLogin.innerHTML = "Se acabo el tiempo, vuelve a loguearte";
    loginContainer.classList.toggle("display-none");
    regexContainer.classList.toggle("display-none");
    inRegex.value = "";
    taRegex.value = "";
    cont = 0;
    exp = 0;
  } else {
    let regex = inRegex.value;
    if (regex == "") {
      alertContainerRegex.innerHTML = "Introduce una regex";
    } else {
      if (loader.hasAttribute("hidden")) {
        loader.toggleAttribute("hidden");
      }
      alertContainerRegex.innerHTML = "";
      proxy.regex = regex;
      inRegex.value = "";
      cont++;
    }
  }
});

function sendMsgThroughWebSocket(content) {
  socket.send(
    JSON.stringify({
      token: token,
      content: content,
    })
  );
}
