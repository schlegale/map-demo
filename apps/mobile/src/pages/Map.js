import { useRef, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { useAssets } from "expo-asset";
import Menu from "./Menu";
import Button from "../components/Button";

export default function Map({ onLogout }) {
  const webViewRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [assets] = useAssets([require("../../assets/pickle.glb")]);
  const pickleUri = assets ? assets[0].uri : null;

  useEffect(() => {
    let locationSubscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const initialLoc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          setLocation(initialLoc.coords);
        } catch (e) {
          console.warn("Could not fetch initial location", e);
        }

        locationSubscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 1 }, (loc) => setLocation(loc.coords));
      }
    })();
    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (mapReady && location && pickleUri && webViewRef.current) {
      const script = `
        if (typeof window.updateUserLocation === 'function') {
          window.updateUserLocation(${location.latitude}, ${location.longitude}, "${pickleUri}");
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [mapReady, location, pickleUri]);

  return (
    <View style={styles.container}>
      {/* 1. Map WebView */}
      <WebView
        ref={webViewRef}
        source={require("../../assets/map.html")}
        style={styles.map}
        originWhitelist={["*"]}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onLoadEnd={() => setMapReady(true)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        bounces={false}
        overScrollMode="never"
      />

      {!isMenuOpen && (
        <View style={styles.mainButtonPosition}>
          <Button family="MaterialIcons" icon="backpack" onPress={() => setIsMenuOpen(true)} />
        </View>
      )}

      <Menu isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#659624"
  },
  map: {
    flex: 1
  },
  mainButtonPosition: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center"
  }
});
