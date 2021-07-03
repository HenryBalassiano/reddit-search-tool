import "../styles/Loader.css";

function Loader() {
  return (
    <div id="loader-parent">
      {" "}
      <i
        className="fa fa-cog fa-spin"
        style={{
          color: "white",
          display: "block",
          fontSize: "2em",
          position: "relative",
          display: "flex",
          alignContent: "center",
          top: "2px",
          fontSmooth: "auto",
        }}
      ></i>
    </div>
  );
}
export default Loader;
