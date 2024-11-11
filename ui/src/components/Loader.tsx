import BarLoader from "react-spinners/SyncLoader";

function Loader() {
  return (
    <BarLoader
      loading={true}
      size={20}
      cssOverride={{
        inset: 0,
        margin: "auto",
        position: "absolute",
        width:"fit-content",
        height: "fit-content"
      }}
    />
  );
}

export default Loader;
