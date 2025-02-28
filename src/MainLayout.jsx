import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export default function MainLayout({ isDarkMode, setIsDarkMode }) {
  return (
    <div>
      {/* The header is always shown, no matter which route is active */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      {/* The <Outlet> is where the child route elements render */}
      <div style={{ padding: "0 2em" }}>
        <Outlet />
      </div>
    </div>
  )
}
