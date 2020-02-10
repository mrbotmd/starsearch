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
      // console.log("data from fetch", data);
      console.log(data);
      if (data.count) {
        let output = {
          output: data.results,
          next: data.next,
          previous: data.previous,
          count: Math.ceil(data.count / 10)
        };
        return output;
      } else {
        console.log(data);
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
    // console.log(queryObject.value);
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
    // console.log(`${rootURL}${optionSelector.value}/`);
    return apiCall(`${rootURL}${optionSelector.value}/`);
  }
};

let buildPaginator = data => {
  let callPage = (tag, url) => {
    tag.addEventListener("click", async function() {
      let result = await apiCall(url);
      build(result);
    });
  };
  // build only next and previous pages
  let buildNPPages = data => {
    let nextPage = document.createElement("a");
    let prevPage = document.createElement("a");
    nextPage.setAttribute("href", "#");
    // page.setAttribute("href", "#");
    if (data.next && data.previous) {
      prevPage.textContent = "Prev Page";
      nextPage.textContent = "Next Page";
      searchResultField.appendChild(prevPage);
      searchResultField.appendChild(nextPage);
      callPage(prevPage, data.previous);
      callPage(nextPage, data.next);
      return nextPage, prevPage;
    } else if (data.next) {
      nextPage.textContent = "Next Page";
      searchResultField.appendChild(nextPage);
      callPage(nextPage, data.next);
      return nextPage;
    } else if (!data.next && data.previous) {
      prevPage.textContent = "Prev Page";
      searchResultField.appendChild(prevPage);
      callPage(prevPage, data.previous);
      return prevPage;
    } else {
      return;
    }
    return nextPage, prevPage;
  };
  buildNPPages(data);

  // Build all the pages at once
  let buildAllPages = data => {
    let urlList = [];
    for (let i = 1; i <= data.count; i++) {
      let url = data.next;
      if (url != null) {
        let nextPage = document.createElement("a");
        url = data.next.slice(0, -1);
        url += i;
        nextPage.setAttribute("href", "#page=" + i);
        nextPage.setAttribute("class", "nextPage");
        nextPage.setAttribute("data-apilink", url);
        nextPage.addEventListener("click", async function() {
          let result = await apiCall(url);
          build(result);
        });
        nextPage.textContent = "Page: " + i;
        searchResultField.appendChild(nextPage);
        urlList.push(url);
      }
    }
    return urlList;
  };
};

async function call(data) {
  console.log(data);
  let link = data.toElement.dataset.apilink;
  let linkArray = link.split(",");
  let result = [];
  await Promise.all(
    linkArray.map(async item => {
      let call = await apiCall(item);
      result.push(call);
      return result;
    })
  );
  return result;
}

let buildNewPage = async data => {
  let result = await call(data);
  let [spreadRes] = [result[0]];
  console.log(spreadRes);
  build(spreadRes);
};

let showLinks = async data => {
  let parentElement = data.toElement.parentElement;
  let element = data.toElement;
  let linkData = await call(data);
  console.log(linkData);
  let ul = document.createElement("ul");
  linkData.forEach(item => {
    let linkListItem = document.createElement("a");
    if (element.text == "films") {
      linkListItem.textContent = item.title;
      linkListItem.setAttribute("data-apilink", item);
      let linkLi = links(item.url, item.title);
      // console.log(link.firstChild);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage, { once: true });
      ul.appendChild(linkLi);
    } else {
      let linkLi = links(item.url, item.name);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage, { once: true });
      linkListItem.textContent = item.name;
      linkListItem.setAttribute("data-apilink", item);
      ul.appendChild(linkLi);
    }
  });
  parentElement.appendChild(ul);
};

let links = (option, optionName) => {
  let listItem = document.createElement("li");
  let linkTag = document.createElement("a");
  linkTag.setAttribute("href", "#");
  linkTag.setAttribute("data-apilink", option);
  linkTag.addEventListener("click", showLinks, { once: true });
  linkTag.textContent = optionName;
  listItem.appendChild(linkTag);
  return listItem;
};

let buildResultForm = data => {
  console.log(data);
  // let info = [];
  // info.push(data);
  // console.log(info);
  // if (data.output[0].url.includes("people")) {
  // console.log(data.output[0].url.includes("people"));
  buildPeopleResultForm(data);
  // } else if (data.output[0].url.includes("films")) {
  // }
  return data;
};

let buildPeopleResultForm = data => {
  console.log(data);
  // console.log(data.output);
  let item;
  let resultList = document.createElement("ul");
  let build = character => {
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.textContent = "linksList";
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let article = document.createElement("article");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let homeworldList = Object.keys(character)[8];
    let filmsList = Object.keys(character)[9];
    let speciesList = Object.keys(character)[10];
    let vehiclesList = Object.keys(character)[11];
    let starshipsList = Object.keys(character)[12];

    h1.textContent = character.name;
    h1.setAttribute("data-apilink", character.url);
    h1.addEventListener("click", buildNewPage);
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
    linksList.appendChild(links(character.films, filmsList));
    linksList.appendChild(links(character.homeworld, homeworldList));
    linksList.appendChild(links(character.species, speciesList));
    linksList.appendChild(links(character.vehicles, vehiclesList));
    linksList.appendChild(links(character.starships, starshipsList));
  };

  if (data.output === undefined) {
    item = data;
    build(item);
  } else {
    item = data.output;
    item.forEach(character => {
      build(character);
    });
  }
  searchResultField.appendChild(resultList);
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
