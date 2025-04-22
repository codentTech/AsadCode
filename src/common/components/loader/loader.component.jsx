import React from 'react';
import { BeatLoader } from 'react-spinners';

const override = {
  display: 'block',
  margin: '3px 0 0 10px',
  borderColor: 'white'
};

function Loader({ loading }) {
  return (
    <>
      <BeatLoader
        color="white"
        loading={loading}
        cssOverride={override}
        size={12}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  );
}

export default Loader;
