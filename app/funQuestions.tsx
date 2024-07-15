import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import questions from "../funQuestions.json";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FunQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPartyModal, setShowPartyModal] = useState(false);

  const [players, setPlayers] = useState(["", ""]);

  const [party, setParty] = useState<string[]>([]);
  const [isParty, setIsParty] = useState(false);
  const [currentPartyIndex, setCurrentPartyIndex] = useState<number>(0);

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
    getData("player1");

    let nextIndex = currentIndex + 1;
    // if (nextIndex >= shuffledQuestions.length) {
    //   setShuffledQuestions(shuffleArray(questions));
    //   nextIndex = 0;
    // }
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(shuffledQuestions[nextIndex]);
    }

    if (isParty) {
      setParty(shuffleArray(party));
      setCurrentPartyIndex(0);
    }
  };
  const previousQuestion = () => {
    removeValue("player1");

    let nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(shuffledQuestions[nextIndex]);
    }

    if (isParty) {
      setParty(shuffleArray(party));
      setCurrentPartyIndex(0);
    }
  };
  const previousPartyMember = () => {
    let previousIndex = currentPartyIndex - 1;
    if (previousIndex >= 0) {
      setCurrentPartyIndex(previousIndex);
    }
  };
  const nextPartyMember = () => {
    let nextIndex = currentPartyIndex + 1;
    if (nextIndex < party.length) {
      setCurrentPartyIndex(nextIndex);
    }
  };
  const addPlayer = () => {
    setPlayers([...players, ""]);
  };
  const storeStringData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("VALUE IS " + value);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  const removeValue = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
      console.log(e);
    }

    console.log("Item removed.");
  };
  const createParty = () => {
    const partyMembers = players.filter((player) => player !== "");
    storeStringData("player1", partyMembers[0]);
    setPlayers(["", ""]);
    setParty(partyMembers);
    setShowPartyModal(false);
  };
  const editParty = () => {
    const partyMembers = players.filter((partyMember) => partyMember !== "");
    setPlayers(["", ""]);
    setParty(partyMembers);
    setCurrentPartyIndex(0);
    setShowPartyModal(false);
  };
  const handlePlayerChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text;
    setPlayers(newPlayers);
  };
  const toggleThumbsUp = () => {
    console.log("THUMBS UP");
  };
  const toggleThumbsDown = () => {
    console.log("THUMBS DOWN");
  };

  useEffect(() => {
    if (party.length > 0) {
      setIsParty(true);
    } else {
      setIsParty(false);
    }
  }, [party]);

  return (
    <View style={styles.container}>
      {isParty ? (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() =>
              currentPartyIndex > 0 ? previousPartyMember() : null
            }
            activeOpacity={1}
          >
            <Feather
              name="chevron-left"
              size={48}
              color={currentPartyIndex < 1 ? "gray" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.showExistingPartyButton}
            onPress={
              isParty
                ? () => {
                    setPlayers(party);
                    setShowPartyModal(true);
                  }
                : () => setShowPartyModal(true)
            }
          >
            <Text>{party[currentPartyIndex]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              currentPartyIndex < party.length - 1 ? nextPartyMember() : null
            }
            activeOpacity={1}
          >
            <Feather
              name="chevron-right"
              size={48}
              color={currentPartyIndex >= party.length - 1 ? "gray" : "white"}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowPartyModal(true)}
          activeOpacity={1}
          style={styles.createPartyButton}
        >
          <Text style={styles.createPartyText} maxFontSizeMultiplier={1.2}>
            Create a Party
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText} maxFontSizeMultiplier={1.2}>
          {currentQuestion}
        </Text>
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
        <Text style={{ color: "white" }}>
          {currentIndex + 1 + "/" + questions.length}
        </Text>
        <TouchableOpacity onPress={nextQuestion} activeOpacity={1}>
          <Feather
            name="chevron-right"
            size={48}
            color={currentIndex >= questions.length - 1 ? "gray" : "white"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showPartyModal}
        onRequestClose={() => setShowPartyModal(false)}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowPartyModal(false);
            setPlayers(["", ""]);
          }}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>

        <View style={styles.modalContainer}>
          <View style={styles.existingPartyButton}>
            <Text style={styles.existingPartyButtonText}>
              Join an Existing Party
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formTitleRow}>
              <Text style={styles.formTitle} maxFontSizeMultiplier={1.1}>
                {isParty ? "Edit Party" : "Create a Party"}
              </Text>
              <Pressable onPress={addPlayer}>
                <Text style={styles.addPlayer}>Add a Player</Text>
              </Pressable>
            </View>
            {isParty
              ? players.map((player, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={player}
                    placeholder={"Player " + (index + 1)}
                    onChangeText={(text) => handlePlayerChange(text, index)}
                  />
                ))
              : players.map((player, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={player}
                    placeholder={"Player " + (index + 1)}
                    onChangeText={(text) => handlePlayerChange(text, index)}
                  />
                ))}
          </View>

          <View style={styles.submitButtonContainer}>
            <Button
              title="Submit"
              onPress={isParty ? editParty : createParty}
              color="white"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 100,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 50,
  },
  questionText: {
    color: "white",
    fontSize: 36,
    textAlign: "center",
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 32,
  },
  formTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    paddingVertical: 100,
    paddingHorizontal: 32,
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 40,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    width: "100%",
    padding: 0,
    borderRadius: 10,
    backgroundColor: "#25292e",
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    color: "white",
  },
  addPlayer: {
    backgroundColor: "white",
    textAlign: "center",
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    color: "black",
  },
  nextQuestionButton: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 144,
    paddingVertical: 16,
  },
  submitButtonContainer: {
    marginBottom: 0,
  },
  existingPartyButton: {
    alignSelf: "flex-start",
    backgroundColor: "#3ca358",
    padding: 8,
    borderRadius: 8,
  },
  existingPartyButtonText: {
    color: "white",
  },
  showExistingPartyButton: {
    paddingVertical: 16,
    flexGrow: 1,
    flexDirection: "row",
    backgroundColor: "green",
    borderRadius: 24,
    justifyContent: "center",
  },
  createPartyButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  createPartyText: {
    fontSize: 20,
    color: "white",
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
