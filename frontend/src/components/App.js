import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { api } from '../utils/Api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardToDelete, setCardToDelete] = useState({});
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const tokenCheck = () => {
    if (localStorage.token) {
      api
        .getUserInfo(localStorage.token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.email);
            navigate('/', { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка проверки токена: `, err);
        });
    }
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo(localStorage.token)
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.log(`Ошибка получения данных пользователя: `, err);
        });
    }
  }, [loggedIn, userEmail]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getCards(localStorage.token)
        .then((dataCard) => {
          //to sort array
          setCards(dataCard.reverse());
        })
        .catch((err) => {
          console.log(`Ошибка получения карточек: `, err);
        });
    }
  }, [loggedIn, userEmail]);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setIsDeletePopupOpen(true);
    setCardToDelete(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsTooltipOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((item) => item === currentUser._id);
    if (isLiked) {
      api
        .deleteLike(card._id, localStorage.token)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((item) => (item._id === card._id ? newCard : item))
          );
        })
        .catch((err) => console.log('Ошибка удаления лайка'));
    } else {
      api
        .addLike(card._id, localStorage.token)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((item) => (item._id === card._id ? newCard : item))
          );
        })
        .catch((err) => console.log('Ошибка добавления лайка'));
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id, localStorage.token)
      .then((res) => {
        setCards((state) =>
          state.filter((c) => {
            return c._id !== card._id;
          })
        );
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка удаления карточки: `, err);
      });
  }

  function handleUpdateUser(data) {
    api
      .editUserInfo(data, localStorage.token)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка редактирования данных пользователя: `, err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatar(avatar, localStorage.token)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка редактирования аватара: `, err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .addNewCard(data, localStorage.token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка добавления карточки: `, err);
      });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleUserEmail(userEmail) {
    setUserEmail(userEmail);
  }

  function openTooltip() {
    setIsTooltipOpen(true);
  }

  function handleRegistration() {
    setIsSuccess(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <div className='page__container'>
          <Header userEmail={userEmail} />
          <Routes>
            <Route
              path='*'
              element={
                loggedIn ? (
                  <Navigate to='/' replace />
                ) : (
                  <Navigate to='/sign-in' replace />
                )
              }
            />
            <Route
              exact
              path='/'
              element={
                <ProtectedRoute
                  element={Main}
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onDeleteCardClick={(card) => handleDeleteCardClick(card)}
                  onCardClick={(card) => handleCardClick(card)}
                  onCardLike={(card) => handleCardLike(card)}
                  loggedIn={loggedIn}
                />
              }
            ></Route>

            <Route
              path='/sign-up'
              element={
                <Register
                  handleRegistration={handleRegistration}
                  openTooltip={openTooltip}
                />
              }
            ></Route>
            <Route
              path='/sign-in'
              element={
                <Login
                  handleUserEmail={handleUserEmail}
                  handleLogin={handleLogin}
                />
              }
            ></Route>
          </Routes>

          <Footer />

          {/* Popup infoTooltip */}
          <InfoTooltip
            isOpen={isTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />

          {/* Popup Profile */}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={(data) => handleUpdateUser(data)}
          />

          {/* Popup Avatar */}
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={(avatar) => handleUpdateAvatar(avatar)}
          />

          {/* Popup Place */}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={(data) => handleAddPlaceSubmit(data)}
          />

          {/* Popup Delete */}
          <DeleteCardPopup
            card={cardToDelete}
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={(card) => handleCardDelete(card)}
          />

          {/* Popup Image */}
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
