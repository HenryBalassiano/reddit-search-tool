import "../styles/Settings.css";
import { useState, useRef, useEffect } from "react";
function Settings() {
  const NSFW = useRef(false);
  const advancedOptions = useRef(false);
  const developerOptions = useRef(false);

  function settingOne(e) {
    let checked = "";
    if (e.target.checked) {
      checked = "checked";
    }
    localStorage.setItem("setting1", checked);
  }
  function settingTwo(e) {
    let checked = "";
    if (e.target.checked) {
      checked = "checked";
    }
    localStorage.setItem("setting2", checked);
  }
  function settingThree(e) {
    let checked = "";
    if (e.target.checked) {
      checked = "checked";
    }
    localStorage.setItem("setting3", checked);
  }
  useEffect(() => {
    if (localStorage.getItem("setting1") === "checked") {
      advancedOptions.current.checked = true;
    }
    if (localStorage.getItem("setting2") === "checked") {
      developerOptions.current.checked = true;
    }
    if (localStorage.getItem("setting3") === "checked") {
      NSFW.current.checked = true;
    }
  });
  return (
    <div id="settings-parent">
      <div className="settings-header">
        <h2 id="settings-tag">Settings </h2>
      </div>
      <div id="settings-child">
        <div>
          <input
            type="checkbox"
            id="advanced-options"
            ref={advancedOptions}
            onChange={settingOne}
          />{" "}
          <label for="advanced-options">Show Advanced Options</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="developer-options"
            ref={developerOptions}
            onChange={settingTwo}
          />{" "}
          <label for="developer-options"> Show Developer Options</label>
        </div>{" "}
        <div>
          <input type="checkbox" id="NSFW" ref={NSFW} onChange={settingThree} />{" "}
          <label for="NSFW"> Hide NSFW Content</label>
        </div>
      </div>
    </div>
  );
}

export default Settings;
