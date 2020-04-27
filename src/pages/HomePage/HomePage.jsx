import React from "react";

import "./HomePage.styles.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showState = () => {
    console.log(this.state);
    console.log(this.props);
    // console.log(this.history);
  };

  render() {
    return (
      <div className="container">
        <button onClick={this.showState}>HomePage state</button>
      </div>
    );
  }
}

export default HomePage;
