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
  // fix utc paramsObj bug

  if (paramsObj.before && !/^\d+$/.test(paramsObj.before)) {
    paramsObj.before = Math.floor(new Date(paramsObj.before).getTime() / 1000);
  } else {
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
  let before;

  function miserURL(id) {
    query.replace(/^[^?]+\?/, "");
    return `https://archivesort.org/discuss/reddit/miser?type=${id}&${query}`;
  }
  function pushshiftURL(id) {
    query.replace(/^[^?]+\?/, "");

    return `https://api.pushshift.io/reddit/search/${id}/?${query}${
      before ? "&" + before : ""
    }&html_decode=true`;
  }
  console.log(query, paramsObj.before);

  const apiObj = {
    pushshift: function fetchPushshift() {
      try {
        apiData([false]);
        Promise.all(
          value.map((id) =>
            fetch(pushshiftURL(id)).then(function (response) {
              console.info(response.url);
              return response.json();
            })
          )
        ).then(function (data) {
          if (value.length == 1) {
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
                apiData(requestData);
              }
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    loadMorePushshift: function loadMore() {
      try {
        Promise.all(
          value.map((id) =>
            fetch(pushshiftURL(id)).then(function (response) {
              console.log(response.url);
              return response.json();
            })
          )
        ).then(function (data) {
          if (value.length == 1) {
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
      for (let key in api) {
        if (api[key].domain) {
          ids.push(`t3_${api[key].id}`);
        } else {
          ids.push(`t1_${api[key].id}`);
        }
      }

      let idTags = ids.join(",");
      const postIdChunks = [];
      for (let i = 0; i < ids.length; i += 100) {
        const chunk = ids.slice(i, i + 100);
        postIdChunks.push(chunk);
      }

      try {
        if (JSON.parse(window.sessionStorage.getItem("reddit_access_token"))) {
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
                console.info("fetched reddit data");
                console.info(response.url);
                return response.json();
              })
            )
          ).then(function (redditData) {
            for (var i = 0; i < redditData.length; i++) {
              let dataRed = redditData[i].data.children;
              for (let apiKeys in api) {
                for (let redditKeys in dataRed) {
                  if (api[apiKeys].id === dataRed[redditKeys].data.id) {
                    api[apiKeys].upvote_ratio =
                      dataRed[redditKeys].data.upvote_ratio;
                    api[apiKeys].kind = dataRed[redditKeys].kind;
                    if (
                      (dataRed[redditKeys].data.author === "[deleted]" &&
                        dataRed[redditKeys].data.body === "[deleted]") ||
                      (dataRed[redditKeys].data.author === "[deleted]" &&
                        dataRed[redditKeys].data.selftext === "[deleted]")
                    ) {
                      api[apiKeys].is_deleted = "deleted";
                    } else if (
                      dataRed[redditKeys].data.body === "[removed]" ||
                      dataRed[redditKeys].data.selftext === "[removed]"
                    ) {
                      api[apiKeys].is_deleted = "removed";
                    }
                  }
                }
              }
              console.log(redditData, "Reddit Data");
              setSyncingData(true);
              console.info("synced with reddit");
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  };

  console.log(api);

  // ----- fix bug where it cant request more than 100
  // make it work with loadmore
  // fix max at 200 and add details on requests on loading screen
  // add all flairs and the rest of the design features
  // fix bugs
  // reddit api search
  // FIX ALL bugs
  // filter search for detled/removed

  // you should be able to create flairs for deleted/ removed posts and be able to add a search option for such

  if (!search && apis !== "Miser") {
    apiObj.pushshift();
    redditObj.tokenAuth();
    setSearch(true);
    error.current.style.display = "none";
  }
  let once = false;
  if (api[0] && apis !== "reddit" && !once) {
    redditObj.syncData();
    once = true;
  }
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
      } else if (data.size === api.length) {
        const utc = api.slice(-1)[0].created_utc;

        paramsObj.before
          ? (paramsObj.before = utc)
          : (query += "&before=" + utc);

        console.log(query);

        apiObj.loadMorePushshift();

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
  });

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
