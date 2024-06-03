import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const questions = [
    "What would you want your last meal to be?",
    "If you could have one superpower what would it be?",
    "If you could live in any fictional universe, which one would you choose and why?",
    "If you could have dinner with any historical figure, who would it be and what would you talk about?",
    "If you could have dinner with any historical figure, who would it be and what would you talk about?",
    "If you could only listen to one song for the rest of your life, what would it be?",
    "If you could travel back in time to any event in history, which event would you choose to witness?",
    "If you could switch places with any celebrity for a week, who would it be?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(
    questions[Math.floor(Math.random() * questions.length)]
  );

  const changeQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={changeQuestion}
      activeOpacity={1}
    >
      <Text style={styles.questionText}>{currentQuestion}</Text>
      <StatusBar style="auto" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    color: "white",
    marginHorizontal: 60,
    fontSize: 28,
    textAlign: "center",
  },
});
