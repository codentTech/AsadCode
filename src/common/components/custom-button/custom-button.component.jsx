import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";

/**
 * Create custom button using mui button
 * @param text to be displayed on button
 * @param onClick function to be called on click
 * @param className is used to add custom styles classes to button
 * @param type type of button
 * @param variant variant of button (primary, outline, etc)
 * @param disabled to button disabled
 * @param href to be used as link
 * @param endIcon icon to be displayed at end of button
 * @param startIcon icon to be displayed at start of button
 * @returns component
 */

export default function CustomButton({
  id = null,
  text,
  onClick = null,
  className = "w-full py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-color",
  type = "button",
  variant = "",
  disabled = false,
  href = null,
  endIcon = null,
  startIcon = null,
  loading = false,
  loadingText = "",
  title = "",
}) {
  const isLightOutlineButton =
    /\bbtn-outline\b/.test(className) ||
    /\bbtn-danger-outline\b/.test(className) ||
    /\bbtn-white-cancel\b/.test(className);
  const isMutedSurfaceButton =
    /\bbtn-secondary\b/.test(className) || /\bbtn-cancel\b/.test(className);

  const loadingSpinnerClass = isLightOutlineButton
    ? "shrink-0 text-primary"
    : isMutedSurfaceButton
      ? "shrink-0 text-gray-600"
      : "shrink-0 text-white";

  return (
    <Button
      id={id}
      type={type}
      size="small"
      onClick={onClick}
      variant={variant}
      href={href}
      disabled={disabled}
      endIcon={endIcon}
      startIcon={startIcon}
      className={`btn font-dm normal-case ${className}`}
      title={title}
      sx={{
        "&&": {
          height: { xs: "32px", sm: "40px" },
          minHeight: { xs: "32px", sm: "40px" },
        },
        textTransform: "none",
      }}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2 min-w-0">
          <CircularProgress className={loadingSpinnerClass} size={16} />

          <span className="text-sm font-medium truncate max-w-[220px]">{loadingText || text}</span>
        </span>
      ) : (
        text
      )}
    </Button>
  );
}

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  id: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
};
