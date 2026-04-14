import { StyleSheet, View, Dimensions, Image } from "react-native";
import Button from "../components/Button";

const { height, width } = Dimensions.get("window");

export default function Menu({ isVisible, onClose, onLogout }) {
  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Image source={require("../../assets/backgrounds/1.png")} style={StyleSheet.absoluteFillObject} blurRadius={12} resizeMode="cover" />

      <View style={styles.darkDimmer} />

      <View style={styles.shopContainer}>
        <Button icon="bag-handle" onPress={() => console.log("Shop pressed")} />
      </View>
      <View style={styles.creaturesContainer}>
        <Button icon="paw" onPress={() => console.log("Creatures pressed")} />
      </View>
      <View style={styles.settingsContainer}>
        <Button icon="settings" onPress={onLogout} />
      </View>
      <View style={styles.closeBtn}>
        <Button icon="close" onPress={onClose} isLarge={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)"
  },
  shopContainer: {
    position: "absolute",
    bottom: height * 0.38,
    alignSelf: "center"
  },
  creaturesContainer: {
    position: "absolute",
    bottom: height * 0.2,
    left: width * 0.12
  },
  settingsContainer: {
    position: "absolute",
    bottom: height * 0.2,
    right: width * 0.12
  },
  closeBtn: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center"
  }
});
