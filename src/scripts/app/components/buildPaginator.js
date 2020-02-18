import { searchResultField, apiCall, build, isFetchFailed } from "../app";

export function buildPaginator(data) {
  function callPage(tag, url) {
    tag.addEventListener("click", async function() {
      let result = await apiCall(url);
      if (result === undefined) {
        return isFetchFailed(result);
      }
      build(result);
    });
  }
  // build only next and previous pages
  function buildNPPages(data) {
    let paginator = document.createElement("div");
    let nextPage = document.createElement("a");
    let prevPage = document.createElement("a");
    paginator.setAttribute("class", "paginator");
    nextPage.setAttribute("href", "#/");
    nextPage.setAttribute("class", "paginator__link");
    prevPage.setAttribute("href", "#/");
    prevPage.setAttribute("class", "paginator__link");
    if (data.next && data.previous) {
      prevPage.textContent = "Prev Page";
      nextPage.textContent = "Next Page";
      paginator.appendChild(prevPage);
      paginator.appendChild(nextPage);
      searchResultField.appendChild(paginator);
      callPage(prevPage, data.previous);
      callPage(nextPage, data.next);
      return nextPage, prevPage;
    } else if (data.next) {
      nextPage.textContent = "Next Page";
      paginator.appendChild(nextPage);
      searchResultField.appendChild(paginator);
      callPage(nextPage, data.next);
      return nextPage;
    } else if (!data.next && data.previous) {
      prevPage.textContent = "Prev Page";
      paginator.appendChild(prevPage);
      searchResultField.appendChild(paginator);
      callPage(prevPage, data.previous);
      return prevPage;
    } else {
      return;
    }
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
