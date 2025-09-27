import React from "react";
import { BounceLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0px 0 0 0px",
};

function Loader({ loading, color = "white", size = 18 }) {
  return (
    <BounceLoader
      color={color}
      loading={loading}
      cssOverride={override}
      className={`text-${color} rounded-full`}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Loader;
