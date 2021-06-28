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
    username: false,
    subreddit: false,
    query: false,
    numReturned: 100,
    score: false,
    before: false,
    after: false,
    searchTerm: false,
  });
  const [api, apiData] = useState([]);
  const [search, setSearch] = useState(true);
  const [more, setMore] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [minimizeR, setMinimizeR] = useState(false);

  const [home, setHome] = useState(false);
  const [about, setAbout] = useState(false);
  const [settings, setSettings] = useState(false);

  const [submission, setSubmission] = useState(false);
  const [comment, setComment] = useState(false);

  const [errorMessage, setError] = useState();

  const showResults = useRef(false);
  const showFava = useRef(false);
  const history = createHistory();

  const [locationKeys, setLocationKeys] = useState([]);

  // reload page when back button pressed
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

  const error = useRef(null);
  let query = "";
  let type = "Any";
  let next = "";
  let before = "";
  let after = "";

  if (data.username) {
    query += "author=" + data.username.replace(/\s/g, "") + "&";
  }
  if (data.subreddit) {
    query += "subreddit=" + data.subreddit.replace(/\s/g, "") + "&";
  }
  if (data.searchTerm) {
    query += "q=" + data.searchTerm.replace(/\s/g, "") + "&";
  }
  if (data.numReturned) {
    query += "size=" + data.numReturned + "&";
  }

  if (data.query.length > 0) {
    type = data.query.toLowerCase().slice(0, -1);
  }

  if (data.before) {
    before +=
      "before=" + Math.floor(new Date(data.before).getTime() / 1000) + "&";
    next = "";
  }
  if (data.after) {
    after += "after=" + Math.floor(new Date(data.after).getTime() / 1000) + "&";
  }
  if (data.score) {
    query += "score=>" + data.score + "&";
  }

  // make another function that makes 2 requests to api
  // get data from both requets, push to array, sort by date, and then set state to array
  async function fetchData() {
    try {
      apiData([false]);

      const response = await fetch(
        `https://api.pushshift.io/reddit/search/${type}/?${query}${after}${before}${next}`
      );
      const data = await response.json();

      if (data.data.length === 0) {
        setError("No data!");
        error.current.style.display = "block";
      } else {
        error.current.style.display = "none";
      }
      apiData(data.data);
    } catch (err) {
      console.log(err);
      console.log("sb");
    }
  }
  async function fetchAny() {
    try {
      apiData([false]);

      const submission = await fetch(
        `https://api.pushshift.io/reddit/search/submission/?${query}${after}${before}${next}`
      );
      const comment = await fetch(
        `https://api.pushshift.io/reddit/search/comment/?${query}${after}${before}${next}`
      );
      const data1 = await submission.json();
      const data2 = await comment.json();

      if (data1.data.length === 0) {
        setError("No data!");
        error.current.style.display = "block";
      } else {
        error.current.style.display = "none";
      }
      Promise.all([...data2.data, ...data1.data]).then((requestData) => {
        requestData.sort(function (a, b) {
          return new Date(b.retrieved_on) > new Date(a.retrieved_on) ? 1 : -1;
        });
        apiData(requestData);
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (!search && type !== "Any") {
    fetchData();
    error.current.style.display = "none";

    setSearch(true);
  } else if (!search && type === "Any") {
    error.current.style.display = "none";

    fetchAny();
    setSearch(true);
  }

  if (more) {
    const utc = api.slice(-1)[0].created_utc;
    next += "before=" + utc + "&";
    before = "";
    after = "";

    // fetchData();
    setMore(false);
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
  return (
    <Router basename={process.env.PUBLIC_URL} forceRefresh>
      <div className="App">
        <div id="logo-parent">
          <div id="logo">
            <NavLink to="/" activeClassName="none" exact>
              <h1 id="logo-text">
                <i class="fa fa-reddit-alien" id="icon" aria-hidden="true"></i>{" "}
                Reddit Search Tool <br />{" "}
              </h1>{" "}
            </NavLink>
            <h2 id="pushift-descript">
              <a href="https://pushshift.io/" target="_blank">
                Utilizing Pushift.io
              </a>
            </h2>
          </div>{" "}
        </div>{" "}
        <header>
          <nav>
            <ul>
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
            </ul>
          </nav>
        </header>
        <Switch>
          {" "}
          <Route path="/" exact render>
            <div id="search-form">
              <div id="form-wrapper">
                <div className="panel-header">
                  <h2 id="search-min" onClick={changeQuerySize}>
                    Search Query{" "}
                    <i
                      onClick={changeQuerySize}
                      class={`fa fa-${minimize ? "plus" : "minus"}-square`}
                      aria-hidden="true"
                    ></i>
                  </h2>
                </div>

                <SearchForm
                  minimize={minimize}
                  setSearch={setSearch}
                  search={search}
                  updateData={setData}
                  setMinimize={setMinimize}
                  showResults={showResults}
                  showFava={showFava}
                />
              </div>
            </div>
            <div id="items-parent" ref={showFava}>
              <div>
                <div id="results-header">
                  <h2 id="results-min" onClick={changeResultsSize}>
                    Results - {api.length > 0 ? data.numReturned : 0}{" "}
                    <i
                      onClick={changeResultsSize}
                      class={`fa fa-${minimizeR ? "plus" : "minus"}-square`}
                      aria-hidden="true"
                    ></i>
                  </h2>
                </div>

                <Items
                  api={api}
                  query={data.query}
                  minimizeR={minimizeR}
                  errorMessage={errorMessage}
                  error={error}
                  data={setData}
                  setMore={setMore}
                  showResults={showResults}
                  size={data.numReturned}
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
