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
      if (data.count) {
        let output = {
          output: data.results,
          next: data.next,
          count: Math.ceil(data.count / 10)
        };
        console.log("output");
        return output;
      } else {
        console.log(data);
        return data;
      }
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
    nextPage.textContent = "Next Page";
    searchResultField.appendChild(nextPage);
  }
};

async function call(data) {
  let link = data.toElement.text;
  console.log(link);
  let result = await apiCall(link);
  console.log(result);
  return result;
}

let buildPeopleResultForm = data => {
  let resultList = document.createElement("ul");
  data.output.forEach(character => {
    let p = document.createElement("p");
    let pLinks = document.createElement("p");
    let li = document.createElement("li");
    let article = document.createElement("article");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let div = document.createElement("div");
    let br = document.createElement("br");
    let links = option => {
      if (typeof option === "string") {
        let link = document.createElement("a");
        link.setAttribute("href", "#");
        link.addEventListener("click", call);
        link.textContent = option;
        p.appendChild(br);
        p.appendChild(link);
        return link;
      } else {
        option.forEach(item => {
          let link = document.createElement("a");
          link.setAttribute("href", item);
          link.addEventListener("click", call);
          link.textContent = item;
          p.appendChild(br);
          p.appendChild(link);
          return link;
        });
      }
    };
    links(character.films);
    links(character.species);
    h1.textContent = character.name;
    div.setAttribute("class", "container--flex");
    p.innerHTML = `
      Height: ${character.height} <br />
      Mass: ${character.mass} <br />
      Hair Color: ${character.hair_color} <br />
      Skin Color: ${character.skin_color} <br />
      Eye Color: ${character.eye_color} <br />
      Birth Year: ${character.birth_year} <br />
      Gender: ${character.gender} <br />`;
    img.setAttribute("src", randomImg);
    resultList.appendChild(li);
    li.appendChild(article);
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(pLinks);
    pLinks.appendChild(links(character.homeworld));
  });
  searchResultField.appendChild(resultList);
};

let buildResultForm = data => {
  if (optionSelector.value == "people") {
    buildPeopleResultForm(data);
  }
  return data;
};

let build = data => {
  buildPages(data);
  buildResultForm(data);
};

const clear = () => {
  while (searchResultField.firstChild) {
    searchResultField.removeChild(searchResultField.firstChild);
  }
};
// })()
