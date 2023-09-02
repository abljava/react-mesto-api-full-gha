class Api {
  constructor(params) {
    this._baseUrl = params.baseUrl;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  addNewCard(data, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._getResponseData(res));
  }

  getCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId} `, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._getResponseData(res));
  }

  editUserInfo(data, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => this._getResponseData(res));
  }

  editAvatar(avatar, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatar),
    }).then((res) => this._getResponseData(res));
  }

  addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => this._getResponseData(res));
  }

  deleteLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => this._getResponseData(res));
  }

  changeLikeCardStatus(cardId, isLiked, token) {
    if (isLiked) {
      return api.addLike(cardId, token);
    } else {
      return api.deleteLike(cardId, token);
    }
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000',
});

export { api };
