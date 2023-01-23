const { connect } = require("mongoose");

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

let token = "";
let cont = 0;
let exp = 0;

let socket = null;
let state = false;
let handler = null;

btLogin.addEventListener("click", () => {
  let user = inUser.value;
  let pass = inPass.value;
  if (user == "" || pass == "") {
    alertContainerLogin.innerHTML = "Introduce tu usuario y contraseña";
  } else {
    alertContainerLogin.innerHTML = "";
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
          // Abrir conexión con el websocket
          connectToWebSocket({
            ip: "localhost",
            port: "3000",
          });
        } else {
          alertContainerLogin.innerHTML = "Usuario o contraseña no válidos";
        }
      })
      .catch((err) => console.error("error:" + err));
  }
});

btRegex.addEventListener("click", () => {
  if (cont < 5) {
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
        taRegex.value = "";
      } else {
        alertContainerRegex.innerHTML = "";
        const url = "http://localhost:3000/regex";
        const options = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.token}`,
            regex: regex,
          },
        };
        fetch(url, options)
          .then((res) => res.json())
          .then((json) => {
            taRegex.value = json.message;
          })
          .catch((err) => console.error("error:" + err));
        cont++;
      }
    }
  } else {
    alertContainerLogin.innerHTML =
      "Gastaste tus consultas, vuelve a loguearte";
    loginContainer.classList.toggle("display-none");
    regexContainer.classList.toggle("display-none");
    inRegex.value = "";
    taRegex.value = "";
    cont = 0;
    exp = 0;
  }
});

function connectToWebSocket(config) {
  this.socket = new WebSocket("ws://" + config.ip + ":" + config.port);

  token = data.data;
  loginContainer.classList.toggle("display-none");
  regexContainer.classList.toggle("display-none");
  inUser.value = "";
  inPass.value = "";
  exp = Date.now();

  this.socket.onmessage = (event) => {
    this.handler.newMsg(JSON.parse(event.data));
  };

  this.socket.onclose = () => {
    this.state = false;
  };

  this.socket.onerror = () => {
    this.state = false;
  };
}

function sendMsgThroughWebSocket(content) {
  const msg = {
    content: content,
  };
  this.socket.send(JSON.stringify(msg));
}
