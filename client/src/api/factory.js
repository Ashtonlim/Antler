import { loadState } from "localStorage";

export const createHeaders = (args) => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  ...args,
});

// Client should be responsible for what's sent to backend.
// Ideally, backend should be able to understand what to do based on info sent.
export const createReqParams = (method, body, headers = "json") => {
  const params = {};
  if (method) params["method"] = method;
  if (body) params["body"] = JSON.stringify(body);

  if (headers === "json") {
    let addToHeaders = {};

    const state = loadState();
    // why have 'Bearer' at the start? https://swagger.io/docs/specification/authentication/bearer-authentication/
    // ResearchMore.
    const Authorization = `Bearer ${state.token}`;

    if (Authorization !== undefined) {
      addToHeaders = { ...addToHeaders, Authorization };
    }
    params["headers"] = createHeaders(addToHeaders);
    console.log({ log: "factory.js", params, token: Authorization });
  }

  return params;
};

export const resHandler = async (res) => {
  if (res.ok) return await res.json();
  else {
    console.log("@factory.js: res from server is not okay :(");
    let jsonRes = await res.json();
    if ("message" in jsonRes) {
      console.log(jsonRes.message);
      throw new Error(jsonRes.message);
    }
    return await jsonRes;
  }
};

export const noCSFR = { ok: false, err: "no csfr token" };
