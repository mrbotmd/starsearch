import React from "react";
import SearchForm from "./SearchForm/SearchForm";

import "./Search.style.scss";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: { query: "", limit: 10, batch: 1 } };
    this.proxy = new URL("https://cors-anywhere.herokuapp.com/");
    this.originApi = new URL("https://starcraft.fandom.com/api/v1/");
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }

  makeSearchCall = () => {
    const { query, limit, batch } = this.state.searchQuery;
    const searchApi = new URL(this.originApi + "Search/List");
    searchApi.searchParams.set("query", query);
    searchApi.searchParams.set("limit", limit);
    searchApi.searchParams.set("batch", batch);

    const searchQuery = new URL(this.proxy + searchApi);
    this.apiCall(searchQuery);
  };

  makeArticleQuery = () => {
    const pageId = "";
    console.log("clicked");
  };

  apiCall = (url) => {
    console.log("fetching");

    fetch(url, { method: "get", signal: this.signal })
      .then((res) => res.json())
      .then((res) => {
        console.log(`Fetch complete. (Not aborted)`);
        return res;
      })
      .then((data) => this.setState({ result: { ...data } }))
      .then(() => {
        this.props.history.push({
          pathname: `/search/${this.state.searchQuery.query}`,
          state: { ...this.state.result },
          makeArticleQuery: { ...this.makeArticleQuery },
        });
      })
      .catch((err) => console.log(err));
  };

  abort = () => {
    console.log("Now aborting");
    // Abort.
    this.controller.abort();
  };

  handleQueryInput = (e) => {
    e.preventDefault();
    this.setState(
      {
        searchQuery: {
          ...this.state.searchQuery,
          query: e.target.value,
        },
      }
      // () => console.log(this.state)
    );
  };
  handleLimitInput = (e) => {
    e.preventDefault();
    this.setState(
      {
        searchQuery: {
          ...this.state.searchQuery,
          limit: e.target.value,
        },
      }
      // () => console.log(this.state)
    );
  };
  handleForm = (e) => {
    e.preventDefault();
    this.makeSearchCall();
  };

  showState = () => {
    console.log(this.state);
    console.log(this.props);
    console.log(this.props.history);
  };

  render() {
    return (
      <div>
        <SearchForm
          makeSearchCall={this.makeSearchCall}
          handleQueryInput={this.handleQueryInput}
          handleLimitInput={this.handleLimitInput}
          handleForm={this.handleForm}
          abort={this.abort}
          showState={this.showState}
          state={this.state.searchQuery}
        />
      </div>
    );
  }
}

export default Search;
