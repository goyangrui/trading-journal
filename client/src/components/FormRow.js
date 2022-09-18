function FormRow({
  name,
  id,
  type,
  value,
  labelText,
  handleChange,
  handleScroll,
  min,
  step,
  options,
}) {
  return (
    <div className="form-row">
      {/* label will reference an input field by id only if it exists, otherwise use the name */}
      <label htmlFor={id || name} className="form-label">
        {labelText || name}
      </label>
      {/* if the type is select, return select tag otherwise return input tag is text/password */}
      {type === "select" ? (
        // select input id will be the passed in id if it exists, otherwise use the name
        <select
          className="form-input"
          id={id || name}
          name={name}
          onChange={handleChange}
          onWheel={handleScroll}
        >
          {/* for every option in the options array, return an option tag with the item in options as the value */}
          {options.map((item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            );
          })}
        </select>
      ) : (
        // regular input id will be the passed in id if it exists, otherwise use the name
        <input
          className="form-input"
          type={type}
          id={id || name}
          name={name}
          onChange={handleChange}
          onWheel={handleScroll}
          value={value}
          min={min}
          step={step}
        />
      )}
    </div>
  );
}

export default FormRow;
