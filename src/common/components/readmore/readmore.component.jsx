import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ReadMore({
  size = 150,
  text,
  firstStyling,
  secondStyling,
  maxLength = 190,
}) {
  const [isReadMore, setIsReadMore] = useState(true);

  return (
    <div>
      <p
        className={`${
          firstStyling ||
          "font-dm text-sm font-normal leading-5 text-text-dark-gray"
        }`}
      >
        {isReadMore ? text.slice(0, size) : text}{" "}
        {size < maxLength && (
          <span
            onClick={() => setIsReadMore(!isReadMore)}
            className={`cursor-pointer ${
              secondStyling ||
              "font-dm text-base font-medium leading-5 text-text-dark-gray"
            }`}
          >
            {isReadMore ? "Read more..." : " Show less"}
          </span>
        )}
      </p>
    </div>
  );
}

ReadMore.propTypes = {
  size: PropTypes.number,
  text: PropTypes.string,
  firstStyling: PropTypes.string,
  secondStyling: PropTypes.string,
  maxLength: PropTypes.number,
};
