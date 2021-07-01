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
}) {
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
    username: paramsObj.username ? paramsObj.username : "",
    subreddit: paramsObj.subreddit ? paramsObj.subreddit : "",
    query: paramsObj.query ? paramsObj.query : "",
    numReturned: parseInt(paramsObj.numReturned)
      ? parseInt(paramsObj.numReturned)
      : 25,
    score: paramsObj.score ? paramsObj.score : "",
    before: paramsObj.before
      ? Math.floor((new Date(paramsObj.before).getTime() / 1000) * 1000)
      : "",
    after: paramsObj.after
      ? Math.floor((new Date(paramsObj.after).getTime() / 1000) * 1000)
      : "",
    searchTerm: paramsObj.searchTerm ? paramsObj.searchTerm : "",
  });

  function setUrlParameter(url, key, value) {
    var key = encodeURIComponent(key),
      value = encodeURIComponent(value);
    let urlQueryString;
    var baseUrl = url.split("?")[0],
      newParam = key + "=" + value,
      params = "?" + newParam;

    if (url.split("?")[1] === undefined) {
      urlQueryString = "";
    } else {
      urlQueryString = "?" + url.split("?")[1];
    }

    if (urlQueryString) {
      var updateRegex = new RegExp("([?&])" + key + "=[^&]*");
      var removeRegex = new RegExp("([?&])" + key + "=[^&;]+[&;]?");

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "null"
      ) {
        params = urlQueryString.replace(removeRegex, "$1");
        params = params.replace(/[&;]$/, "");
      } else if (urlQueryString.match(updateRegex) !== null) {
        params = urlQueryString.replace(updateRegex, "$1" + newParam);
      } else if (urlQueryString == "") {
        params = "?" + newParam;
      } else {
        params = urlQueryString + "&" + newParam;
      }
    }

    params = params === "?" ? "" : params;

    return baseUrl + params;
  }

  const Search = (e) => {
    updateData(userinput);
    e.preventDefault();
    setSearch(false);
    setMinimize(true);
    showFava.current.style.display = "flex";

    showResults.current.style.display = "block";

    const properties = [];

    for (var key in userinput) {
      for (var propKey in userinput) {
        if (
          userinput.hasOwnProperty(propKey) &&
          typeof userinput[propKey] !== "function"
        ) {
          properties.push(propKey);
        }

        let value = userinput[key];

        if (value || !value) {
          window.history.replaceState(
            "",
            "",
            setUrlParameter(
              window.location.href
                .replace(/[^?=&]+=(&|$)/g, "")
                .replace(/&$/, ""),
              key,
              value
            )
          );
        }
      }
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
  const max = useRef();
  return (
    <div id={`form-${minimize ? "hover" : "parent"}`}>
      <div id="form">
        <form
          onSubmit={Search}
          class={`form-${minimize ? "minimize" : "maximize"}`}
          ref={max}
        >
          <div id="row-1">
            <div className="row-wrapper">
              <label>username</label>
              <input
                value={userinput.username}
                placeholder="Username"
                type="text"
                onChange={(e) => {
                  setUserInput({ ...userinput, username: e.target.value });
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
                  setUserInput({ ...userinput, query: e.target.value });
                }}
              >
                {" "}
                <option>Any</option>
                <option>Comments</option>
                <option>Submissions</option>
              </select>{" "}
            </div>
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
                    positionFixed: true, // use this to make the popper position: fixed
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
                    positionFixed: true, // use this to make the popper position: fixed
                  }}
                  type="text"
                  selected={userinput.after}
                  onChange={(e) => setUserInput({ ...userinput, after: e })}
                />{" "}
                <span class="fa fa-calendar-o"></span>
              </div>
            </div>
          </div>{" "}
          <div id="row-3">
            <div id="search-term-input">
              <div className="row-wrapper">
                <label>Search Terms</label>
                <input
                  value={userinput.searchTerm}
                  placeholder="Search Terms"
                  type="text"
                  onChange={(e) => {
                    setUserInput({ ...userinput, searchTerm: e.target.value });
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
                    numReturned: parseInt(e.target.value),
                  });
                }}
                value={userinput.numReturned}
                type="number"
                min="25"
                step="25"
                id="amnt-ret"
              ></input>{" "}
            </div>
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
  );
}
export default SearchForm;
