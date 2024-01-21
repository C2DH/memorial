const InputField = ({ label, id, value, placeholder, onChange }) => (
  <div className="mb-3">
    {label ? (
      <label htmlFor={id} className="form-label">
        {label}
      </label>
    ) : null}
    <input
      type="text"
      placeholder={placeholder}
      className="form-control"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

export default InputField
