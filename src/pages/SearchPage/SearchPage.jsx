import React from "react";

import ResultItemsList from "../../components/ResultItemsList/ResultItemsList";

// expected URL /search/:id
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.location.state };
    this.controller = new AbortController();
    this.signal = this.controller.signal;
    this.proxy = new URL("https://cors-anywhere.herokuapp.com/");
    this.originApi = new URL("https://starcraft.fandom.com/api/v1/");
  }

  showState = () => {
    console.log("state", this.state);
    console.log("props", this.props);
    console.log(this.props.location);
  };

  abort = () => {
    console.log("Now aborting");
    // Abort.
    this.controller.abort();
  };

  makeSearchCall = () => {
    // const { query, limit, batch } = this.state.searchQuery;
    const searchApi = new URL(this.originApi + "Search/List");
    searchApi.searchParams.set("query", this.props.match.params.id);
    searchApi.searchParams.set("limit", 10);
    searchApi.searchParams.set("batch", 1);

    const searchQuery = new URL(this.proxy + searchApi);
    this.apiCall(searchQuery);
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
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.makeSearchCall();
  }

  componentWillUnmount() {
    this.abort();
  }

  render() {
    console.log("this.state from SearchPage", this.state);
    console.log("this.props from SearchPage", this.props);
    return (
      <div>
        <button onClick={this.showState}>click</button>
        <p>Article {this.state.batches}</p>
        <ResultItemsList
          makeArticleQuery={this.props.location.makeArticleQuery}
          items={this.state}
          query={this.props.match.params.id}
        />
      </div>
    );
  }
}

export default SearchPage;
