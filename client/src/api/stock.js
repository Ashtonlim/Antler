import { getCookie } from "./cookies";
import { resHandler, noCSFR } from "./factory";
import { BASE } from "./apiConsts";

export const getAllStockSymbols = async () => {
  return await resHandler(await fetch(`${BASE}/stocks`));
};

export const BuyStock = async (buyDetails) => {
  console.log(buyDetails);
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    const res = await fetch(`${BASE}/stocks/buy`, {
      method: "POST",
      body: JSON.stringify(buyDetails),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });
    return await resHandler(res);
  } else return noCSFR;
};

export const SellStock = async (sellDetails) => {
  console.log(sellDetails);
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    const res = await fetch(`${BASE}/stocks/sell/${sellDetails.portitem_id}`, {
      method: "POST",
      body: JSON.stringify(sellDetails),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });
    return await resHandler(res);
  } else return noCSFR;
};

export const PortItemStock = async (portid) => {
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    const res = await fetch(`${BASE}/users/portfolios/${portid}/items`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    });
    return await resHandler(res);
  } else return noCSFR;
};

// export const BuyStock = async (buyDetails) => {
//   console.log(buyDetails)
//   const csrftoken = getCookie('csrftoken')
//   if (csrftoken) {
//     const res = await fetch(
//       `${BASE}/stocks/buy`,
//       createReqParams('POST', buyDetails, csrftoken)
//     )
//     return await resHandler(res)
//   } else return noCSFR
// }

// export const SellStock = async (sellDetails) => {
//   console.log(sellDetails)
//   const csrftoken = getCookie('csrftoken')
//   if (csrftoken) {
//     const res = await fetch(
//       `${BASE}/stocks/sell/${sellDetails.portitem_id}`,
//       createReqParams('POST', sellDetails, csrftoken)
//     )
//     return await resHandler(res)
//   } else return noCSFR
// }

// export const PortItemStock = async (portid) => {
//   const csrftoken = getCookie('csrftoken')
//   if (csrftoken) {
//     const res = await fetch(`${BASE}/users/portfolios/${portid}/items`, {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrftoken,
//       },
//     })

//     return await resHandler(res)
//   } else return noCSFR
// }
