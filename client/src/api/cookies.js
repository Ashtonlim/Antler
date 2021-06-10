export const getCookie = (key) => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`));

  if (cookie) return cookie.split('=')[1];
  else return false;
};
