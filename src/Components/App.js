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
    type: false,
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
  let type = "Any";
  let next = "";

  if (data.type.length > 0) {
    type = data.type.toLowerCase().slice(0, -1);
  }

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
  if (paramsObj.before) {
    paramsObj.before = Math.floor(new Date(paramsObj.before).getTime() / 1000);
  }

  var esc = encodeURIComponent;
  var query = Object.keys(paramsObj)
    .map((k) => esc(k) + "=" + esc(paramsObj[k]))
    .join("&");
  let pushshiftURL = `https://api.pushshift.io/reddit/search/${type}/?${query}&html_decode=true`;
  async function fetchData() {
    try {
      apiData([false]);

      const response = await fetch(pushshiftURL);
      const data = await response.json();

      if (data.data.length === 0) {
        setError("No Results");
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
        `https://api.pushshift.io/reddit/search/submission/?${query}&html_decode=true`
      );
      const comment = await fetch(
        `https://api.pushshift.io/reddit/search/comment/?${query}&html_decode=true`
      );
      const data1 = await submission.json();
      const data2 = await comment.json();
      console.log(data1, data2, submission.url);
      if (data1.data.length === 0) {
        setError("No Results");
        error.current.style.display = "block";
      } else {
        error.current.style.display = "none";
      }
      Promise.all([...data2.data, ...data1.data]).then((requestData) => {
        requestData.sort(function (a, b) {
          return new Date(b.created_utc) > new Date(a.created_utc) ? 1 : -1;
        });
        apiData(requestData);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function loadMore() {
    try {
      const utc = api.slice(-1)[0].created_utc;
      next += "before=" + utc + "&";
      const submission = await fetch(
        `https://api.pushshift.io/reddit/search/submission/?${query}&${next}&html_decode=true`
      );
      const comment = await fetch(
        `https://api.pushshift.io/reddit/search/comment/?${query}&${next}&html_decode=true`
      );

      const data1 = await submission.json();
      const data2 = await comment.json();
      console.log(data1, data2, submission.url, comment, "LOAD MORR");

      if (data1.data.length === 0) {
        setError("No Results");
        error.current.style.display = "block";
      } else {
        error.current.style.display = "none";
      }
      Promise.all([...data2.data, ...data1.data]).then((requestData) => {
        requestData.sort(function (a, b) {
          return new Date(b.created_utc) > new Date(a.created_utc) ? 1 : -1;
        });
        apiData((prevArray) => [...prevArray, ...requestData]);
        setLoadingMessage(false);
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (!search && type !== "Any" && type !== "an") {
    fetchData();
    error.current.style.display = "none";
    setSearch(true);
  } else if ((!search && type === "Any") || (!search && type === "an")) {
    error.current.style.display = "none";

    fetchAny();
    setSearch(true);
  }

  useEffect(() => {
    if (more) {
      if (data.size < api.length) {
        data.size += 25;
        setMore(false);
        setLoadingMessage(false);
      } else if (data.size === api.length) {
        loadMore();
        setLoadingMessage(true);
      }
    }
  });
  console.log(more, data.size, api.length);

  let resultAmt = 0;
  if (api.length === 1 && !api[0]) {
    resultAmt = 0;
  } else if (api.length < data.size) {
    resultAmt = api.length;
  } else {
    resultAmt = data.size;
  }

  console.log(api, data.size);

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
