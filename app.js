// (function () {
"use strict";

// import actorConstructor from "./actorConstructor.js";

const searchResultField = document.querySelector(".search__result");
const optionSelector = document.querySelector(".search__option-selector");
const searchBtn = document.querySelector(".search__btn");
const queryObject = document.querySelector(".search__input");

const rootURL = "https://swapi.co/api/";
let apiCall = url => {
  return fetch(url)
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
      let output = {
        output: data.results,
        next: data.next,
        count: Math.ceil(data.count / 10)
      };
      console.log(output.count);
      return output;
    })
    .catch(err => console.log(err));
};

searchBtn.addEventListener("click", search);

let searchQuery = name => {
  let searchParams = new URLSearchParams();
  if (queryObject.value) {
    searchParams.append("", name);
    console.log(`${rootURL}${optionSelector.value}/?search${searchParams}`);
    return apiCall(`${rootURL}${optionSelector.value}/?search${searchParams}`);
  } else {
    console.log(`${rootURL}${optionSelector.value}/${searchParams}`);
    return apiCall(`${rootURL}${optionSelector.value}/${searchParams}`);
  }
};

async function search() {
  clear();
  let result = await searchQuery(queryObject.value);
  console.log(result);
  build(result);
}

let buildPages = data => {
  for (let i = 2; i <= data.count; i++) {
    let nextPage = document.createElement("a");
    let url = data.next.slice(0, -1);
    url += i;
    nextPage.setAttribute("href", url);
    nextPage.setAttribute("class", "nextPage");
    nextPage.innerHTML = nextPage.next;
    nextPage.textContent = "Next Page";
    searchResultField.appendChild(nextPage);
  }
};

let call = data => {
  console.log(data);
};

let buildArticle = data => {
  if (optionSelector.value == "people") {
    let ul = document.createElement("ul");
    data.output.forEach(character => {
      let article = document.createElement("article");
      // console.log(character.films);
      console.log(character);
      let linkFilm;
      let li = document.createElement("li");
      character.films.forEach((item, i, arr) => {
        linkFilm = document.createElement("a");
        linkFilm.setAttribute("href", item);
        linkFilm.addEventListener("click", call);
        linkFilm.textContent = item;
        li.appendChild(linkFilm);
      });

      article.innerHTML = `
      ${character.name}
      `;

      // article.innerHTML = `
      // <header><h1>Name: ${character.name}</h1></header>
      // <p>Height: ${character.height} <br>
      // Mass: ${character.mass} <br>
      // </p>
      // `;
      searchResultField.appendChild(li);
      li.appendChild(article);
      console.log(linkFilm);
    });
    ul.appendChild(li);
  }
};

let build = data => {
  buildPages(data);
  buildArticle(data);
};

const clear = () => {
  while (searchResultField.firstChild) {
    searchResultField.removeChild(searchResultField.firstChild);
  }
};
// })()
