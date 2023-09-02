import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/Auth';

const Register = ({ handleRegistration, openTooltip }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (typeof res !== 'undefined') {
          handleRegistration();
          openTooltip();
          navigate('/sign-in', { replace: true });
        } else {
          openTooltip();
        }
      })
      .catch((err) => console.log(`error registration`, err));
  };

  return (
    <div className='register  popup__container_auth'>
      <form
        className='popup__form popup__form_auth'
        onSubmit={handleSubmit}
        name='sign-up'
      >
        <h2 className='popup__title'>Регистрация</h2>
        <fieldset className='popup__inputs popup__inputs_auth'>
          <label>
            <input
              type='email'
              value={email || ''}
              onChange={handleChangeEmail}
              name='email'
              className='popup__input popup__input_auth'
              id='email-input'
              placeholder='Email'
              minLength='2'
              maxLength='40'
              required
            />
            <span className='popup__input-error email-input-error'></span>
          </label>
          <label>
            <input
              type='password'
              value={password || ''}
              onChange={handleChangePassword}
              name='password'
              className='popup__input popup__input_auth'
              id='password-input'
              placeholder='Пароль'
              minLength='8'
              maxLength='16'
              required
            />
            <span className='popup__input-error password-input-error'></span>
          </label>
        </fieldset>
        <button className='popup__submit-button popup__submit-button_auth button'>
          Зарегистрироваться
        </button>
        <p className='register__text'>
          Уже зарегистрированы?{' '}
          <span>
            <Link to='/sign-in' className='register__login-link'>
              Войти
            </Link>
          </span>{' '}
        </p>
      </form>
    </div>
  );
};

export default Register;
