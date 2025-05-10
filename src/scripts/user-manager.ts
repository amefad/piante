// import { tryLoginUser, tryRegisterUser } from "./api-calls";
// {
//   "id": 4,
//   "name": "palma",
//   "email": "palma@example.com",
//   "role": "editor",
//   "token": "BOaavdqjaBZRNmRhf1LICnBz8tsmwbSNlsBQyDj2cYY="
// }

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}
interface User {
  data?: UserData;
  isLogged: boolean;
}

const USER_DATA = "user-data";
let user: User | undefined;

function instantiateUser() {
  if (!user) {
    const userData = localStorage.getItem(USER_DATA);
    if (!userData) {
      // local storage is empty
      throw new Error("user data not found, try to login");
    } else {
      // user is presumably logged, however session_id may be expired
      user = Object.freeze({ data: JSON.parse(userData), isLogged: false });
    }
  }
}

/**
 * Removes user instance and localStorage data
 */
function unsetCurrentUser() {
  user = undefined;
  localStorage.removeItem(USER_DATA);
}

function getCurrentUser() {
  if (!user) {
    instantiateUser();
  }
  return user;
}

export { getCurrentUser, unsetCurrentUser };
