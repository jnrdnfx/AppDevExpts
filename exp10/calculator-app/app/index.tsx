import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CalculatorScreen() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const router = useRouter();

  const handlePress = (value: string) => {
    if (value === "C") {
      setInput("");
      setResult("");
      return;
    }

    if (value === "=") {
      try {
        const evalResult = eval(input); // for simple math
        setResult(evalResult.toString());
        saveToFirebase(input, evalResult.toString());
      } catch {
        setResult("Error");
      }
      return;
    }

    setInput((prev) => prev + value);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const saveToFirebase = async (expression: string, result: string) => {
    try {
      await addDoc(collection(db, "history"), {
        expression,
        result,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log("Error saving to Firebase:", error);
    }
  };

  const buttons = [
    ["C", "(", ")", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", "←"],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Display */}
        <View style={styles.displayContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.inputText}>{input || "0"}</Text>
          </ScrollView>
          <Text style={styles.resultText}>{result ? "= " + result : ""}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.button,
                    btn === "="
                      ? styles.equalsButton
                      : btn === "C"
                      ? styles.clearButton
                      : styles.normalButton,
                  ]}
                  onPress={() =>
                    btn === "←" ? handleBackspace() : handlePress(btn)
                  }
                >
                  <Text style={styles.buttonText}>{btn}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.historyText}>📜 View History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  displayContainer: {
    flex: 0.35,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  inputText: {
    fontSize: 36,
    color: "#fff",
    textAlign: "right",
    maxWidth: "100%",
  },
  resultText: {
    fontSize: 28,
    color: "#888",
    textAlign: "right",
  },
  buttonsContainer: {
    flex: 0.55,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 6,
  },
  button: {
    width: width / 5, // smaller buttons
    height: height / 13, // reduced height
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  normalButton: {
    backgroundColor: "#333",
  },
  clearButton: {
    backgroundColor: "#f44336",
  },
  equalsButton: {
    backgroundColor: "#2196f3",
  },
  historyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
  },
  historyText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
