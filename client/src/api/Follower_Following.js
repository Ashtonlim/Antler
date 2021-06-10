import { getCookie } from './cookies';
import { noCSFR } from './factory';
import { BASE } from './const';

export const followUser = async (userId, followingId) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    return await fetch(`${BASE}/users/${userId}/follow/${followingId}`, {
      method: 'POST',
      body: JSON.stringify(userId, followingId),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });
  } else return noCSFR;
};

export const unFollow = async (userId, followingId) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    return await fetch(`${BASE}/users/${userId}/follow/${followingId}`, {
      method: 'DELETE',
      body: JSON.stringify(userId, followingId),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });
  } else return noCSFR;
};

export const followerList = async (userId) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    return await fetch(`${BASE}/users/${userId}/followers`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });
  } else return noCSFR;
};

export const followingList = async (userId) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    return await fetch(`${BASE}/users/${userId}/followings`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    });
  } else return noCSFR;
};
