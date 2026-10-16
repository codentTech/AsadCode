"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";

const isZeroLikeNumberInput = (raw) => {
  if (raw === "" || raw === null || raw === undefined) return true;
  if (typeof raw === "number") return !Number.isFinite(raw) || raw === 0;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") return true;
    const num = Number(trimmed);
    return Number.isFinite(num) && num === 0;
  }
  return false;
};

const normalizeNumberPropValue = (raw) => {
  if (raw === null || raw === undefined) return raw;
  if (isZeroLikeNumberInput(raw)) return "";
  return raw;
};

export default function useCustomInput({
  onChange,
  type,
  endIcon,
  value,
  defaultValue,
  onFocus,
  onBlur,
  register,
  name,
  readOnly,
  disabled,
}) {
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

  const registeredProps = register && name ? register(name) : null;
  const {
    onFocus: registerOnFocus,
    onBlur: registerOnBlur,
    onChange: registerOnChange,
    ref: registerRef,
    ...restRegistered
  } = registeredProps || {};

  const isNumberType = type === "number";

  const resolvedValue =
    value !== null && value !== undefined
      ? isNumberType
        ? normalizeNumberPropValue(value)
        : value
      : null;

  const resolvedDefaultValue =
    defaultValue !== null && defaultValue !== undefined
      ? isNumberType
        ? normalizeNumberPropValue(defaultValue)
        : defaultValue
      : null;

  const inputChangeHandler = (e) => {
    if (onChange) {
      onChange(e);
      return;
    }
    registerOnChange?.(e);
  };

  const handleFocus = useCallback(
    (e) => {
      if (isNumberType && !readOnly && !disabled) {
        e.target?.select?.();
      }
      registerOnFocus?.(e);
      onFocus?.(e);
    },
    [isNumberType, readOnly, disabled, registerOnFocus, onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      registerOnBlur?.(e);
      onBlur?.(e);
    },
    [registerOnBlur, onBlur]
  );

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
  }, [type, showPassword, endIcon]);

  return {
    showPassword,
    inputChangeHandler,
    handleFocus,
    handleBlur,
    registerRef,
    restRegistered,
    resolvedValue,
    resolvedDefaultValue,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
    hasRegister: Boolean(registeredProps),
    hasCustomOnChange: Boolean(onChange),
  };
}
