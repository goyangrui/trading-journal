function FormRow({ name, type, value, labelText, handleChange }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        className="form-input"
        type={type}
        id={name}
        name={name}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default FormRow;
