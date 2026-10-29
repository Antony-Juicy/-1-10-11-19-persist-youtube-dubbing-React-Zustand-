import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/api', label: 'API 演示', icon: '📚' },
  { path: '/todo', label: 'Todo 应用', icon: '✅' },
]

export const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🐻</span>
          <span className="brand-text">Zustand Tutorial</span>
        </Link>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
