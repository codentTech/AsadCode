"use client";

import { TextareaAutosize } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function TextArea({
  placeholder = "",
  name,
  register = null,
  label = null,
  className = "",
  minRows = 2,
  maxRows = 10,
  value = null,
  disabled = false,
  defaultValue = null,
  onChange = null,
  onKeyDown = null,
  errors = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  ref = null,
  onBlur = null,
  customRef = null,
  leadingContent = null,
}) {
  const leadingRef = useRef(null);
  const [leadingIndentPx, setLeadingIndentPx] = useState(0);
  const hasLeadingContent = Boolean(leadingContent);

  useEffect(() => {
    if (!hasLeadingContent) {
      setLeadingIndentPx(0);
      return undefined;
    }

    const node = leadingRef.current;
    if (!node || typeof ResizeObserver === "undefined") {
      setLeadingIndentPx(128);
      return undefined;
    }

    const updateIndent = () => {
      setLeadingIndentPx(Math.ceil(node.getBoundingClientRect().width) + 10);
    };

    updateIndent();
    const observer = new ResizeObserver(updateIndent);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasLeadingContent, leadingContent]);

  const textareaClassName = hasLeadingContent
    ? `w-full resize-none rounded-md border-0 bg-transparent px-2.5 pb-2 pt-2 text-xs font-normal normal-case leading-6 text-text-black outline-none placeholder:text-gray-400 hover:border-0 focus:border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        errors && errors[name] ? "error-field" : ""
      } ${className} ${!disabled || "disabled-input"}`
    : `input-field default-input min hover:border-text-dark-gray focus:border-[1px] focus:border-text-dark-gray ${
        errors && errors[name] && "error-field"
      } ${className} ${!disabled || "disabled-input"} `;

  return (
    <div
      className={`${
        inlineLabel
          ? "flex w-full flex-row items-center"
          : `flex flex-col gap-[8px] text-xs font-medium not-italic leading-6 text-text-black ${
              hasLeadingContent ? "normal-case" : "capitalize"
            }`
      }`}
    >
      {label && <FieldLabel label={label} isRequired={isRequired} className={labelClassName} />}

      <div
        className={`w-full ${
          hasLeadingContent
            ? `relative rounded-md border bg-white ${
                errors && errors[name] ? "border-red-500" : "border-[#7e7d7d]"
              } focus-within:border-text-dark-gray`
            : ""
        }`}
      >
        {hasLeadingContent ? (
          <div
            ref={leadingRef}
            className="pointer-events-none absolute left-2.5 top-2 z-10"
            aria-hidden={false}
          >
            {leadingContent}
          </div>
        ) : null}

        <TextareaAutosize
          {...(register && register(`${name}`))}
          name={name}
          {...(customRef && { ref: customRef })}
          minRows={minRows}
          maxRows={maxRows}
          placeholder={placeholder}
          className={textareaClassName}
          style={
            hasLeadingContent
              ? {
                  textIndent: leadingIndentPx || 128,
                  border: "none",
                  borderWidth: 0,
                  outline: "none",
                  boxShadow: "none",
                }
              : undefined
          }
          {...(!register && defaultValue != null && { defaultValue })}
          {...(!register && value != null && { value })}
          {...(!register && onChange && { onChange })}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          disabled={disabled}
          {...(onBlur && { onBlur })}
        />
        {errors && errors[name] && (
          <FieldError className="mt-1 normal-case" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  onKeyDown: PropTypes.func,
  customRef: PropTypes.func,
  onBlur: PropTypes.func,
  register: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  leadingContent: PropTypes.node,
};
