import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import questions from "../funQuestions.json";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function FunQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const toggleThumbsDown = () => {
    console.log("THUMBS DOWN");
  };
  const toggleThumbsUp = () => {
    console.log("THUMBS UP");
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionTextLandscape}>{currentQuestion}</Text>
      </View>
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
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  questionTextLandscape: {
    color: "white",
    marginHorizontal: 100,
    fontSize: 36,
    textAlign: "center",
  },
  arrowRow: {
    flexDirection: "row",
    marginBottom: 32,
    gap: 32,
  },
});

{
  /* <View style={styles.arrowRow}>
        <TouchableOpacity onPress={toggleThumbsDown} activeOpacity={1}>
          <MaterialIcons name="thumb-down-off-alt" size={48} color="red" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleThumbsUp} activeOpacity={1}>
          <MaterialIcons name="thumb-up-off-alt" size={48} color="green" />
        </TouchableOpacity>
        <Entypo name="pencil" size={48} color="white" />
      </View> */
}
