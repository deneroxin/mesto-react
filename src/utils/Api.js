class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    const {authorization} = headers;
    this._postHeaders = headers;
    this._getHeaders = {authorization};
  }

  _getData(res) {
    return res.json().then(obj => {
      if (res.ok) return obj; else throw obj;
    });
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: this._getHeaders
    })
    .then(this._getData)
    .catch(err => {
      console.log(`Api.getUserInfo() failed with: ${err.message}`);
      throw err;
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: this._getHeaders
    })
    .then(this._getData)
    .catch(err => {
      console.log(`Api.getInitialCards() failed with: ${err.message}; empty array returned`);
      return [];
    });
  }

  editProfile(newData) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._postHeaders,
      body: JSON.stringify(newData)
    })
    .then(this._getData);
  }

  addNewCard(cardData) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._postHeaders,
      body: JSON.stringify(cardData)
    })
    .then(this._getData);
  }

  removeCard({_id}) {
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: 'DELETE',
      headers: this._getHeaders
    })
    .then(this._getData);
  }

  likeCard(isLiked, {_id}) {
    return fetch(`${this._baseUrl}/cards/${_id}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._getHeaders
    })
    .then(this._getData);
  }

  setAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._postHeaders,
      body: JSON.stringify(data)
    })
    .then(this._getData);
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-54',
  headers: {
    authorization: 'e5727828-c175-4d60-8ac9-c1e0fda08d91',
    'Content-Type': 'application/json'
  }
});

export default api;
