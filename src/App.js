import React from "react";
import { Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import ArticlePage from "./pages/ArticlePage/ArticlePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import AboutPage from "./pages/AboutPage/AboutPage";

import Nav from "./components/Nav/Nav";
import Search from "./components/Search/Search";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: { query: "", limit: 10, batch: 1 } };
    this.proxy = new URL("https://cors-anywhere.herokuapp.com/");
    this.originApi = new URL("https://starcraft.fandom.com/api/v1/");
    this.history = createBrowserHistory({ forceRefresh: true });
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

  makeArticleCall = () => {
    const pageId = "";
    console.log("clicked");
    return 5;
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
        this.history.push({
          pathname: `/search/${this.state.searchQuery.query}`,
          state: { ...this.state.result },
          // makeArticleQuery: { ...this.makeArticleCall },
        });
        this.forceUpdate();
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

  pingHistory = () => {
    console.log(this.history);
  };

  render() {
    console.log("props from App", this.props);
    console.log(this.history);
    return (
      <div className="App">
        <Nav />
        <Search
          {...this.state}
          makeSearchCall={this.makeSearchCall}
          handleQueryInput={this.handleQueryInput}
          handleLimitInput={this.handleLimitInput}
          handleForm={this.handleForm}
          abort={this.abort}
        />
        <button onClick={this.pingHistory}>history?</button>
        <Switch>
          <Route
            // history={this.history}
            path="/search/:id"
            component={SearchPage}
            {...this.props}
          />
          <Route path="/wiki/:id" component={ArticlePage} />
          <Route path="/about" component={AboutPage} />
          <Route exact path="/" component={HomePage} />
        </Switch>
      </div>
    );
  }
}

export default App;
