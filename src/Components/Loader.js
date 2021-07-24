import "../styles/Loader.css";

function Loader({ toggleInput }) {
  return (
    <div id="loader-parent">
      {" "}
      <i
        className="fa fa-cog fa-spin"
        style={{
          color: "white",
          fontSize: "2em",
          position: "relative",
          display: "flex",
          alignContent: "center",
          top: "2px",
          fontSmooth: "auto",
          color: toggleInput ? "#495057" : "#eee",
        }}
      ></i>
    </div>
  );
}
export default Loader;
