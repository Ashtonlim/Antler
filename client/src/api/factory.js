import { loadState } from 'localStorage';

export const createHeaders = (...args) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...args,
});

export const createReqParams = (method, body, headers = 'json') => {
  const params = {};
  if (method) params['method'] = method;
  if (body) params['body'] = JSON.stringify(body);

  if (headers === 'json') {
    const state = loadState();
    const Authorization = state.token;
    if (Authorization !== undefined) {
      params['headers'] = createHeaders(Authorization);
    }
    params['headers'] = createHeaders();
    console.log({ log: 'factory.js', params, token: Authorization });
  }

  return params;
};

export const resHandler = async (res) => {
  if (res.ok) return await res.json();
  else {
    console.log('res is not okay :(');
    throw new Error(await res.text());
  }
};

export const noCSFR = { ok: false, err: 'no csfr token' };
