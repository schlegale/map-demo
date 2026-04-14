import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import Auth from "./src/pages/Auth";
import Map from "./src/pages/Map";

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) setUserToken(token);
      setIsReady(true);
    };
    loadToken();
  }, []);

  if (!isReady) return null;

  return !userToken ? (
    <Auth
      onLoginSuccess={async (token) => {
        await SecureStore.setItemAsync("userToken", token);
        setUserToken(token);
      }}
    />
  ) : (
    <Map
      onLogout={async () => {
        await SecureStore.deleteItemAsync("userToken");
        setUserToken(null);
      }}
    />
  );
}
