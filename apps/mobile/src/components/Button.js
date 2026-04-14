import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function Button({ icon, family = "Ionicons", onPress, isLarge = false }) {
  let IconComponent = Ionicons;
  if (family === "MaterialCommunityIcons") {
    IconComponent = MaterialCommunityIcons;
  } else if (family === "MaterialIcons") {
    IconComponent = MaterialIcons;
  }

  return (
    <TouchableOpacity style={styles.touchable} activeOpacity={0.7} onPress={onPress}>
      <View style={isLarge ? styles.largeCircle : styles.solidCircle}>
        <IconComponent name={icon} size={isLarge ? 40 : 32} color="#527172" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8
  },
  solidCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF"
  },
  largeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF"
  }
});
