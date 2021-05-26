import { useEffect, useState, useRef } from "react";
import "../styles/App.css";
import SearchForm from "./SearchForm";
import Items from "./Items";
import SlideToggle from "react-slide-toggle";

function App() {
  const [data, setData] = useState({
    username: false,
    subreddit: false,
    query: false,
    numReturned: false,
    score: false,
    before: false,
    after: false,
    searchTerm: false,
  });
  const [api, apiData] = useState([]);
  const [search, setSearch] = useState(true);
  const [more, setMore] = useState(false);
  const [minimize, setMinimize] = useState(false);

  const [errorMessage, setError] = useState();
  const error = useRef(null);
  let query = "";
  let type = "comment";
  let next = "";
  let before = "";
  let after = "";

  if (data.username) {
    query += "author=" + data.username + "&";
  }
  if (data.subreddit) {
    query += "subreddit=" + data.subreddit + "&";
  }
  if (data.searchTerm) {
    query += "q=" + data.searchTerm + "&";
  }
  if (data.numReturned) {
    query += "size=" + data.numReturned + "&";
  }

  if (data.query.length > 0) {
    type = data.query.toLowerCase().slice(0, -1);
  }

  if (data.before) {
    before += "before=" + Math.floor(data.before.getTime() / 1000) + "&";
    next = "";
  }
  if (data.after) {
    after += "after=" + Math.floor(data.after.getTime() / 1000) + "&";
  }
  if (data.score) {
    query += "score=>" + data.score + "&";
  }
  async function fetchData() {
    try {
      apiData([false]);

      const response = await fetch(
        `https://api.pushshift.io/reddit/search/${type}/?${query}${after}${before}${next}`
      );
      const data = await response.json();
      if (data.data.length === 0) {
        setError("Hey! That doesn't exist!");
        error.current.style.display = "block";
      } else {
        error.current.style.display = "none";
      }
      apiData(data.data);
    } catch (err) {
      console.log(err);
    }
  }
  if (search === false) {
    fetchData();
    error.current.style.display = "none";

    setSearch(true);
  }

  if (more) {
    const utc = api.slice(-1)[0].created_utc;
    next += "before=" + utc + "&";
    before = "";
    after = "";

    fetchData();
    setMore(false);
  }
  function changeQuerySize() {
    setMinimize(true);
    if (minimize) {
      setMinimize(false);
    }
  }
  return (
    <div className="App">
      <a
        href="https://github.com/HenryBalassiano/reddit-search-engine"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          style={{
            fill: "#FD6C6C",
            color: "#fff",
            position: "absolute",
            top: 0,
            border: 0,
            right: 0,
          }}
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{ "transform-origin": "130px 106px" }}
            className="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a>{" "}
      <div id="form-wrapper">
        <div className="panel-header">
          <h2 id="search-min">
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
        />
      </div>
      <br />
      <div id="items-parent">
        <Items
          api={api}
          query={data.query}
          errorMessage={errorMessage}
          error={error}
          data={setData}
          setMore={setMore}
        />
      </div>
    </div>
  );
}

export default App;
