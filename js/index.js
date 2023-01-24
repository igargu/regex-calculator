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

let token = "";
let cont = 0;
let exp = 0;

let socket = null;
let state = false;

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
          token = data.data;
          loginContainer.classList.toggle("display-none");
          regexContainer.classList.toggle("display-none");
          inUser.value = "";
          inPass.value = "";
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
});

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
      sendMsgThroughWebSocket(regex);
      inRegex.value = "";
      cont++;
    }
  }
});

function connectToWebSocket(config) {
  socket = new WebSocket("ws://" + config.ip + ":" + config.port);

  socket.onmessage = (event) => {
    if (cont < 5) {
      loader.toggleAttribute("hidden");
      taRegex.value += `${JSON.parse(event.data).result}\n\n`;
    } else {
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

function sendMsgThroughWebSocket(content) {
  socket.send(
    JSON.stringify({
      token: token,
      content: content,
    })
  );
}
