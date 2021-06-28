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
  size,
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
      {api.slice(0, size).map((e, i) => {
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
        function timeSince(date) {
          var seconds = Math.floor((new Date() - date) / 1000);

          var interval = seconds / 31536000;

          if (interval > 1) {
            return Math.floor(interval) + " years";
          }
          interval = seconds / 2592000;
          if (interval > 1) {
            return Math.floor(interval) + " months";
          }
          interval = seconds / 86400;
          if (interval > 1) {
            return Math.floor(interval) + " days";
          }
          interval = seconds / 3600;
          if (interval > 1) {
            return Math.floor(interval) + " hours";
          }
          interval = seconds / 60;
          if (interval > 1) {
            return Math.floor(interval) + " minutes";
          }
          return Math.floor(seconds) + " seconds";
        }

        const num = months[postDate.slice(4, 7)];

        if (!e) {
          return (
            <div id="loader-wrapper">
              <Loader key={i} />{" "}
              <div id="loading-text">Loading &#8226; Results </div>{" "}
            </div>
          );
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
              <div className="details">
                {" "}
                <div className="image-parent">
                  {e.domain ? (
                    <div id="image-child">
                      {e.thumbnail !== "self" &&
                      e.thumbnail !== "default" &&
                      e.thumbnail !== "nsfw" &&
                      e.thumbnail !== "image" &&
                      e.thumbnail !== "spoiler" ? (
                        <div
                          id="image"
                          style={{
                            backgroundImage: `url(${
                              e.url.substring(e.url.length - 3) === "bmp" ||
                              e.url.substring(e.url.length - 3) === "jpg" ||
                              e.url.substring(e.url.length - 3) === "png" ||
                              e.url.substring(e.url.length - 3) === "gif"
                                ? e.url
                                : e.thumbnail
                            })`,
                          }}
                        ></div>
                      ) : (
                        ""
                      )}
                      {(e.thumbnail === "default" &&
                        e.domain.slice(0, 4) === "self") ||
                      e.thumbnail === "self" ? (
                        <div id="self-post">
                          <i
                            className="fa fa-file-text-o"
                            aria-hidden="true"
                          ></i>
                        </div>
                      ) : (
                        ""
                      )}
                      {e.thumbnail === "nsfw" || e.thumbnail === "spoiler" ? (
                        <div id="nsfw">
                          <i
                            className="fa fa-user-secret"
                            aria-hidden="true"
                          ></i>
                        </div>
                      ) : (
                        ""
                      )}

                      {(e.domain.slice(0, 4) !== "self" &&
                        e.thumbnail === "default") ||
                      (e.thumbnail !== "nsfw" && e.thumbnail === "image") ? (
                        <div id="link-post">
                          <i class="fa fa-link" aria-hidden="true"></i>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <div id="align-vertically">
                    <div id="details-child">
                      {e.title ? (
                        <h3 id="title">
                          {e.title} <a id="domain">({e.domain})</a>
                        </h3>
                      ) : (
                        ""
                      )}
                      <a>{e.domain ? "submitted" : "commented"} by </a>
                      <a className="author">u/{e.author}</a>
                      <a title={new Date(postDate)}>
                        {" "}
                        {timeSince(new Date(postDate))} ago in{" "}
                      </a>
                      <a className="subreddit">r/{e.subreddit}</a>
                      <div id="upvote">
                        <i class="fa fa-arrow-up" aria-hidden="true">
                          {" "}
                          <span id="score">{e.score}</span>
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                {e.body || e.selftext ? (
                  <div id="body-parent">
                    <p id="body">
                      {e.body}
                      {e.selftext}
                    </p>
                  </div>
                ) : (
                  false
                )}
                <div className="footer">
                  <div id="view-on-reddit">
                    <a
                      href={e.full_link || `https://reddit.com${permalink}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      view on reddit
                    </a>
                  </div>
                  <div id="view-on-reddit">
                    <a
                      href={`https://www.removeddit.com${permalink}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      view on removeddit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Items;
