// (function () {
"use strict";

// import actorConstructor from "./actorConstructor.js";

const searchResultField = document.querySelector(".search__result");
const optionSelector = document.querySelector(".search__option-selector");
const searchBtn = document.querySelector(".search__btn");
const queryObject = document.querySelector(".search__input");

const rootURL = "https://swapi.co/api/";
let apiCall = url => {
  console.log(url);
  return fetch(url)
    .then(res => {
      console.log("raw res", res);
      return res.json();
    })
    .then(data => {
      console.log("data from fetch", data);
      if (data.count) {
        let output = {
          output: data.results,
          next: data.next,
          previous: data.previous,
          count: Math.ceil(data.count / 10)
        };
        // console.log("output");
        return output;
      } else {
        // console.log(data);
        return data;
      }
    })
    .catch(err => {
      if (err) {
        let errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "api-error");
        errorMessage.textContent =
          "Sorry, we coudn't reach the server. Try again.";
        searchResultField.appendChild(errorMessage);
      }
    });
};

searchBtn.addEventListener("click", search);

let searchQuery = data => {
  // let searchParams = new URLSearchParams();
  // console.log(searchParams);
  if (queryObject.value) {
    console.log(queryObject.value);
    // searchParams.append("", name);
    // console.log(`${rootURL}${optionSelector.value}/?search${searchParams}`);
    return apiCall(
      `${rootURL}${optionSelector.value}/?search=${queryObject.value}`
    );
  }
  // else if (data.toElement.tagName = "a" && data.toElement.dataset.apilink.includes("page")) {
  //   return apiCall(name)
  // }
  else {
    console.log(`${rootURL}${optionSelector.value}/`);
    return apiCall(`${rootURL}${optionSelector.value}/`);
  }
};

let buildPaginator = data => {
  let urlList = [];
  // console.log(data.next);
  // if (data.count > 1) {
  for (let i = 1; i <= data.count; i++) {
    let url = data.next;
    console.log(url != null);
    if (url != null) {
      let nextPage = document.createElement("a");
      url = data.next.slice(0, -1);
      url += i;
      nextPage.setAttribute("href", "#page=" + i);
      nextPage.setAttribute("class", "nextPage");
      nextPage.setAttribute("data-apilink", url);
      nextPage.addEventListener("click", async function() {
        let result = await apiCall(url);
        console.log(result.count);
        build(result);
      });
      nextPage.textContent = "Page: " + i;
      searchResultField.appendChild(nextPage);
      console.log(url);
      urlList.push(url);
    }
  }
  // }
  console.log(urlList);
  return urlList;
};

async function call(data) {
  let link = data.toElement.dataset.apilink;
  let linkArray = link.split(",");
  let result = [];
  // console.log(link);
  // console.log(linkArray)
  await Promise.all(
    linkArray.map(async item => {
      let call = await apiCall(item);
      // console.log(call);
      result = call;
      // result.push(call);
      // console.log(result)
      return result;
    })
  );
  // console.log(result)
  // console.log(result);
  return result;
}

let showLinks = async data => {
  let linkData = await call(data);
  // console.log(linkData)
  let parent = data.toElement.parentElement;
  let child = data.toElement;
  let linkListItem = document.createElement("p");
  // console.log(linkData)
  parent.removeChild(child);
  parent.appendChild(linkListItem);
  linkListItem.textContent = linkData.name;
  // console.log(parent)
};

let buildPeopleResultForm = data => {
  let resultList = document.createElement("ul");
  data.output.forEach(character => {
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.textContent = "linksList";
    let li = document.createElement("li");
    let article = document.createElement("article");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let br = document.createElement("br");
    let homeworld = Object.keys(character)[8];
    let films = Object.keys(character)[9];
    let links = (option, optionName) => {
      let linkTag = document.createElement("a");
      let list = document.createElement("ul");
      let listItem = document.createElement("li");
      let linkApi = typeof option === "object" ? Object.values(option) : option;
      linkTag.setAttribute("href", "#");
      linkTag.setAttribute("data-apilink", linkApi);
      linkTag.addEventListener("click", showLinks);
      linkTag.textContent = optionName;
      listItem.appendChild(linkTag);
      list.appendChild(listItem);
      return list;
    };

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
    div.appendChild(linksList);
    linksList.appendChild(links(character.films, films));
    linksList.appendChild(links(character.homeworld, homeworld));
  });
  searchResultField.appendChild(resultList);
};

let buildResultForm = data => {
  if (optionSelector.value == "people") {
    buildPeopleResultForm(data);
  }
  return data;
};

async function search() {
  let result = await searchQuery();
  console.log(result);
  build(result);
  // console.log(url.urlList);
}

let build = data => {
  clear();
  buildPaginator(data);
  buildResultForm(data);
};

const clear = () => {
  while (searchResultField.firstChild) {
    searchResultField.removeChild(searchResultField.firstChild);
  }
};
// })()
