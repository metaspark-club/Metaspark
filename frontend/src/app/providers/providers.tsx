"use client";

import { Provider, useDispatch } from "react-redux";

import { setCredentials } from "@/store/slices/authSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { persistor, store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

type TokenPayload = {
  id: number;
  email: string;
  username: string;
};

function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const user = { ...decoded, token };
        dispatch(setCredentials({ user, token }));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthLoader />
        {children}
      </PersistGate>
    </Provider>
  );
}
