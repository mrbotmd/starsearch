import { searchResultField, apiCall, build } from "../app";

export function buildPaginator(data) {
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
