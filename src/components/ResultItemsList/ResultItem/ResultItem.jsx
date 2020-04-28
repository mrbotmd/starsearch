import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./ResultItem.style.scss";

const ResultItem = (props) => {
  console.log("props from resultItem", props);
  const history = useHistory();
  console.log(history);
  const { items } = props.items;

  console.log(items);
  return (
    <div>
      {items.map((item) => {
        const regexTag = new RegExp(`(<([^>]+)>)`, "gmi");
        const cleanSnippet = item.snippet.replace(regexTag, "");
        const regexTitle = new RegExp(props.query, "gmi");
        const tagedSnippet = cleanSnippet.replace(
          regexTitle,
          `<span class="match">${props.query}</span>`
        );

        return (
          <div key={item.id}>
            <Link onClick={props.makeArticleCall} to={{}}>
              {item.title}
            </Link>

            <p dangerouslySetInnerHTML={{ __html: tagedSnippet }}></p>
          </div>
        );
      })}
    </div>
  );
};

export default ResultItem;
