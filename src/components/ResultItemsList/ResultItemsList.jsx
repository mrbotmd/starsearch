import React from "react";

import ResultItem from "./ResultItem/ResultItem";

import "./ResultItemsList.style.scss";

const ResultItemsList = (props) => {
  console.log("props form resultList", props);
  return (
    <section>
      <p>result</p>
      <ResultItem {...props} />
    </section>
  );
};

export default ResultItemsList;
