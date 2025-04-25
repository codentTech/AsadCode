"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";

export default function useCustomInput(onChange, type, endIcon) {
  const [showPassword, setShowPassword] = useState(false);

  const borderErrorStyle = {
    border: "1px solid red",
  };

  const borderSuccessStyle = {
    border: "1px solid gray",
  };

  const passwordMouseDownHandler = (event) => {
    event.preventDefault();
  };

  const inputChangeHandler = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const getInputEndAdornment = useCallback(() => {
    if (type === "password") {
      return (
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          onMouseDown={passwordMouseDownHandler}
          onMouseUp={passwordMouseDownHandler}
          edge="end"
        >
          {showPassword ? (
            <VisibilityOff style={{ fontSize: "20px" }} />
          ) : (
            <Visibility style={{ fontSize: "20px" }} />
          )}
        </IconButton>
      );
    }
    return endIcon;
  }, [type, showPassword, endIcon, passwordMouseDownHandler]);

  return {
    showPassword,
    inputChangeHandler,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  };
}
