import { loadState } from 'localStorage';
import { createReqParams, resHandler } from './factory';
import { BASE } from './const';

// fetch = (originalFetch => {
//   return (...arguments) => {
//     const result = originalFetch.apply(this, arguments);
//       return result.then(console.log('Request was sent'));
//   };
// })(fetch);

// fetch('https://api.github.com/orgs/axios')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//   });

export const getUsers = async (id = null) => {
  return await resHandler(await fetch(`${BASE}/users${id ? '/' + id : ''}`));
};

export const registerUser = async (regDetails) => {
  console.log('regDetails', regDetails);
  const res = await fetch(`${BASE}/users`, createReqParams('POST', regDetails));
  return await resHandler(res);
};

export const loginUser = async (loginDetails) => {
  const res = await fetch(
    `${BASE}/users/login`,
    createReqParams('POST', loginDetails)
  );

  return await resHandler(res);
};

export const editUser = async (userDetails) => {
  const userData = loadState();

  const res = await fetch(
    `${BASE}/users/${userData.id}`,
    createReqParams('PUT', userDetails)
  );
  return await resHandler(res);
};

export const editPass = async (passDetails) => {
  const res = await fetch(
    `${BASE}/users/reset_password`,
    createReqParams('PUT', passDetails)
  );
  return await resHandler(res);
};

export const getPort = async (portID) => {
  const userData = loadState();

  const res = await fetch(
    `${BASE}/users/portfolios/${userData.portfolio.id}/items`,
    {
      method: 'GET',
      body: JSON.stringify(portID),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return await resHandler(res);
};
