import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/router";

let initialUser = {
  idToken: "",
  uid: "",
  username: "",
  email: "",
  isMember: false
}

let dummyUser = {
  uid: "123456",
  name: "JohnBob",
  email: "JohnBob@mail.com",
  phone: 1234567,
  isMember: true,
}

let logoutTimer;

const API_KEY = process.env.FIREBASE_API_KEY;
const USER_TABLE = "https://jjvc-7665d-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
const DELETE_Auth_TABLE = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`

const AuthContext = React.createContext({
  ...initialUser,
  token: "",
  isLoggedIn: false,
  registerWithPwd: () => {},
  loginWithPwd: () => {},
  logout: () => {},
  authenticateToken: () => {}
});

const retrieveStoredToken = () => {
  const storedToken = window.localStorage.getItem("token");
  const storedExpirationTime = window.localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationTime);
  // if (remainingTime <= 3600) {
  //   removeLocalStorageData();
  //   return null;
  // }
  return {token: storedToken, duration: remainingTime};
}

const removeLocalStorageData = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("expirationTime");
}

const setLocalStorageData = (token, expirationTime) => {
  window.localStorage.setItem('token', token);
  // localStorage.setItem('expirationTime', expirationTime);
}

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
}

export const AuthContextProvider = (props) => {
  const router = useRouter();
  let initialToken;
  let tokenData;
  // const tokenData = retrieveStoredToken();
  // if (tokenData) {
  //   initialToken = tokenData.token;
  // }

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);

  const registerWithPassword = async (user, expirationTime) => {
    const { email,password } = user;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json "
      }
    });
    const resJson = await response.json();
    // Error
    if (resJson && resJson.error && resJson.error.message) {
      return { errorMsg: resJson.error.message};
    }
    // create user
    try {
      const userRes = await createUser(resJson.localId, user);
      if (userRes && userRes.errorMsg) {
        return { errorMsg: userJson.error.message};
      }
      // // window.localStorage.setItem('email', email);
      // // window.localStorage.setItem('password', password);
      // window.localStorage.setItem('token', resJson.idToken);
      // window.localStorage.setItem('uid', resJson.localId);
      // setToken(resJson.idToken);
      // setUser({ idToken: resJson.idToken,  uid:resJson.localId, ...user });
      // setLocalStorageData(resJson.idToken, expirationTime);
      return true;
    } catch (err) {
      await fetch(DELETE_Auth_TABLE, {method: "POST", body: JSON.stringify({idToken: resJson.idToken})});
      alert("错误码 500: 请联系系统管理员");
    }
  }

  const loginWithPasswordHandler = async (email, password, expirationTime) => {
    console.log("login")
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json "
      }
    });

    const resJson = await response.json();
    if (response.ok) {
      // window.localStorage.setItem('email', email);
      // window.localStorage.setItem('password', password);
      window.localStorage.setItem('token', resJson.idToken);
      window.localStorage.setItem('uid', resJson.localId);
      setToken(resJson.idToken);
      setUser({ idToken: resJson.idToken, uid:resJson.localId, ...initialUser });
      // setLocalStorageData(resJson.idToken, expirationTime);
      // const remainingTime = calculateRemainingTime(expirationTime);
      // logoutTimer = setTimeout(logoutHandler, remainingTime);
      return true;
    }
    // Error
    if (resJson && resJson.error && resJson.error.message) {
      return { errorMsg: resJson.error.message};
    }
    return false;
  }

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUser(initialUser);
    removeLocalStorageData();

    if(logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, [])

  const authenticateToken = useCallback(async (currPath) => {
    tokenData = retrieveStoredToken();
    console.log("authenticate...");
    if (tokenData && tokenData.token) {
      console.log("Redirecting to requested path...");
      const user = await getUserInfo();
      setUser(user);
      setToken(tokenData.token);
      // logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      if (currPath === "/login" || currPath === "/register") {
        // router.push("/");
        router.push("/namecard");
        return
      }
      router.push(currPath);
      return
    }
    console.log("No token")
    if (currPath === "/namecard") {
      router.push("/");
    }
  },[]);

  const getUserInfo = useCallback(async(uid) => {
    let userUid = window.localStorage.getItem("uid");
    const response = await fetch(`${USER_TABLE}?orderBy="uid"&equalTo="${userUid}"`);
    const userJson = await response.json();
    const user = Object.values(userJson);
    if (user.length > 0) {
      return user[0];
    }
    return null;
  },[]);

  const createUser = useCallback(async (uid, user) => {
    const response = await fetch(USER_TABLE, {
      method: "POST",
      body: JSON.stringify({
        uid: uid,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isMember: user.isMember
      })
    });
    const userJson = await response.json();
    if (response.ok) {
      return true
    }
    return {errorMsg: userJson.error.message};
  },[]);

  const updateUser = useCallback(() => {
    let userUid = window.localStorage.getItem("uid");
  },[]);

  const deleteAccount = () => {

  }

  // useEffect(() => {
    // logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    // authenticateToken();
    // fetch("", { method: "GET" }).then(response => {
    //   if (!response.ok) {
    //     throw new Error("Requesting User failed!");
    //   }
    //   return response.json()
    // }).then(data => {
    //   setUser(data);
    // }).catch(err => {
    //   console.log(err);
    // });
  // },[token]);

  const contextValue = {
    ...user,
    // idToken: token,
    isLoggedIn: !!token,
    registerWithPwd: registerWithPassword,
    loginWithPwd: loginWithPasswordHandler,
    logout: logoutHandler,
    authenticateToken: authenticateToken
  }

  return (
    <AuthContext.Provider value={contextValue}>
      { props.children }
    </AuthContext.Provider>
  );
};

export default AuthContext;
