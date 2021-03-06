"use strict";

import {
  buildPaginator
} from "./components/buildPaginator";
import "./components/themeSwitcher";
export const searchResultField = document.querySelector(".search__result");
const optionSelector = document.querySelector(".search__form__option-selector");
const searchBtn = document.querySelector(".search__form__btn");
const queryObject = document.querySelector(".search__form__input");
const rootURL = "https://swapi.co/api/";

searchBtn.addEventListener("click", search);
document.querySelector("form").addEventListener("submit", search);

queryObject.addEventListener("input", function () {
  if (queryObject.value) {
    searchBtn.classList.add("glow");
    searchBtn.textContent = "Dew It";
  } else {
    searchBtn.classList.remove("glow");
    searchBtn.textContent = "Search";
  }
});

searchBtn.addEventListener("mouseenter", function () {
  searchBtn.textContent = "Dew It";
});
searchBtn.addEventListener("mouseleave", function () {
  searchBtn.textContent = "Search";
});

export function createSpinner() {
  let spinner = document.createElement("div");
  let innerSpinnerFirst = document.createElement("div");
  let innerSpinnerSecond = document.createElement("div");
  spinner.setAttribute("class", "spinner--dual-ring");
  innerSpinnerFirst.setAttribute("class", "spinner__inner-1--dual-ring");
  innerSpinnerSecond.setAttribute("class", "spinner__inner-2--dual-ring");
  spinner.appendChild(innerSpinnerFirst);
  spinner.appendChild(innerSpinnerSecond);
  return spinner;
}

export function isFetchFailed(fetchResult) {
  if (fetchResult === undefined) {
    clear(searchResultField);
    let failureMessage = document.createElement("p");
    failureMessage.setAttribute("class", "search__result__failed");
    failureMessage.textContent =
      "We couldn't reach the server. Please try again later";
    searchResultField.appendChild(failureMessage);
    return;
  }
  return fetchResult;
}

async function search(e) {
  e.preventDefault();
  clear(searchResultField);
  searchResultField.appendChild(createSpinner());
  let result = await searchQuery();
  if (result === undefined) {
    return isFetchFailed(result);
  }
  build(result);
}

function searchQuery() {
  if (queryObject.value) {
    return apiCall(
      `${rootURL}${optionSelector.value}/?search=${queryObject.value.replace(
        /\s/g,
        "+"
      )}`
    );
  } else {
    return apiCall(`${rootURL}${optionSelector.value}/`);
  }
}

export async function apiCall(url) {
  const res = await fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      if (data.count) {
        let output = {
          output: data.results,
          next: data.next,
          previous: data.previous,
          count: Math.ceil(data.count / 10)
        };
        return output;
      } else if (data.count == 0) {
        return;
      } else {
        return data;
      }
    })
    .catch(err => {
      if (err) {
        let errorMessage = document.createElement("p");
        errorMessage.setAttribute("class", "search__result__failed");
        errorMessage.textContent =
          "Sorry, we coudn't reach the server. Try again.";
        searchResultField.appendChild(errorMessage);
      }
    });

  return res;
}

export function build(data) {
  let propList = [
    "characters",
    "films",
    "homeworld",
    "species",
    "vehicles",
    "starships"
  ];
  clear(searchResultField);
  buildPaginator(data);
  buildResultForm(data, propList);
}

async function call(data) {
  let link = data.target.dataset.apilink;
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

async function buildNewPage(data) {
  clear(searchResultField);
  searchResultField.appendChild(createSpinner());
  let result = await call(data);
  if (result === undefined) {
    return isFetchFailed(result);
  }
  build(result);
}

async function showLinks(data) {
  let parentElement = data.target.parentElement;
  let element = data.target;
  console.log("parent", parentElement);
  console.log("element", element);
  let spinner = createSpinner();
  parentElement.appendChild(spinner);
  let linkData = await call(data);
  let ul = document.createElement("ul");
  ul.setAttribute("class", "result__info-sublist");
  linkData.forEach(item => {
    let linkListItem = document.createElement("a");
    if (element.text == "films") {
      linkListItem.textContent = item.title;
      linkListItem.setAttribute("data-apilink", item);
      let linkLi = links(item.url, item.title);
      linkLi.setAttribute("class", "result__info-sublist__item");
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage);
      ul.appendChild(linkLi);
    } else {
      let linkLi = links(item.url, item.name);
      linkLi.setAttribute("class", "result__info-sublist__item");
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage);
      linkListItem.textContent = item.name;
      linkListItem.setAttribute("data-apilink", item);
      ul.appendChild(linkLi);
    }
  });
  parentElement.removeChild(spinner);
  parentElement.appendChild(ul);
}

function links(option, optionName) {
  let listItem = document.createElement("li");
  let linkTag = document.createElement("a");
  linkTag.setAttribute("href", "#/");
  linkTag.setAttribute("class", "result__info-list__item-link");
  linkTag.setAttribute("data-apilink", option);
  linkTag.addEventListener("click", showLinks, {
    once: true
  });
  linkTag.textContent = optionName;
  listItem.appendChild(linkTag);
  return listItem;
}

function buildResultForm(data, propList) {
  let builders = {
    people: buildCharacterForm,
    films: buildFilmForm,
    planets: buildPlanetForm,
    species: buildSpeciesForm,
    vehicles: buildVehicleForm,
    starships: buildStarshipForm
  };
  if (data.output === undefined) {
    let item = data;
    return typeCheck(item);
  } else {
    let item = data.output;
    return typeCheck(item);
  }

  function typeCheck(obj) {
    for (let key in builders) {
      if (obj[0].url.includes(`api/${key}`)) {
        builders[key](obj, propList);
      }
    }
  }
}

function buildCharacterForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "people";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("class", "result__img");
    img.setAttribute("src", randomImg);
    let buildCharacter = character => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = character.name;
      h1.setAttribute("data-apilink", character.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
          Height: ${character.height} <br />
          Mass: ${character.mass} <br />
          Hair Color: ${character.hair_color} <br />
          Skin Color: ${character.skin_color} <br />
          Eye Color: ${character.eye_color} <br />
          Birth Year: ${character.birth_year} <br />
          Gender: ${character.gender} <br />`;
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);
      props.forEach(item => {
        if (character[item] != null && character[item].length != 0) {
          linksList
            .appendChild(links(character[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildCharacter(data);
    searchResultField.appendChild(article);
  });
}

function buildFilmForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "films";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("src", randomImg);
    img.setAttribute("class", "result__img");
    let buildFilm = films => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = films.title;
      h1.setAttribute("data-apilink", films.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Title: ${films.title} <br />
        Episode: ${films.episode_id} <br />
        <details class="film-crawl">
        <summary>
        Opening crawl
        </summary>
        <p>${films.opening_crawl}</p></details> <br />
        Director: ${films.director} <br />
        Producer: ${films.producer} <br />
        Release Date: ${films.release_date} <br />`;

      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);
      props.forEach(item => {
        if (films[item] != null && films[item].length != 0) {
          linksList
            .appendChild(links(films[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildFilm(data);
    searchResultField.appendChild(article);
  });
}

function buildPlanetForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "planets";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("src", randomImg);
    img.setAttribute("class", "result__img");
    let buildPlanet = planets => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = planets.name;
      h1.setAttribute("data-apilink", planets.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Title: ${planets.name} <br />
        Rotation Period: ${planets.rotation_period} <br />
        Orbital Period: ${planets.orbital_period} <br />
        Diameter: ${planets.diameter} <br />
        Climate: ${planets.climate} <br />
        Gravity: ${planets.gravity} <br />
        Terrain: ${planets.terrain} <br />
        Surface Water: ${planets.surface_water} <br />
        Population: ${planets.population} <br />`;
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (planets[item] != null && planets[item].length != 0) {
          linksList
            .appendChild(links(planets[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildPlanet(data);
    searchResultField.appendChild(article);
  });
}

function buildSpeciesForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "species";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("src", randomImg);
    img.setAttribute("class", "result__img");
    let buildSpecies = species => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = species.name;
      h1.setAttribute("data-apilink", species.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Name: ${species.name} <br />
        Classification: ${species.classification} <br />
        Designation: ${species.designation} <br />
        Average Height: ${species.average_height} <br />
        Skin Colors: ${species.skin_colors} <br />
        Hair Colors: ${species.hair_colors} <br />
        Eye Colors: ${species.eye_colors} <br />
        Average Lifespan: ${species.average_lifespan} <br />
        Language: ${species.language} <br />`;
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (species[item] != null && species[item].length != 0) {
          linksList
            .appendChild(links(species[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildSpecies(data);
    searchResultField.appendChild(article);
  });
}

function buildVehicleForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "vehicles";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("src", randomImg);
    img.setAttribute("class", "result__img");
    let buildVehicle = vehicles => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = vehicles.name;
      h1.setAttribute("data-apilink", vehicles.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Title: ${vehicles.name} <br />
        Model: ${vehicles.model} <br />
        Manufacturer: ${vehicles.manufacturer} <br />
        Cost In Creditst: ${vehicles.cost_in_credits} <br />
        Length: ${vehicles.length} <br />
        Max Atmosphering Speed: ${vehicles.max_atmosphering_speed} <br />
        Crew: ${vehicles.crew} <br />
        Passengers: ${vehicles.passengers} <br />
        Cargo Capacity: ${vehicles.cargo_capacity} <br />
        Consumables: ${vehicles.consumables} <br />
        Vehicle Class: ${vehicles.vehicle_class} <br />`;
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (vehicles[item] != null && vehicles[item].length != 0) {
          linksList
            .appendChild(links(vehicles[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildVehicle(data);
    searchResultField.appendChild(article);
  });
}

function buildStarshipForm(buildItem, props) {
  let buildList = [];
  if (buildItem instanceof Array) {
    buildList = buildItem;
  } else if (!buildItem) {
    buildList.push(buildItem);
  } else {
    throw new Error("buildItem can't be null");
  }
  buildList.forEach(data => {
    let article = document.createElement("article");
    article.setAttribute("class", "search__result__item");
    optionSelector.value = "starships";
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/collection/2081954/300x150";
    img.setAttribute("src", randomImg);
    img.setAttribute("class", "result__img");
    let buildStarship = starships => {
      let p = document.createElement("p");
      p.setAttribute("class", "result__info-text");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "result__info-list");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      h1.textContent = starships.name;
      h1.setAttribute("data-apilink", starships.url);
      h1.addEventListener("click", buildNewPage);
      let div = document.createElement("div");
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Title: ${starships.name} <br />
        Model: ${starships.model} <br />
        Manufacturer: ${starships.manufacturer} <br />
        Cost In Creditst: ${starships.cost_in_credits} <br />
        Length: ${starships.length} <br />
        Max Atmosphering Speed: ${starships.max_atmosphering_speed} <br />
        Crew: ${starships.crew} <br />
        Passengers: ${starships.passengers} <br />
        Cargo Capacity: ${starships.cargo_capacity} <br />
        Consumables: ${starships.consumables} <br />
        Hyperdrive Rating: ${starships.hyperdrive_rating} <br />
        MGLT: ${starships.MGLT} <br />
        Starship Class: ${starships.starship_class} <br />`;
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);
      props.forEach(item => {
        if (starships[item] != null && starships[item].length != 0) {
          linksList
            .appendChild(links(starships[item], item))
            .setAttribute("class", "result__info-list__item");
        }
      });
    };

    buildStarship(data);
    searchResultField.appendChild(article);
  });
}

export function clear(target) {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
}