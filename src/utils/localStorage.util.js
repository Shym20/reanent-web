import Cookies from "js-cookie";
// import { useState } from "react";
// const [isLoggedIn, setIsLoggedIn] = useState(false);

export const getTokenLocal = () => {
  return Cookies.get("reanent_auth_token");
};

export const getUserLocal = () => {
  const user = Cookies.get("reanent_ufo");

  if (user !== null && user !== undefined) {
    return JSON.parse(user);
    // setIsLoggedIn(true);
  } else {
    return null;
    // setIsLoggedIn(false);
  }
};

export const setTokenLocal = (token) => {
  Cookies.set("reanent_auth_token", token, { expires: 30 });
  // console.log(Cookies.set("_auth_token", token, { expires: 30 }));
};

export const setUserLocal = (user) => {
  Cookies.set("reanent_ufo", JSON.stringify(user), { expires: 30 });
};
