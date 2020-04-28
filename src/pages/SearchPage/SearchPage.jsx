import React from "react";
import ResultItemsList from "../../components/ResultItemsList/ResultItemsList";
import Nav from "../../components/Nav/Nav";
import Search from "../../components/Search/Search";

// expected URL /search/:id
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.location.state };
    this.controller = new AbortController();
    this.signal = this.controller.signal;
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

  componentWillUnmount() {
    this.abort();
  }

  render() {
    return (
      <div>
        <Nav />
        <Search />
        <p>Article {this.state.batches}</p>

        <button onClick={this.showState}>click</button>
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
