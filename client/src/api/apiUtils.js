import { resHandler } from "./factory";

const { REACT_APP_AUTH } = process.env;

const forex = `api/v7`;
const BASE = REACT_APP_AUTH;
const key = "e4522a915b50a3abd0b7";

export const currConv = async ({ from = "USD", to = "SGD" } = {}) => {
  const api = `${BASE}/${forex}/convert?q=${from}_${to}&compact=ultra&apiKey=${key}`;
  return await resHandler(await fetch(api));
};
