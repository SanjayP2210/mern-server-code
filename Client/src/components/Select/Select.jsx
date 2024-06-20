import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

export const SelectComponent = (props) => {
  const { onChange, value, options, styles, theme } = props;
  return (
    <Select
      className="input"
      value={value}
      closeMenuOnSelect={true}
      components={animatedComponents}
      isMulti
      options={options}
      styles={styles}
      theme={theme}
      onChange={onChange}
      {...props}
      // classNamePrefix="react-select"
    />
  );
};
