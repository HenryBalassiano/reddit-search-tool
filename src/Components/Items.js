import "../styles/Items.css";
import Loader from "./Loader";
import { useRef, useState } from "react";
function Items({
  api,
  query,
  errorMessage,
  error,
  data,
  setMore,
  minimizeR,
  showResults,
}) {
  const results = useRef(false);
  const showMore = useRef();
  const description = useRef();

  const more = () => {
    setMore(true);
  };
  console.log(api);
  return (
    <div id={`item-${minimizeR ? "hover" : "parent"}`} ref={showResults}>
      <h1 ref={error}> {errorMessage} &#128546; </h1>
      {api.map((e, i) => {
        const months = {
          Jan: "1",
          Feb: "2",
          Mar: "3",
          Apr: "4",
          May: "5",
          Jun: "6",
          Jul: "7",
          Aug: "8",
          Sep: "9",
          Oct: "10",
          Nov: "11",
          Dec: "12",
        };
        const date = new Date(e.created_utc * 1000);
        const postDate = date.toString();

        const num = months[postDate.slice(4, 7)];
        if (!e) {
          return <Loader key={i} />;
        }

        let permalink;
        if (e.permalink) {
          permalink = e.permalink;
        } else {
          permalink = `/comments/${e.link_id.split("_")[1]}/_/${e.id}`;
        }

        let currentDate =
          num + "/" + postDate.slice(8, 10) + "/" + postDate.slice(11, 15);
        if (api.length > 0 && results) {
          return (
            <div
              className="parent"
              id={`results-${minimizeR ? "minimize" : "maximize"}`}
              key={i}
            >
              <div id="left-panel">
                {" "}
                {query === "Submissions" ? (
                  <img loading="lazy" src={e.url} />
                ) : (
                  ""
                )}
                <span>/r/{e.subreddit}</span>
                <span>/u/{e.author}</span>
              </div>{" "}
              <div id="right-panel">{currentDate}</div>
              <div id="child">
                {" "}
                <a
                  href={e.full_link || `https://reddit.com${permalink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  <div id="title">{e.title}</div>
                  <p id="body">
                    {e.body}
                    {e.selftext}
                  </p>
                </a>
              </div>
            </div>
          );
        } else {
          return <Loader key={i} />;
        }
      })}
    </div>
  );
}

export default Items;
