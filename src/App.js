import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import ArticlePage from "./pages/ArticlePage/ArticlePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import AboutPage from "./pages/AboutPage/AboutPage";

import Nav from "./components/Nav/Nav";
import Search from "./components/Search/Search";

function App() {
  return (
    <div className="App">
      <Nav />
      <Search />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/wiki/:id" component={ArticlePage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/about" component={AboutPage} />
      </Switch>
    </div>
  );
}

export default App;
