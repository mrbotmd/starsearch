import React from "react";
import { Link } from "react-router-dom";

import "./Search.style.scss";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: { query: "", limit: 25, batch: 1 } };
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    // this.history = useHistory();
  }
  makeSearchQuery = (query, limit, batch = 1) => {
    const proxy = new URL("https://cors-anywhere.herokuapp.com/");
    const originApi = new URL(
      "https://starcraft.fandom.com/api/v1/Search/List"
    );
    originApi.searchParams.set("query", query);
    originApi.searchParams.set("limit", limit);
    originApi.searchParams.set("batch", batch);

    return new URL(proxy + originApi);
  };

  apiCall = () => {
    const { query, limit, batch } = this.state.searchQuery;
    const temp = new URL(this.makeSearchQuery(query, limit, batch));
    console.log("fetching");
    // console.log(temp.search);
    console.log(temp);
    fetch(temp, { method: "get", signal: this.signal })
      .then((res) => res.json())
      .then((res) => {
        console.log(`Fetch complete. (Not aborted)`);
        return res;
      })
      .then((data) => this.setState({ result: { ...data } }))
      // .then(() => console.log(this.state))
      .then(() => {
        this.props.history.push(`/wiki/${this.state.searchQuery.query}`);
        this.props.history.location.state = { ...this.state.result };
      })
      .catch((err) => console.log(err));
  };

  abort = () => {
    console.log("Now aborting");
    // Abort.
    this.controller.abort();
  };

  buildPaginator = () => {
    const pages = [];
    for (let i = 1; i < this.state.batches; i++) {
      pages.push(i);
    }
    return (
      <div>
        {pages.map((page, i) => (
          <Link to={`/${page}`} key={i}>
            {page}
          </Link>
        ))}
      </div>
    );
  };

  handleInput = (e) => {
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

  showState = () => {
    console.log(this.state);
    console.log(this.props);
    console.log(this.props.history);
  };

  render() {
    return (
      <div>
        <button onClick={this.apiCall}>fetch</button>
        <button onClick={this.abort}>abort</button>
        <button onClick={this.showState}>Search component state</button>
        <Link
          onClick={this.apiCall}
          to={{
            //   pathname: `/wiki/${this.state.searchQuery.query}`,
            state: this.state,
          }}
        >
          {this.state.searchQuery.query}
        </Link>
        <form action="" onSubmit={this.handleInput}>
          <input type="text" name="" id="" onChange={this.handleInput} />
        </form>
      </div>
    );
  }
}

export default Search;
