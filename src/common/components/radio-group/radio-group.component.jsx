'use client';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import PropTypes from 'prop-types';

// need to update
export default function CustomRadioGroup({
  radioOptions,
  name,
  register = null,
  label = null,
  defaultValue = null,
  inlineRadioButtons = false,
  onChange
}) {
  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };
  return (
    <FormControl>
      <FormLabel id="radio-buttons-group">{label}</FormLabel>
      <RadioGroup
        aria-labelledby="radio-buttons-group"
        {...(register && register(`${name}`))}
        name={name}
        defaultValue={defaultValue}
        {...(defaultValue && { defaultValue })}
        row={inlineRadioButtons}
        onChange={handleRadioChange}
      >
        {radioOptions?.map((option) => (
          <FormControlLabel
            {...(register && register(`${name}`))}
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
        {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
      </RadioGroup>
    </FormControl>
  );
}

CustomRadioGroup.propTypes = {
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func,
  inlineRadioButtons: PropTypes.bool,
  onChange: PropTypes.func
};
