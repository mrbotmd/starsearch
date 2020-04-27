import React from "react";
import ResultItem from "../../components/ResultItemsList/ResultItem/ResultItem";

// expected URL /wiki/:id
class ArticlePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.controller = new AbortController();
    this.signal = this.controller.signal;
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
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        console.log(`Fetch complete. (Not aborted)`, res);
        return res;
      })
      .then((data) => this.setState({ result: { ...data } }))
      .then(() => console.log(this.state))
      .catch((err) => console.log(err));
  };

  showState = () => {
    console.log(this.state);
    console.log(this.props);
    console.log(this.props.location.state);
  };

  abort = () => {
    console.log("Now aborting");
    // Abort.
    this.controller.abort();
  };

  componentDidMount() {
    this.setState(
      {
        ...this.props.location.state,
      },
      () => {
        console.log(this.state);
      }
    );
  }

  componentWillUnmount() {
    this.abort();
  }

  render() {
    return (
      <div>
        <p>Article {this.state.batches}</p>

        <button onClick={this.showState}>click</button>
        <ResultItem items={this.state.result} />
      </div>
    );
  }
}

export default ArticlePage;
