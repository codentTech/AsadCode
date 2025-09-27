import React from "react";
import PropTypes from "prop-types";
import AnimatedLoader from "../animated-loader/animated-loader.component";

/**
 * Inline animated loader for small loading states
 * @param {string} type - Type of animation
 * @param {string} size - Size of the loader
 * @param {string} color - Color of the loader
 * @param {string} className - Additional CSS classes
 * @returns JSX
 */
function InlineLoader({ 
  type = "spinner", 
  size = "sm", 
  color = "#1070b7",
  className = ""
}) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <AnimatedLoader 
        type={type} 
        size={size} 
        color={color}
      />
    </div>
  );
}

InlineLoader.propTypes = {
  type: PropTypes.oneOf(["spinner", "dots", "pulse", "wave"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default InlineLoader; 