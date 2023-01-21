const fetch = require("node-fetch");

$("#btLogin").on("click", login);

function login() {
  if ($("#inUser").empty() || $("#inPassword").empty()) {
    // Informar de que los campos deben estar rellenos
  } else {
    let user = "";
    if (true) {
      const url = "http://localhost:3000/login";
      const options = {
        method: "POST",
        body: {
          user: user,
        },
      };
      fetch(url, options)
        .then((res) => res.json())
        .then((json) => console.log(json))
        .catch((err) => console.error("error:" + err));
    }
  }
}

function regex(token) {
  const url = "http://localhost:3000/regex";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
}

/*const url = `http://localhost:3000/regex`;
const options = {
  method: "POST",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGVwZSIsImlhdCI6MTY3NDA2NDg3Nn0.uXyH1zi1YJEZdkGTI23wGtXXDyJO802ZbEEYrcpmYsc`,
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));*/
