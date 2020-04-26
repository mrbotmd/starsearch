import React from "react";

import "./homepage.styles.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.searchInput = "";
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

  tempCall = () => {
    const temp = new URL(this.makeSearchQuery("zealot", 25, 1));
    console.log(temp.search);
    console.log(temp);
    fetch(temp)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
    // .then((data) => this.setState({ ...data }))
    // .then(console.log(this.state));
  };
  render() {
    return (
      <div className="container">
        <button onClick={this.tempCall}>call</button>
        <p>{this.state.page}</p>
      </div>
    );
  }
}

export default HomePage;
