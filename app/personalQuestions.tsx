import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import questions from '../personalQuestions.json';
import { Feather } from "@expo/vector-icons";

export default function PersonalQuestions() {
  const shuffleArray = (array: string[]) => {
    let newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  const [shuffledQuestions, setShuffledQuestions] = useState(
    shuffleArray(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(shuffledQuestions[0]);

  const nextQuestion = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= shuffledQuestions.length) {
      setShuffledQuestions(shuffleArray(questions));
      nextIndex = 0;
    }
    setCurrentIndex(nextIndex);
    setCurrentQuestion(shuffledQuestions[nextIndex]);
  };
  const previousQuestion = () => {
    let nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(shuffledQuestions[nextIndex]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionTextLandscape}>{currentQuestion}</Text>
      <StatusBar style="auto" />
      <View style={styles.arrowRow}>
        <TouchableOpacity onPress={previousQuestion} activeOpacity={1}>
          <Feather
            name="chevron-left"
            size={48}
            color={currentIndex < 1 ? "gray" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextQuestion} activeOpacity={1}>
          <Feather name="chevron-right" size={48} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  questionTextLandscape: {
    color: "white",
    marginHorizontal: 100,
    fontSize: 36,
    textAlign: "center",
  },
  arrowRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: 32,
    gap: 32,
  },
});
