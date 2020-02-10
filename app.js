"use strict";
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
      `${rootURL}${optionSelector.value}/?search=${queryObject.value.replace(
        /\s/g,
        "-"
      )}`
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
  console.log(linkData.dataset);
  let ul = document.createElement("ul");
  linkData.forEach(item => {
    let linkListItem = document.createElement("a");
    if (element.text == "films") {
      linkListItem.textContent = item.title;
      linkListItem.setAttribute("data-apilink", item);
      let linkLi = links(item.url, item.title);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage, { once: true });
      ul.appendChild(linkLi);
    } else {
      let linkLi = links(item.url, item.name);
      linkLi.firstChild.removeEventListener("click", showLinks);
      linkLi.firstChild.addEventListener("click", buildNewPage, { once: true });
      linkListItem.textContent = item.name;
      linkListItem.setAttribute("data-apilink", item);
      console.log(linkLi);
      ul.appendChild(linkLi);
    }
  });
  parentElement.appendChild(ul);
};

let links = (option, optionName) => {
  // if (option.length) {
  let listItem = document.createElement("li");
  let linkTag = document.createElement("a");
  console.log(option);
  linkTag.setAttribute("href", "#/");
  linkTag.setAttribute("data-apilink", option);
  linkTag.addEventListener("click", showLinks, { once: true });
  linkTag.textContent = optionName;
  listItem.appendChild(linkTag);
  return listItem;
  // }
  // return;
};

let buildResultForm = data => {
  console.log(data);
  let typeCheck = (obj, objURL) => {
    if (objURL.includes("people")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildCharacterForm(item);
        });
      } else {
        buildCharacterForm(obj);
      }
    } else if (objURL.includes("films")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildFilmForm(item);
        });
      } else {
        buildFilmForm(obj);
      }
    } else if (objURL.includes("planets")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildPlanetForm(item);
        });
      } else {
        buildPlanetForm(obj);
      }
    } else if (objURL.includes("species")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildSpeciesForm(item);
        });
      } else {
        buildSpeciesForm(obj);
      }
    } else if (objURL.includes("vehicles")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildVehiclesForm(item);
        });
      } else {
        buildVehiclesForm(obj);
      }
    } else if (objURL.includes("starships")) {
      if (obj instanceof Array) {
        console.log(obj);
        obj.forEach(item => {
          buildStarshipsForm(item);
        });
      } else {
        buildStarshipsForm(obj);
      }
    }
  };
  if (data.output === undefined) {
    let item = data;
    let itemURL = data.url;
    return typeCheck(item, itemURL);
  } else {
    let item = data.output;
    let itemURL = data.output[0].url;
    return typeCheck(item, itemURL);
  }
};

let buildCharacterForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "people";
  let buildCharacter = character => {
    this.character = character;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
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
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(linksList);
    if (character.films !== null && character.films.length != 0) {
      linksList.appendChild(links(character.films, filmsList));
    }
    if (character.homeworld !== null && character.homeworld.length != 0) {
      linksList.appendChild(links(character.homeworld, homeworldList));
    }
    if (character.species !== null && character.species.length != 0) {
      linksList.appendChild(links(character.species, speciesList));
    }
    if (character.vehicles !== null && character.vehicles.length != 0) {
      linksList.appendChild(links(character.vehicles, vehiclesList));
    }
    if (character.starships !== null && character.starships.length != 0) {
      linksList.appendChild(links(character.starships, starshipsList));
    }
  };

  buildCharacter(data);
  searchResultField.appendChild(article);
};

let buildFilmForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "films";
  let buildFilm = films => {
    this.film = films;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let charactersList = Object.keys(film)[6];
    let planetsList = Object.keys(film)[7];
    let starshipsList = Object.keys(film)[8];
    let vehiclesList = Object.keys(film)[9];
    let speciesList = Object.keys(film)[10];

    h1.textContent = film.title;
    h1.setAttribute("data-apilink", film.url);
    h1.addEventListener("click", buildNewPage);
    div.setAttribute("class", "container--flex");
    p.innerHTML = `
        Title: ${film.title} <br />
        Episode: ${film.episode_id} <br />
        Opening crawl: ${film.opening_crawl} <br />
        Director: ${film.director} <br />
        Producer: ${film.producer} <br />
        Release Date: ${film.release_date} <br />`;
    img.setAttribute("src", randomImg);
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(linksList);
    if (film.characters !== null && film.characters.length != 0) {
      linksList.appendChild(links(film.characters, charactersList));
    }
    if (film.planets !== null && film.planets.length != 0) {
      linksList.appendChild(links(film.planets, planetsList));
    }
    if (film.species !== null && film.species.length != 0) {
      linksList.appendChild(links(film.species, speciesList));
    }
    if (film.vehicles !== null && film.vehicles.length != 0) {
      linksList.appendChild(links(film.vehicles, vehiclesList));
    }
    if (film.starships !== null && film.starships.length != 0) {
      linksList.appendChild(links(film.starships, starshipsList));
    }
  };

  buildFilm(data);
  searchResultField.appendChild(article);
};

let buildPlanetForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "planets";
  let buildPlanet = planets => {
    this.planet = planets;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let residentsList = Object.keys(planet)[9];
    let filmsList = Object.keys(planet)[10];

    h1.textContent = planet.name;
    h1.setAttribute("data-apilink", planet.url);
    h1.addEventListener("click", buildNewPage);
    div.setAttribute("class", "container--flex");
    p.innerHTML = `
        Title: ${planet.name} <br />
        Rotation Period: ${planet.rotation_period} <br />
        Orbital Period: ${planet.orbital_period} <br />
        Diameter: ${planet.diameter} <br />
        Climate: ${planet.climate} <br />
        Gravity: ${planet.gravity} <br />
        Terrain: ${planet.terrain} <br />
        Surface Water: ${planet.surface_water} <br />
        Population: ${planet.population} <br />`;
    img.setAttribute("src", randomImg);
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(linksList);
    if (planet.residents !== null && planet.residents.length != 0) {
      linksList.appendChild(links(planet.residents, residentsList));
    }
    if (planet.films !== null && planet.films.length != 0) {
      linksList.appendChild(links(planet.films, filmsList));
    }
  };

  buildPlanet(data);
  searchResultField.appendChild(article);
};

let buildSpeciesForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "species";
  let buildSpecies = species => {
    this.species = species;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let homeworldList = Object.keys(species)[8];
    let peopleList = Object.keys(species)[10];
    let filmsList = Object.keys(species)[11];

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
    console.log(species.homeworld);
    if (species.homeworld !== null && species.homeworld.length != 0) {
      linksList.appendChild(links(species.homeworld, homeworldList));
    }
    if (species.people !== null && species.people.length != 0) {
      linksList.appendChild(links(species.people, peopleList));
    }
    if (species.films !== null && species.films.length != 0) {
      linksList.appendChild(links(species.films, filmsList));
    }
  };

  buildSpecies(data);
  searchResultField.appendChild(article);
};

let buildVehiclesForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "vehicles";
  let buildVehicle = vehicles => {
    this.vehicle = vehicles;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let pilotsList = Object.keys(vehicle)[11];
    let filmsList = Object.keys(vehicle)[12];

    h1.textContent = vehicle.name;
    h1.setAttribute("data-apilink", vehicle.url);
    h1.addEventListener("click", buildNewPage);
    div.setAttribute("class", "container--flex");
    p.innerHTML = `
        Title: ${vehicle.name} <br />
        Model: ${vehicle.model} <br />
        Manufacturer: ${vehicle.manufacturer} <br />
        Cost In Creditst: ${vehicle.cost_in_credits} <br />
        Length: ${vehicle.length} <br />
        Max Atmosphering Speed: ${vehicle.max_atmosphering_speed} <br />
        Crew: ${vehicle.crew} <br />
        Passengers: ${vehicle.passengers} <br />
        Cargo Capacity: ${vehicle.cargo_capacity} <br />
        Consumables: ${vehicle.consumables} <br />
        Vehicle Class: ${vehicle.vehicle_class} <br />`;
    img.setAttribute("src", randomImg);
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(linksList);
    if (vehicle.pilots !== null && vehicle.pilots.length != 0) {
      linksList.appendChild(links(vehicle.pilots, pilotsList));
    }
    if (vehicle.films !== null && vehicle.films.length != 0) {
      linksList.appendChild(links(vehicle.films, filmsList));
    }
  };

  buildVehicle(data);
  searchResultField.appendChild(article);
};

let buildStarshipsForm = data => {
  let article = document.createElement("article");
  optionSelector.value = "starships";
  let buildStarship = starships => {
    this.starship = starships;
    let img = document.createElement("img");
    let randomImg = "https://source.unsplash.com/random/150x150";
    let p = document.createElement("p");
    let linksList = document.createElement("ul");
    linksList.setAttribute("class", "link-list");
    let li = document.createElement("li");
    let articleHeader = document.createElement("header");
    let h1 = document.createElement("h1");
    let div = document.createElement("div");
    let pilotsList = Object.keys(starship)[13];
    let filmsList = Object.keys(starship)[14];

    h1.textContent = starship.name;
    h1.setAttribute("data-apilink", starship.url);
    h1.addEventListener("click", buildNewPage);
    div.setAttribute("class", "container--flex");
    p.innerHTML = `
        Title: ${starship.name} <br />
        Model: ${starship.model} <br />
        Manufacturer: ${starship.manufacturer} <br />
        Cost In Creditst: ${starship.cost_in_credits} <br />
        Length: ${starship.length} <br />
        Max Atmosphering Speed: ${starship.max_atmosphering_speed} <br />
        Crew: ${starship.crew} <br />
        Passengers: ${starship.passengers} <br />
        Cargo Capacity: ${starship.cargo_capacity} <br />
        Consumables: ${starship.consumables} <br />
        Hyperdrive Rating: ${starship.hyperdrive_rating} <br />
        MGLT: ${starship.MGLT} <br />
        Starship Class: ${starship.starship_class} <br />`;
    img.setAttribute("src", randomImg);
    articleHeader.appendChild(h1);
    article.appendChild(articleHeader);
    article.appendChild(div);
    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(linksList);
    if (starship.pilots !== null && starship.pilots.length != 0) {
      linksList.appendChild(links(starship.pilots, pilotsList));
    }
    if (starship.films !== null && starship.films.length != 0) {
      linksList.appendChild(links(starship.films, filmsList));
    }
  };

  buildStarship(data);
  searchResultField.appendChild(article);
};

async function search() {
  let result = await searchQuery();
  build(result);
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
