import { BASE } from './const';

export const getUsername = async (userName) => {
  return await fetch(`${BASE}/users/username/${userName}`);
};
export const getPortfolio = async (portid) => {
  return await fetch(`${BASE}/users/portfolios/${portid}/items`);
};
