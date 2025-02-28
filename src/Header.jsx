import { Link } from "react-router-dom"
import "./Header.css"

export function Header({ isDarkMode, setIsDarkMode }) {
  return (
    <header>
      <h1>My cool site</h1>
      <div>
        <label>
          Some switch (dark mode?){" "}
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={e => setIsDarkMode(e.target.checked)}
          />
        </label>
        <nav>
          {/* Use <Link> with "to" instead of <a> with "href" */}
          <Link to="/">Home</Link>
          <Link to="/images">Image Gallery</Link>
          <Link to="/account">Account</Link>
        </nav>
      </div>
    </header>
  )
}
