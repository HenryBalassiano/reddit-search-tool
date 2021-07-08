import { useEffect, useState, useRef, useReducer } from "react";
import "../styles/searchForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm({
  updateData,
  setSearch,
  minimize,
  setMinimize,
  search,
  showResults,
  showFava,
  changeQuerySize,
  toggleInput,
}) {
  const advancedRow = useRef();
  const apiAdvanced = useRef();
  const developerRow = useRef();

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

  const [userinput, setUserInput] = useState({
    author: paramsObj.author ? paramsObj.author : "",
    subreddit: paramsObj.subreddit ? paramsObj.subreddit : "",
    type: paramsObj.type ? paramsObj.type : "",
    size: parseInt(paramsObj.size) ? parseInt(paramsObj.size) : 25,
    score: paramsObj.score ? paramsObj.score : "",
    before: paramsObj.before
      ? Math.floor((new Date(paramsObj.before).getTime() / 1000) * 1000)
      : "",
    after: paramsObj.after
      ? Math.floor((new Date(paramsObj.after).getTime() / 1000) * 1000)
      : "",
    q: paramsObj.searchTerm ? paramsObj.searchTerm : "",
    over_18: paramsObj.over_18 ? paramsObj.over_18 : "",
    stickied: paramsObj.stickied ? paramsObj.stickied : "",
    is_self: paramsObj.is_self ? paramsObj.is_self : "",
    locked: paramsObj.locked ? paramsObj.locked : "",
    distinguished: paramsObj.distinguished ? paramsObj.distinguished : "",
    id: paramsObj.id ? paramsObj.id : "",
    link_id: paramsObj.link_id ? paramsObj.link_id : "",
  });

  const Search = (e) => {
    updateData(userinput);
    e.preventDefault();
    setSearch(false);
    setMinimize(true);
    showFava.current.style.display = "flex";

    showResults.current.style.display = "block";

    var esc = encodeURIComponent;
    var str = "";

    for (var key in userinput) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(userinput[key]);
      str = str.replace(/[^=&]+=(&|$)/g, "").replace(/&$/, "");

      window.location.search = str;
    }
  };

  function fetchDataWhenQuery() {
    updateData(userinput);
    setSearch(false);
    setMinimize(true);
    showFava.current.style.display = "flex";
    showResults.current.style.display = "block";
  }

  useEffect(() => {
    let done = false;
    function callOnce() {
      if (window.location.search && !done) {
        done = true;
        fetchDataWhenQuery();
      }
    }
    callOnce();
  }, []);
  console.log(paramsObj);
  useEffect(() => {
    if (localStorage.getItem("setting1") === "checked") {
      advancedRow.current.style.display = "flex";
      apiAdvanced.current.style.display = "block";
    }
    if (localStorage.getItem("setting2") === "checked") {
      developerRow.current.style.display = "flex";
    }
  });
  return (
    <div
      id={`${minimize ? "search-query-minimized" : "search-query-maximized"}`}
    >
      {" "}
      <div className="panel-header">
        <h2
          id="search-min"
          onClick={changeQuerySize}
          className={toggleInput ? "light-search-tag" : ""}
        >
          Search Query{" "}
          <i
            onClick={changeQuerySize}
            class={`fa fa-${minimize ? "plus" : "minus"}-square`}
            aria-hidden="true"
          ></i>
        </h2>
      </div>
      <div
        id={`form-${minimize ? "hover" : "parent"}`}
        onClick={minimize ? changeQuerySize : ""}
        className={toggleInput ? "light-form" : ""}
      >
        <div id={toggleInput ? "form-light" : "form"}>
          <form
            onSubmit={Search}
            class={`form-${minimize ? "minimize" : "maximize"}`}
          >
            <div id="row-1">
              <div className="row-wrapper">
                <label>username</label>
                <input
                  value={userinput.author}
                  placeholder="Username"
                  type="text"
                  onChange={(e) => {
                    setUserInput({ ...userinput, author: e.target.value });
                  }}
                  id="username-input"
                ></input>{" "}
              </div>
              <div className="row-wrapper">
                <label>subreddit</label>
                <input
                  value={userinput.subreddit}
                  placeholder="Subreddit"
                  type="text"
                  onChange={(e) => {
                    setUserInput({ ...userinput, subreddit: e.target.value });
                  }}
                  id="subreddit-input"
                ></input>{" "}
              </div>
              <div className="row-wrapper">
                <label id="search-for-input">search for</label>
                <select
                  onChange={(e) => {
                    setUserInput({ ...userinput, type: e.target.value });
                  }}
                >
                  {" "}
                  <option>Any</option>
                  <option>Comments</option>
                  <option>Submissions</option>
                </select>{" "}
              </div>{" "}
            </div>
            <div id="row-2">
              <div id="num-input">
                <div id="score-input">
                  <div className="row-wrapper">
                    <label>score</label>
                    <input
                      placeholder="Score"
                      type="number"
                      id="score-input-box"
                      min="25"
                      step="25"
                      value={userinput.score}
                      onChange={(e) => {
                        setUserInput({ ...userinput, score: e.target.value });
                      }}
                    ></input>{" "}
                  </div>{" "}
                </div>
              </div>
              <div className="row-wrapper">
                <div id="before-input">
                  <label>before</label>
                  <DatePicker
                    popperProps={{
                      positionFixed: true,
                    }}
                    value={userinput.before}
                    selected={userinput.before}
                    onChange={(e) => {
                      setUserInput({ ...userinput, before: e });
                    }}
                  />{" "}
                  <span class="fa fa-calendar-o"></span>
                </div>{" "}
              </div>
              <div className="row-wrapper">
                <div id="after-input">
                  <label>after</label>
                  <DatePicker
                    popperProps={{
                      positionFixed: true,
                    }}
                    type="text"
                    selected={userinput.after}
                    onChange={(e) => setUserInput({ ...userinput, after: e })}
                  />{" "}
                  <span class="fa fa-calendar-o"></span>
                </div>
              </div>{" "}
            </div>{" "}
            <div id="advanced-row" ref={advancedRow}>
              <div className="row-wrapper">
                <label>NSFW</label>
                <select
                  className="advanced-input"
                  onChange={(e) => {
                    setUserInput({ ...userinput, over_18: e.target.value });
                  }}
                >
                  <option>Any</option>

                  <option>True</option>
                  <option>False</option>
                </select>{" "}
              </div>{" "}
              <div className="row-wrapper">
                <label>Stickied</label>
                <select
                  className="advanced-input"
                  onChange={(e) => {
                    setUserInput({ ...userinput, stickied: e.target.value });
                  }}
                >
                  <option>Any</option>

                  <option>True</option>
                  <option>False</option>
                </select>{" "}
              </div>{" "}
              <div className="row-wrapper">
                <label>Is Self</label>
                <select
                  className="advanced-input"
                  onChange={(e) => {
                    setUserInput({ ...userinput, is_self: e.target.value });
                  }}
                >
                  <option>Any</option>

                  <option>True</option>
                  <option>False</option>
                </select>{" "}
              </div>
              <div className="row-wrapper">
                <label>Locked</label>
                <select
                  className="advanced-input"
                  onChange={(e) => {
                    setUserInput({ ...userinput, locked: e.target.value });
                  }}
                >
                  <option>Any</option>

                  <option>True</option>
                  <option>False</option>
                </select>{" "}
              </div>{" "}
              <div className="row-wrapper">
                <label>Distinguished</label>
                <select
                  className="advanced-input"
                  onChange={(e) => {
                    setUserInput({
                      ...userinput,
                      distinguished: e.target.value,
                    });
                  }}
                >
                  <option>Any</option>

                  <option>Admin</option>
                  <option>Moderator</option>
                </select>{" "}
              </div>
            </div>
            <div id="row-3">
              <div id="search-term-input">
                <div className="row-wrapper">
                  <label>Search Terms</label>
                  <input
                    value={userinput.searchTerm}
                    placeholder="Search Terms"
                    type="text"
                    onChange={(e) => {
                      setUserInput({
                        ...userinput,
                        q: e.target.value,
                      });
                    }}
                  ></input>{" "}
                </div>
              </div>
              <div className="row-wrapper">
                <label>amount returned</label>
                <input
                  placeholder="Size"
                  onChange={(e) => {
                    setUserInput({
                      ...userinput,
                      size: parseInt(e.target.value),
                    });
                  }}
                  value={userinput.size}
                  type="number"
                  min="25"
                  step="25"
                  id="amnt-ret"
                ></input>{" "}
              </div>{" "}
              <div className="row-wrapper" id="api-wrapper" ref={apiAdvanced}>
                <label>API</label>
                <select id="advanced-api-search">
                  <option>Pushshift</option>

                  <option>True</option>
                  <option>False</option>
                </select>{" "}
              </div>
            </div>
            <div id="developer-row" ref={developerRow}>
              <div className="row-wrapper">
                <label>ID</label>
                <input
                  placeholder="ID"
                  type="text"
                  onChange={(e) => {
                    setUserInput({
                      ...userinput,
                      id: e.target.value,
                    });
                  }}
                ></input>{" "}
              </div>{" "}
              <div className="row-wrapper">
                <label>Link ID</label>
                <input
                  placeholder="Link ID"
                  type="text"
                  onChange={(e) => {
                    setUserInput({
                      ...userinput,
                      link_id: e.target.value,
                    });
                  }}
                ></input>{" "}
              </div>{" "}
            </div>
            <div id="row-4">
              <div id="seach-btn">
                <div className="row-wrapper">
                  <input id="search-btn" value="Search" type="submit"></input>{" "}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SearchForm;
