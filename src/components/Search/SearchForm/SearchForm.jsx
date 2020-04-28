import React from "react";
import { Link } from "react-router-dom";

import "./SearchForm.style.scss";

const SearchForm = (props) => {
  console.log(props);
  const options = [10, 25, 50];
  return (
    <div>
      <button onClick={props.makeSearchCall}>fetch</button>
      <button onClick={props.abort}>abort</button>
      <button onClick={props.showState}>Search component state</button>
      <Link
        onClick={props.makeSearchCall}
        to={
          {
            //   pathname: `/wiki/${this.state.searchQuery.query}`,
            // state: this.state,
          }
        }
      >
        {props.state.query}
      </Link>
      <form action="" onSubmit={props.handleForm}>
        <input type="text" name="" id="" onChange={props.handleQueryInput} />

        <select onChange={props.handleLimitInput}>
          {options.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </form>
    </div>
  );
};

export default SearchForm;
