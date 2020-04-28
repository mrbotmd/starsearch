import React from "react";
import Nav from "../../components/Nav/Nav";
import Search from "../../components/Search/Search";

// expected URL /wiki/:id
class ArticlePage extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <Search />
      </div>
    );
  }
}

export default ArticlePage;
