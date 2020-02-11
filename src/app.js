"use strict";
const searchResultField = document.querySelector(".search__result");
const optionSelector = document.querySelector(".search__option-selector");
const searchBtn = document.querySelector(".search__btn");
const queryObject = document.querySelector(".search__input");
const rootURL = "https://swapi.co/api/";
searchBtn.addEventListener("click", search);
document.querySelector("form").addEventListener("submit", search);

async function search(e) {
  e.preventDefault();
  let result = await searchQuery();
  build(result);
}

async function apiCall(url) {
  console.log(url);
  try {
    const res = await fetch(url);
    console.log("raw res", res);
    const data = await res.json();
    console.log("data from fetch", data);
    console.log(data);
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
    } else return data;
  } catch (err) {
    if (err) {
      let errorMessage = document.createElement("p");
      errorMessage.setAttribute("class", "api-error");
      errorMessage.textContent =
        "Sorry, we coudn't reach the server. Try again.";
      searchResultField.appendChild(errorMessage);
    }
  }
}

function searchQuery() {
  if (queryObject.value) {
    return apiCall(
      `${rootURL}${optionSelector.value}/?search=${queryObject.value.replace(
        /\s/g,
        "-"
      )}`
    );
  } else {
    return apiCall(`${rootURL}${optionSelector.value}/`);
  }
}

function build(data) {
  let propList = [
    "characters",
    "films",
    "homeworld",
    "species",
    "vehicles",
    "starships"
  ];
  clear();
  console.log(data);
  buildPaginator(data);
  buildResultForm(data, propList);
}

function buildPaginator(data) {
  function callPage(tag, url) {
    tag.addEventListener("click", async function() {
      let result = await apiCall(url);
      build(result);
    });
  }
  // build only next and previous pages
  function buildNPPages(data) {
    let nextPage = document.createElement("a");
    let prevPage = document.createElement("a");
    nextPage.setAttribute("href", "#/");
    prevPage.setAttribute("href", "#/");
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
  }
  buildNPPages(data);

  // Build all the pages at once
  function buildAllPages(data) {
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
  }
}

async function call(data) {
  console.log(data);
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
  let result = await call(data);
  build(result);
}

async function showLinks(data) {
  let parentElement = data.target.parentElement;
  let element = data.target;
  let linkData = await call(data);
  console.log(linkData.dataset);
  let ul = document.createElement("ul");
  linkData.forEach(item => {
    let linkListItem = document.createElement("a");
    if (element.text == "films") {
      linkListItem.textContent = item.title;
      linkListItem.setAttribute("data-apilink", item);
      let linkLi = links(item.url, item.title);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage);
      ul.appendChild(linkLi);
    } else {
      let linkLi = links(item.url, item.name);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage);
      linkListItem.textContent = item.name;
      linkListItem.setAttribute("data-apilink", item);
      console.log(linkLi);
      ul.appendChild(linkLi);
    }
  });
  parentElement.appendChild(ul);
}

function links(option, optionName) {
  let listItem = document.createElement("li");
  let linkTag = document.createElement("a");
  linkTag.setAttribute("href", "#/");
  linkTag.setAttribute("data-apilink", option);
  linkTag.addEventListener("click", showLinks);
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
      if (optionSelector.value == key) {
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
    optionSelector.value = "people";
    let buildCharacter = character => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

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
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (character[item] != null && character[item].length != 0) {
          linksList.appendChild(links(character[item], item));
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
    optionSelector.value = "films";
    let buildFilm = films => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

      h1.textContent = films.title;
      h1.setAttribute("data-apilink", films.url);
      h1.addEventListener("click", buildNewPage);
      div.setAttribute("class", "container--flex");
      p.innerHTML = `
        Title: ${films.title} <br />
        Episode: ${films.episode_id} <br />
        Opening crawl: ${films.opening_crawl} <br />
        Director: ${films.director} <br />
        Producer: ${films.producer} <br />
        Release Date: ${films.release_date} <br />`;
      img.setAttribute("src", randomImg);
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);
      props.forEach(item => {
        if (films[item] != null && films[item].length != 0) {
          linksList.appendChild(links(films[item], item));
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
    optionSelector.value = "planets";
    let buildPlanet = planets => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

      h1.textContent = planets.name;
      h1.setAttribute("data-apilink", planets.url);
      h1.addEventListener("click", buildNewPage);
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
      img.setAttribute("src", randomImg);
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (planets[item] != null && planets[item].length != 0) {
          linksList.appendChild(links(planets[item], item));
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
    optionSelector.value = "species";
    let buildSpecies = species => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

      h1.textContent = species.name;
      h1.setAttribute("data-apilink", species.url);
      h1.addEventListener("click", buildNewPage);
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
      img.setAttribute("src", randomImg);
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (species[item] != null && species[item].length != 0) {
          linksList.appendChild(links(species[item], item));
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
    optionSelector.value = "vehicles";
    let buildVehicle = vehicles => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

      h1.textContent = vehicles.name;
      h1.setAttribute("data-apilink", vehicles.url);
      h1.addEventListener("click", buildNewPage);
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
        Vehicle Class: ${vehicles.vehicles_class} <br />`;
      img.setAttribute("src", randomImg);
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);

      props.forEach(item => {
        if (vehicles[item] != null && vehicles[item].length != 0) {
          linksList.appendChild(links(vehicles[item], item));
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
    optionSelector.value = "starships";
    let buildStarship = starships => {
      let img = document.createElement("img");
      let randomImg = "https://source.unsplash.com/random/150x150";
      let p = document.createElement("p");
      let linksList = document.createElement("ul");
      linksList.setAttribute("class", "link-list");
      let li = document.createElement("li");
      let articleHeader = document.createElement("header");
      let h1 = document.createElement("h1");
      let div = document.createElement("div");

      h1.textContent = starships.name;
      h1.setAttribute("data-apilink", starships.url);
      h1.addEventListener("click", buildNewPage);
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
        Starship Class: ${starships.starships_class} <br />`;
      img.setAttribute("src", randomImg);
      articleHeader.appendChild(h1);
      article.appendChild(articleHeader);
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(p);
      div.appendChild(linksList);
      props.forEach(item => {
        if (starships[item] != null && starships[item].length != 0) {
          linksList.appendChild(links(starships[item], item));
        }
      });
    };

    buildStarship(data);
    searchResultField.appendChild(article);
  });
}

function clear() {
  while (searchResultField.firstChild) {
    searchResultField.removeChild(searchResultField.firstChild);
  }
}
