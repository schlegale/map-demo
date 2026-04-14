import { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from "react-native";

const API_URL = "http://127.0.0.1:5000";

export default function Auth({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    const endpoint = isLoginMode ? "/login" : "/signup";
    let payload = {};

    if (isLoginMode) {
      if (!identifier || !password) {
        Alert.alert("Hold up!", "Please enter your Gamertag/Email and password.");
        setIsLoading(false);
        return;
      }
      payload = { identifier, password };
    } else {
      if (!email || !username || !password || !birthDate) {
        Alert.alert("Hold up!", "Please fill out all the fields to join.");
        setIsLoading(false);
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        Alert.alert("Oops!", "Please enter birth date as YYYY-MM-DD");
        setIsLoading(false);
        return;
      }
      payload = { email, username, password, birthDate };
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          onLoginSuccess(data.access_token);
        } else {
          Alert.alert("Success!", "Trainer card created! You can now log in.");
          setIsLoginMode(true);
        }
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Image source={require("../../assets/backgrounds/1.png")} style={StyleSheet.absoluteFillObject} blurRadius={12} resizeMode="cover" />
      <View style={styles.darkDimmer} />

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.authBox}>
          <Text style={styles.title}>{isLoginMode ? "TRAINER LOGIN" : "NEW TRAINER"}</Text>

          <View style={styles.formContainer}>
            {isLoginMode ? (
              <>
                <Text style={styles.label}>GAMERTAG OR EMAIL</Text>
                <TextInput style={styles.input} placeholder="AshKetchum" placeholderTextColor="#A0AEC0" autoCapitalize="none" value={identifier} onChangeText={setIdentifier} />
              </>
            ) : (
              <>
                <Text style={styles.label}>GAMERTAG</Text>
                <TextInput style={styles.input} placeholder="AshKetchum (Unique)" placeholderTextColor="#A0AEC0" autoCapitalize="none" value={username} onChangeText={setUsername} />

                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput style={styles.input} placeholder="ash@pallet.town" placeholderTextColor="#A0AEC0" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />

                <Text style={styles.label}>BIRTH DATE (18+)</Text>
                <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#A0AEC0" value={birthDate} onChangeText={setBirthDate} />
              </>
            )}

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#A0AEC0" secureTextEntry value={password} onChangeText={setPassword} />

            <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={isLoading} activeOpacity={0.7}>
              {isLoading ? <ActivityIndicator color="#527172" /> : <Text style={styles.buttonText}>{isLoginMode ? "ENTER WORLD" : "CREATE CARD"}</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={() => setIsLoginMode(!isLoginMode)} activeOpacity={0.7}>
              <Text style={styles.switchText}>{isLoginMode ? "Need a Trainer Card? Sign up" : "Already a Trainer? Log in"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  darkDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authBox: {
    width: "85%",
    backgroundColor: "#F5F7FA",
    borderRadius: 32,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#527172",
    letterSpacing: 2.5,
    marginBottom: 30,
    textAlign: "center"
  },
  formContainer: {
    width: "100%"
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#718096",
    marginBottom: 8,
    marginLeft: 6,
    letterSpacing: 1.5
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#2D3748",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(82, 113, 114, 0.1)",
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  buttonText: {
    color: "#527172",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2
  },
  switchButton: {
    alignItems: "center",
    padding: 10
  },
  switchText: {
    color: "#527172",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5
  }
});
