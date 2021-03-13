import { useState } from "react";
import "../styles/searchForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm({ updateData, search }) {
  const [userinput, setUserInput] = useState({
    username: "",
    subreddit: "",
    query: "",
    numReturned: "",
    score: "",
    before: "",
    after: "",
    searchTerm: "",
  });
  const Search = (e) => {
    updateData(userinput);
    e.preventDefault();
    search(false);
  };

  return (
    <div id="form-parent">
      <form onSubmit={Search}>
        <label>username</label>
        <input
          type="text"
          onChange={(e) => {
            setUserInput({ ...userinput, username: e.target.value });
          }}
          id="username-input"
        ></input>{" "}
        <label>subreddit</label>
        <input
          type="text"
          onChange={(e) => {
            setUserInput({ ...userinput, subreddit: e.target.value });
          }}
          id="subreddit-input"
        ></input>{" "}
        <label id="search-for-input">search for</label>
        <select
          onChange={(e) => {
            setUserInput({ ...userinput, query: e.target.value });
          }}
        >
          <option>Comments</option>
          <option>Submissions</option>
        </select>{" "}
        <div id="num-input">
          <label>amount returned</label>
          <input
            onChange={(e) => {
              setUserInput({ ...userinput, numReturned: e.target.value });
            }}
            type="number"
            min="25"
            step="25"
            max="100"
          ></input>{" "}
          <div id="score-input">
            <label>score</label>
            <input
              type="number"
              min="25"
              step="25"
              onChange={(e) => {
                setUserInput({ ...userinput, score: e.target.value });
              }}
            ></input>{" "}
          </div>{" "}
        </div>
        <div id="after-input">
          <label>after</label>
          <DatePicker
            selected={userinput.after}
            onChange={(e) => setUserInput({ ...userinput, after: e })}
          />{" "}
        </div>
        <div id="before-input">
          <label>before</label>
          <DatePicker
            value={userinput.before}
            selected={userinput.before}
            onChange={(e) => {
              setUserInput({ ...userinput, before: e });
            }}
          />
        </div>{" "}
        <div id="search-term-input">
          <label>keywords</label>
          <input
            type="text"
            onChange={(e) => {
              setUserInput({ ...userinput, searchTerm: e.target.value });
            }}
          ></input>{" "}
        </div>
        <div id="seach-btn">
          <label></label>
          <input id="search-btn" value="Search" type="submit"></input>{" "}
        </div>
      </form>
    </div>
  );
}
export default SearchForm;
