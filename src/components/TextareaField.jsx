const TextareaField = ({ label, id, value, placeholder = 'your message here...', onChange }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <textarea
      className="form-control"
      id={id}
      rows="3"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  </div>
)

export default TextareaField
