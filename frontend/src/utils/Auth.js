export const BASE_URL = 'http://localhost:3000';
// export const BASE_URL = 'https://mesto.nomoreparties.co/v1/cohort-66';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
    })
    .then((res) => {return res})
    .catch((err) => console.log(`error registration`, err))
}

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
    })
    .then((res) => {
      return res
    })
}

// export const getContent = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   })
//     .then((res) => {
//       if (res.status === 200) {
//         return res.json()
//       }
//     })
//     .then((data) => {
//       return data
//     })
// }