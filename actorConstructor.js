"use strict";

let actor = data => {
  let article = document.createElement("article");
  article.innerHTML = `
  <header><h1>Name: ${data.name}</h1></header>  
  <p>Height: ${data.height} <br>
  Mass: ${data.mass} <br>
  Films: ${data.films}
  </p>
  `;
};

export default actor;
