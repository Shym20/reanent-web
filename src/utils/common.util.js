import Cookies from "js-cookie";
import {
  logoutUser,
  updateResetToken,
  updateToken,
  updateUser,
} from "../redux/redux-slice/user.slice";
export const logout = (dispatch) => {
  Cookies.remove("reanent_ufo");
  Cookies.remove("reanent_auth_token");
  dispatch(updateUser(null));
  dispatch(updateToken(null));
  dispatch(logoutUser(null));
  dispatch(updateResetToken(null));
  // return history("/login");
};
