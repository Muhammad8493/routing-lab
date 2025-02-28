export function AccountSettings({ userName, setUserName }) {
    function handleChange(e) {
      setUserName(e.target.value)
    }
  
    return (
      <>
        <h2>Account settings</h2>
        <label>
          Username{" "}
          <input value={userName} onChange={handleChange} />
        </label>
        <p><i>Changes are auto-saved.</i></p>
      </>
    )
  }
  