import './Navbar.css'
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
      <div className='nav'>
        <div className="nav-logo">React-practice</div>
        <ul className="nav-menu">
        <li className='nav-login'><NavLink to="/">Вход</NavLink></li>
        <li className='nav-home'><NavLink to="/Home">Главная страница</NavLink></li>
        <li className='nav-prof'><NavLink to="/profile">Аккаунт</NavLink></li>
      </ul>
      </div>
    )
  }
  
  export default Navbar