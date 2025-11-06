// src/components/SelectSearch.jsx
import Select from "react-select";

export default function SelectSearch({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
}) {
  return (
    <Select
      options={options}
      value={options.find((o) => o.value === value) || null}
      onChange={(opt) => onChange(opt?.value ?? "")}
      placeholder={placeholder}
      isClearable
      isDisabled={isDisabled}
      classNamePrefix="react-select"
    />
  );
}