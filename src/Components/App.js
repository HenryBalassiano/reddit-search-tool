import { useEffect, useState, useRef } from "react";
import "../styles/App.css";
import SearchForm from "./SearchForm";
import Items from "./Items";
import About from "./About";
import Settings from "./Settings";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory,
} from "react-router-dom";
import createHistory from "history/createBrowserHistory";

function App() {
  const pRetry = require("p-retry");
  const [data, setData] = useState({
    author: false,
    subreddit: false,
    type: "any",
    size: 100,
    score: false,
    before: false,
    after: false,
    q: false,
    is_self: false,
    id: false,
    link_id: false,
  });
  const [api, apiData] = useState([]);
  const [search, setSearch] = useState(true);
  const [more, setMore] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [minimizeR, setMinimizeR] = useState(false);
  const [syncingData, setSyncingData] = useState(false);
  const [syncingReddit, setSyncingReddit] = useState(false);

  const [apis, setApi] = useState();
  const [idState, setIdState] = useState();

  const [requests, setRequests] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const [queueState, setQueue] = useState();

  const [home, setHome] = useState(false);
  const [about, setAbout] = useState(false);
  const [settings, setSettings] = useState(false);

  const [errorMessage, setError] = useState();

  const [loadingMessage, setLoadingMessage] = useState();

  const [toggleInput, setToggleInput] = useState();

  const showResults = useRef(false);
  const slider = useRef(false);

  const showFava = useRef(false);
  const history = createHistory();
  const [locationKeys, setLocationKeys] = useState([]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === "PUSH") {
        setLocationKeys([location.key]);
      }

      if (history.action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);
          window.location.reload();
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          window.location.reload();
        }
      }
    });
  }, [locationKeys]);

  useEffect(() => {
    let persistAPIState = window.localStorage.getItem("API");
    if (persistAPIState) {
      setApi(persistAPIState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("API", apis);
  });
  const error = useRef(null);
  let next = "";

  const parseParams = (querystring) => {
    const params = new URLSearchParams(querystring);
    const obj = {};
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }

    return obj;
  };

  const paramsObj = parseParams(window.location.search);

  if (paramsObj.before && !/^\d+$/.test(paramsObj.before)) {
    paramsObj.before = Math.floor(new Date(paramsObj.before).getTime() / 1000);
  }
  if (paramsObj.size > 100) {
    paramsObj.size = 100;
  }
  var esc = encodeURIComponent;
  var query = Object.keys(paramsObj)
    .map((k) => esc(k) + "=" + esc(paramsObj[k]))
    .join("&");

  let value;
  let apiURL = "";

  if (paramsObj.type == "any" || paramsObj.type == "Any" || !paramsObj.type) {
    value = ["submission", "comment"];
  } else {
    value = paramsObj.type
      ? paramsObj.type.toLowerCase().slice(0, -1).split(" ")
      : "";
  }
  let before = paramsObj.before ? "" : "";
  function miserURL(id) {
    query.replace(/^[^?]+\?/, "");
    return `https://archivesort.org/discuss/reddit/miser?type=${id}&${query}`;
  }
  function pushshiftURL(id, before) {
    query.replace(/^[^?]+\?/, "");

    return `https://api.pushshift.io/reddit/search/${id}/?${query}${
      before ? `&before=${before}` : ""
    }&html_decode=true`;
  }
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  async function fetchManyCalls() {
    try {
      const queue = [];
      const apiDatas = [];
      let formula = data.size / 100;
      let getbeforeDec = formula.toString().split(".")[0];
      let beforeDec = parseInt(getbeforeDec, 10);
      let fetchAmt = 0;
      let afterDec = formula.toString().split(".")[1]
        ? formula.toString().split(".")[1]
        : "";
      let numAfterDec = parseFloat(
        afterDec.length > 1 ? afterDec : afterDec + "0",
        10
      );
      let afterDecValue = numAfterDec;
      console.log(afterDecValue);
      if (value.length === 1) {
        console.log(fetchAmt, beforeDec, data.size);
        while (fetchAmt !== beforeDec) {
          if (queue.length > 0) {
            before = queue.slice(-1)[0];
          }

          console.info("fetching pushshift > 100");
          setRequests((counter) => counter + 1);

          let response = await fetch(pushshiftURL(value[0], before));

          console.info(response.url);

          let responseData = await response.json();

          if (responseData.data.length === 0) {
            if (apiDatas.length === 0) {
              console.info("break");
              setError("No Results");
              error.current.style.display = "block";
              break;
            } else {
              break;
            }
          }

          if (responseData.data.length > 0) {
            setItemCount((counter) => counter + responseData.data.length);
          }
          queue.push(responseData.data.slice(-1)[0].created_utc);
          apiDatas.push(responseData.data);

          fetchAmt += 1;
          console.info("cooldown between request");
          await timer(1500);
        }
        if (afterDecValue && value.length == 1) {
          console.info("fetching rest of data");
          setRequests((counter) => counter + 1);
          before = queue.slice(-1)[0];

          let moreResponse = await fetch(
            `https://api.pushshift.io/reddit/search/${
              value[0]
            }/?${query.replace(/size=\d+/, `size=${afterDecValue}`)}${
              before ? `&before=${before}` : ""
            }&html_decode=true`
          );

          console.info(moreResponse.url);

          let moreResponseData = await moreResponse.json();

          setItemCount((counter) => counter + moreResponseData.data.length);
          apiDatas.push(moreResponseData.data);
        }
      } else if (value.length > 1) {
        console.log(fetchAmt, beforeDec, data.size);
        while (fetchAmt !== beforeDec) {
          if (queue.length > 0) {
            before = queue.slice(-1)[0];
          }
          console.info("fetching pushshift > 100");
          setRequests((counter) => counter + 1);
          let submission = await fetch(
            pushshiftURL("submission", paramsObj.before ? "" : before)
          );
          let comment = await fetch(
            pushshiftURL("comment", paramsObj.before ? "" : before)
          );
          if (comment.status === 404) {
            throw new pRetry.AbortError(comment.statusText);
          }
          console.info(comment.url);
          console.info(submission.url);

          let commentData = await comment.json();
          let submissionData = await submission.json();
          let requestData = submissionData
            ? submissionData.data.concat(commentData.data)
            : "";
          let sortedRequest = requestData
            ? requestData.sort((a, b) => {
                return b.created_utc - a.created_utc;
              })
            : "";
          if (
            commentData.data.length === 0 &&
            submissionData.data.length === 0
          ) {
            if (apiDatas.length === 0) {
              console.info("break");
              setError("No Results");
              error.current.style.display = "block";
              break;
            } else {
              break;
            }
          }
          if (sortedRequest) {
            apiDatas.push(sortedRequest);
            queue.push(sortedRequest.slice(-1)[0].created_utc);
            setItemCount((counter) => counter + sortedRequest.length);
          }

          fetchAmt += 1;
          console.info("cooldown between request");
          await timer(1500);
        }

        if (afterDecValue && value.length > 1) {
          console.info("fetching rest of data");
          setRequests((counter) => counter + 1);
          before = queue.slice(-1)[0];

          let moreSub = await fetch(
            `https://api.pushshift.io/reddit/search/submission/?${query.replace(
              /size=\d+/,
              `size=${afterDecValue}`
            )}${before ? `&before=${before}` : ""}&html_decode=true`
          );
          let moreCom = await fetch(
            `https://api.pushshift.io/reddit/search/comment/?${query.replace(
              /size=\d+/,
              `size=${afterDecValue}`
            )}${before ? `&before=${before}` : ""}&html_decode=true`
          );
          console.info(moreSub.url);
          console.info(moreCom.url);

          let moreCommentData = await moreCom.json();
          let moreSubmissionData = await moreSub.json();

          let newData = moreSubmissionData
            ? moreSubmissionData.data.concat(moreCommentData.data)
            : "";
          let sortedMoreData = newData
            ? newData.sort((a, b) => {
                return b.created_utc - a.created_utc;
              })
            : "";
          setItemCount((counter) => counter + sortedMoreData.length);

          apiDatas.push(sortedMoreData);
        }
      }
      {
        setQueue(apiDatas.concat.apply([], apiDatas));
        queue.length = 0;
        apiDatas.length = 0;
      }
    } catch (err) {
      console.error(err);
    }
  }
  const apiObj = {
    pushshift: function fetchPushshift() {
      try {
        if (!more) {
          apiData([false]);
        }
        if (data.size <= 100) {
          Promise.all(
            value.map((id) =>
              fetch(pushshiftURL(id, before)).then(function (response) {
                console.info(response.url);
                console.info("fetching <= 100");
                setRequests(requests + 1);

                return response.json();
              })
            )
          ).then(function (data) {
            if (value.length == 1) {
              setQueue(data[0].data);
              if (data[0].data.length === 0) {
                setError("No Results");
                error.current.style.display = "block";
              } else {
                error.current.style.display = "none";
              }
              setItemCount((counter) => counter + data[0].data.length);
            } else {
              Promise.all([...data[0].data, ...data[1].data]).then(
                (requestData) => {
                  requestData.sort(function (a, b) {
                    return new Date(b.created_utc) - new Date(a.created_utc);
                  });
                  if (requestData.length === 0) {
                    setError("No Results");
                    error.current.style.display = "block";
                  } else {
                    error.current.style.display = "none";
                  }
                  setItemCount((counter) => counter + requestData.length);

                  setQueue(requestData);
                }
              );
            }
          });
        } else if (data.size > 100) {
          fetchManyCalls();
        }
      } catch (err) {
        console.log(err);
      }
    },
    miser: function fetchMiser() {
      try {
        apiData([false]);
        let newValue;
        let newArrValue = [];
        for (var i = 0; i < value.length; i++) {
          newValue = value[i] += "s";
          newArrValue.push(newValue);
        }
        Promise.all(
          newArrValue.map((id) =>
            fetch(miserURL(id)).then(function (response) {
              console.info(response.url);
              return response.json();
            })
          )
        ).then(function (data) {
          if (newArrValue.length == 1) {
            apiData(data[0].data);
          } else {
            Promise.all([...data[0].data, ...data[1].data]).then(
              (requestData) => {
                requestData.sort(function (a, b) {
                  return new Date(b.created_utc) - new Date(a.created_utc);
                });
                if (requestData.length === 0) {
                  setError("No Results");
                  error.current.style.display = "block";
                } else {
                  error.current.style.display = "none";
                }
                console.info(requestData, "ITWOR");

                apiData(requestData);
              }
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    loadMoreMiser: function loadMoreMis() {
      try {
        let newValue;
        let newArrValue = [];
        for (var i = 0; i < value.length; i++) {
          newValue = value[i] += "s";
          newArrValue.push(newValue);
        }
        Promise.all(
          value.map((id) =>
            fetch(miserURL(id)).then(function (response) {
              console.log(response.url);
              return response.json();
            })
          )
        ).then(function (data) {
          if (newArrValue.length == 1) {
            apiData((prevArray) => [...prevArray, ...data[0].data]);
          } else {
            Promise.all([...data[0].data, ...data[1].data]).then(
              (requestData) => {
                requestData.sort(function (a, b) {
                  return new Date(b.created_utc) - new Date(a.created_utc);
                });
                apiData((prevArray) => [...prevArray, ...requestData]);
                setLoadingMessage(false);
              }
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
  };

  function timeDifference(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  const redditObj = {
    tokenAuth: async function fetchToken() {
      let CLIENT_ID = "hiXFGUDKexlKL2LKEoyK6g";
      let SECRET_KEY = "PiXF-PgFhhX1dRk57ha_-dvDdQwYwg";
      let currentToken = window.sessionStorage.getItem("reddit_access_token")
        ? JSON.parse(window.sessionStorage.getItem("reddit_access_token"))
        : false;

      let currentTime = new Date();
      // only fetch new token if there isn't a token in sessionStorage or if it's been an hour since the last token was recieved
      if (
        !currentToken ||
        timeDifference(
          new Date(currentToken.retrieved_at),
          new Date(currentTime)
        ) >= 1
      ) {
        console.info("fetching a reddit access token > valid for 3600");
        const tokenResponse = await fetch(
          "https://www.reddit.com/api/v1/access_token",
          {
            method: "post",
            headers: {
              Authorization: "Basic " + btoa(`${CLIENT_ID}:${SECRET_KEY}`),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=https://oauth.reddit.com/grants/installed_client&device_id=DO_NOT_TRACK_THIS_DEVICE",
          }
        );
        console.info(tokenResponse.url);

        const token_data = await tokenResponse.json();

        if (token_data.access_token) {
          // put access token in sessionStorage and document the time it was recieved
          var retrievedTokenTime = new Date();
          token_data.retrieved_at = retrievedTokenTime;
          window.sessionStorage.setItem(
            "reddit_access_token",
            JSON.stringify(token_data)
          );
          console.log(token_data.access_token, "TOKEN");
        } else {
          console.error("4xx error access token not recieved");
        }
      } else {
        console.info("Using access token from sessionStorage");
      }
    },
    syncData: function syncPushshiftData() {
      let ids = [];
      for (let key in queueState) {
        if (queueState[key].domain) {
          ids.push(`t3_${queueState[key].id}`);
        } else {
          ids.push(`t1_${queueState[key].id}`);
        }
      }
      let idTags = ids.join(",");
      const postIdChunks = [];
      for (let i = 0; i < ids.length; i += 100) {
        const chunk = ids.slice(i, i + 100);
        postIdChunks.push(chunk);
      }

      try {
        if (
          JSON.parse(window.sessionStorage.getItem("reddit_access_token")) &&
          queueState
        ) {
          let token = JSON.parse(
            window.sessionStorage.getItem("reddit_access_token")
          ).access_token;
          Promise.all(
            postIdChunks.map((id) =>
              fetch(`https://oauth.reddit.com/api/info?id=${id.join(",")}`, {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }).then(function (response) {
                return response.json();
              })
            )
          ).then(function (redditData) {
            if (queueState) {
              for (var i = 0; i < redditData.length; i++) {
                let dataRed = redditData[i].data.children;
                for (let apiKeys in queueState) {
                  for (let redditKeys in dataRed) {
                    if (
                      queueState[apiKeys].id === dataRed[redditKeys].data.id
                    ) {
                      queueState[apiKeys].upvote_ratio =
                        dataRed[redditKeys].data.upvote_ratio;
                      queueState[apiKeys].kind = dataRed[redditKeys].kind;
                      if (
                        (dataRed[redditKeys].data.author === "[deleted]" &&
                          dataRed[redditKeys].data.body === "[deleted]") ||
                        (dataRed[redditKeys].data.author === "[deleted]" &&
                          dataRed[redditKeys].data.selftext === "[deleted]")
                      ) {
                        queueState[apiKeys].is_deleted = "deleted";
                      } else if (
                        dataRed[redditKeys].data.body === "[removed]" ||
                        dataRed[redditKeys].data.selftext === "[removed]"
                      ) {
                        queueState[apiKeys].is_deleted = "removed";
                      }
                    }
                  }
                }
                console.info("synced with reddit");
                ids.length = 0;
              }
              if (!more) {
                apiData(queueState);
                setSyncingData(true);
              } else if (more) {
                console.log("mere");
                apiData((prevArray) => [...prevArray, ...queueState]);
              }
            }
          });
          if (queueState.length === 0) {
            setSyncingData(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  };
  // add all flairs and the rest of the design features, issticky, deleted, removed,locked, nsfw, moderator, sub flairs,
  // fix bugs
  // reddit api search
  // filter search for detled/removed
  // add clear

  if (!search && apis !== "Miser") {
    apiObj.pushshift();
    redditObj.tokenAuth();

    setSearch(true);
    error.current.style.display = "none";
  }
  useEffect(() => {
    let once = false;

    if ((queueState && !once) || more) {
      redditObj.syncData();
      once = true;
    }
  }, [queueState]);

  if (!search && apis === "Miser") {
    apiObj.miser();
    setSearch(true);
    error.current.style.display = "none";
  }

  useEffect(() => {
    if (more && apis !== "Miser") {
      if (data.size < api.length) {
        data.size += 25;
        setMore(false);

        setLoadingMessage(false);
      } else if (data.size === api.length || data.size > api.length) {
        const utc = api.slice(-1)[0].created_utc;

        before = utc;

        console.log(query);

        apiObj.pushshift();

        setLoadingMessage(true);
      }
    }
    if (more && apis === "Miser") {
      if (data.size < api.length) {
        data.size += 25;
        setMore(false);
        setLoadingMessage(false);
      } else if (data.size === api.length) {
        const utc = api.slice(-1)[0].created_utc;

        paramsObj.before
          ? (paramsObj.before = utc)
          : (query += "&before=" + utc);

        console.log(query);

        apiObj.loadMoreMiser();
        setLoadingMessage(true);
      }
    }
  }, [more, api]);
  let resultAmt = 0;
  if (api.length === 1 && !api[0]) {
    resultAmt = 0;
  } else if (api.length < data.size) {
    resultAmt = api.length;
  } else {
    resultAmt = data.size;
  }

  function changeQuerySize() {
    setMinimize(true);
    if (minimize) {
      setMinimize(false);
    }
  }
  function changeResultsSize() {
    setMinimizeR(true);
    if (minimizeR) {
      setMinimizeR(false);
    }
  }
  function toggleMode(e) {
    let theme = "";
    if (e.target.checked) {
      theme = "light";
      setToggleInput(true);
    } else {
      theme = "dark";
      setToggleInput(false);
    }
    localStorage.setItem("theme", theme);
  }
  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      slider.current.checked = true;
      setToggleInput(true);
    } else {
      slider.current.checked = false;
      setToggleInput(false);
    }
  });

  useEffect(() => {
    if (toggleInput) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [toggleInput]);
  console.log(api);
  return (
    <Router basename={process.env.PUBLIC_URL} forceRefresh>
      <div className="App">
        <div id="logo-parent">
          <div id="logo">
            <NavLink to="/" activeClassName="none" exact>
              <h1 id="logo-text">
                <i
                  className="fa fa-reddit-alien"
                  id="icon"
                  aria-hidden="true"
                ></i>{" "}
                Reddit Search Tool <br />{" "}
              </h1>{" "}
            </NavLink>
            <h2 id="pushift-descript">
              <a
                className={toggleInput ? "light-pushift" : ""}
                href="https://pushshift.io/"
                target="_blank"
              >
                Utilizing Pushift.io
              </a>{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
        <header>
          {" "}
          <nav>
            {" "}
            <div className="container">
              <ul>
                {" "}
                <li>
                  <NavLink
                    to="/"
                    activeClassName="active"
                    className="non-active"
                    exact
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    activeClassName="active"
                    className="non-active"
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    activeClassName="active"
                    className="non-active"
                  >
                    Settings
                  </NavLink>
                </li>
              </ul>{" "}
              <div id="container-parent">
                <label id="switch" className="switch">
                  <input
                    type="checkbox"
                    id="slider"
                    onChange={toggleMode}
                    ref={slider}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </nav>
        </header>
        <Switch>
          {" "}
          <Route path="/" exact render>
            <div id="search-form">
              <div id="form-wrapper">
                <SearchForm
                  minimize={minimize}
                  setSearch={setSearch}
                  search={search}
                  updateData={setData}
                  setMinimize={setMinimize}
                  showResults={showResults}
                  showFava={showFava}
                  changeQuerySize={changeQuerySize}
                  toggleInput={toggleInput}
                  setApi={setApi}
                  apis={apis}
                  syncingData={syncingData}
                />
              </div>
            </div>
            <div id="items-parent" ref={showFava}>
              <div>
                <Items
                  api={api}
                  query={data.query}
                  minimizeR={minimizeR}
                  errorMessage={errorMessage}
                  error={error}
                  data={setData}
                  setMore={setMore}
                  showResults={showResults}
                  size={data.size}
                  loadingMessage={loadingMessage}
                  searchTerm={data.q}
                  changeResultsSize={changeResultsSize}
                  resultAmt={resultAmt}
                  toggleInput={toggleInput}
                  syncingData={syncingData}
                  requests={requests}
                  itemCount={itemCount}
                />
              </div>
            </div>
          </Route>{" "}
          <Route path="/about">
            <div>
              <About />
            </div>
          </Route>
          <Route path="/settings">
            {" "}
            <div>
              <Settings />
            </div>
          </Route>
        </Switch>
      </div>{" "}
    </Router>
  );
}

export default App;
