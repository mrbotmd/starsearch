import React from "react";

import SearchForm from "./SearchForm/SearchForm";

import "./Search.style.scss";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.state };
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }

  showState = () => {
    console.log(this.state);
    console.log(this.props);
    console.log(this.props.history);
  };

  render() {
    console.log("this.state from Search", this.state);
    console.log("this.props from Search", this.props);
    return (
      <div>
        <SearchForm {...this.props} state={this.state.searchQuery} />
      </div>
    );
  }
}

export default Search;
