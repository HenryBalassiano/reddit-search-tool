import { useEffect, useState, useRef, useReducer } from "react";
import "../styles/searchForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm({ updateData, setSearch, minimize, setMinimize, search }) {
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
    numReturned: paramsObj.numReturned ? paramsObj.numReturned : "",
    score: paramsObj.score ? paramsObj.score : "",
    before: paramsObj.before ? paramsObj.before : "",
    after: paramsObj.after ? paramsObj.after : "",
    searchTerm: paramsObj.searchTerm ? paramsObj.searchTerm : "",
  });
  function updateURLParameter(url, param, paramVal) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
      tempArray = additionalURL.split("&");
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split("=")[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = "&";
        }
      }
    }
    var rows_txt = temp + "" + param + "=" + paramVal;

    return baseURL + "?" + newAdditionalURL + rows_txt;
  }
  var newURL = updateURLParameter(window.location.href, "locId", "newLoc");
  newURL = updateURLParameter(newURL, "resId", "newResId");

  const Search = (e) => {
    updateData(userinput);
    e.preventDefault();
    setSearch(false);
    setMinimize(true);
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
        if (value)
          window.history.replaceState(
            "",
            "",
            updateURLParameter(window.location.href, key, value)
          );
      }
    }
  };

  // change value of inputs
  // put userinput into url
  // request API with new params
  const max = useRef();
  return (
    <div id={`form-${minimize ? "hover" : "parent"}`}>
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
              <label>keywords</label>
              <input
                value={userinput.searchTerm}
                placeholder="Keywords"
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
                setUserInput({ ...userinput, numReturned: e.target.value });
              }}
              value={userinput.numReturned}
              type="number"
              min="25"
              step="25"
              max="100"
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
  );
}
export default SearchForm;
