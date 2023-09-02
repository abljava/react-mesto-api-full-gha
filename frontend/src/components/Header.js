import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header({ userEmail }) {
  const navigate = useNavigate();
  const location = useLocation()

  const signOut = () => {
    localStorage.removeItem('token')
    navigate('/sign-in', { replace: true })
  }

  return (
    <header className="header page__centered">
      <div className="header__logo"></div>
      <div className="header__container">
        {location.pathname === '/' && <p className="header__text">{userEmail}</p>}
        {location.pathname === '/' && <button onClick={signOut} className='button header__button'>Выйти</button>}
        {location.pathname === '/sign-in' && <Link to='/sign-up' className='header__text'>Регистрация</Link>}
        {location.pathname === '/sign-up' && <Link to='/sign-in' className='header__text'>Вход</Link>}
      </div>
    </header>
  )
}

export default Header