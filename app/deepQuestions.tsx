import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import questions from "../deepQuestions.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DeepQuestions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPartyModal, setShowPartyModal] = useState(false);

  const [players, setPlayers] = useState(["", ""]);

  const [party, setParty] = useState<string[]>([]);
  const [isParty, setIsParty] = useState(false);
  const [currentPartyIndex, setCurrentPartyIndex] = useState<number>(0);

  const [showExistingParties, setShowExistingParties] = useState(false);
  const [loadedParties, setLoadedParties] = useState<string[][]>([]);

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
    console.log(getData("party1"));

    let nextIndex = currentIndex + 1;

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
    removeParty();

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
  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };
  const storePartyData = async (value: string[]) => {
    try {
      await AsyncStorage.setItem("currentParty", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentParty = async () => {
    try {
      const value = await AsyncStorage.getItem("currentParty");
      if (value !== null) {
        const arrayValue = JSON.parse(value);
        setParty(arrayValue);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const removeParty = async () => {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.removeItem("currentParty");
      setParty([]);
      setIsParty(false);
    } catch (e) {
      console.log(e);
    }
    console.log("Item removed.");
  };
  const createParty = () => {
    const partyMembers = players.filter((partyMember) => partyMember !== "");
    storePartyData(partyMembers);
    setPlayers(["", ""]);
    setParty(partyMembers);
    setShowPartyModal(false);
  };
  const editParty = () => {
    const partyMembers = players.filter((partyMember) => partyMember !== "");
    storePartyData(partyMembers);
    setPlayers(["", ""]);
    setParty(partyMembers);
    setShowPartyModal(false);
    setCurrentPartyIndex(0);
  };
  const handlePlayerChange = (text: string, index: number) => {
    const newPlayers = [...players];
    newPlayers[index] = text;
    setPlayers(newPlayers);
  };
  const getFirstAvailablePartyKey = async () => {
    try {
      let index = 0;
      while (true) {
        const value = await AsyncStorage.getItem(`party${index}`);
        if (value === null) {
          console.log("INDEX FOUND: " + index);
          return index;
        }
        index++;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const storeCurrentParty = async () => {
    try {
      const storageKey = await getFirstAvailablePartyKey();
      console.log(
        "key: " + "party" + storageKey + ", value: " + JSON.stringify(party)
      );
      await AsyncStorage.setItem(`party${storageKey}`, JSON.stringify(party));
      setPlayers(["", ""]);
      setParty([]);
      setIsParty(false);
    } catch (error) {
      console.log(error);
    }
  };
  const loadPartySelection = async () => {
    try {
      let partiesLoaded: string[][] = [];
      let index = 0;
      while (true) {
        const value = await AsyncStorage.getItem(`party${index}`);
        console.log("Value " + index + ": " + value);
        if (value === null) {
          setLoadedParties(partiesLoaded);
          break;
        }
        partiesLoaded[index] = JSON.parse(value);
        index++;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadSelectedParty = async (idx: number, loadedParty: string[]) => {
    try {
      await AsyncStorage.setItem("currentParty", JSON.stringify(loadedParty));
      if (isParty) {
        await AsyncStorage.setItem(`party${idx}`, JSON.stringify(party));
      } else {
        await AsyncStorage.removeItem(`party${idx}`);
        idx = idx + 1;
        while (true) {
          const storedValue = await AsyncStorage.getItem(`party${idx}`);
          if (storedValue === null) {
            break;
          }
          await AsyncStorage.removeItem(`party${idx}`);
          await AsyncStorage.setItem(`party${idx - 1}`, storedValue);
          idx++;
        }
      }
      setParty(loadedParty);
      setShowExistingParties(false);
      setShowPartyModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentParty();
  }, []);
  useEffect(() => {
    if (party.length > 0) {
      setIsParty(true);
    } else {
      setIsParty(false);
    }
  }, [party]);
  useEffect(() => {
    if (showPartyModal) {
      loadPartySelection();
    }
  }, [showPartyModal]);

  return (
    <View style={styles.container}>
      {isParty ? (
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() =>
              currentPartyIndex > 0 ? previousPartyMember() : null
            }
            activeOpacity={1}
          >
            <Text
              style={{
                color: currentPartyIndex < 1 ? "gray" : "white",
                fontSize: 48,
              }}
              maxFontSizeMultiplier={1.1}
            >
              &lt;
            </Text>
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
            <Text
              style={{
                color: currentPartyIndex >= party.length - 1 ? "gray" : "white",
                fontSize: 48,
              }}
              maxFontSizeMultiplier={1.1}
            >
              &gt;
            </Text>
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
          <Text
            style={{ color: currentIndex < 1 ? "gray" : "white", fontSize: 64 }}
            maxFontSizeMultiplier={1.1}
          >
            &lt;
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "white" }}>
          {currentIndex + 1 + "/" + questions.length}
        </Text>
        <TouchableOpacity onPress={nextQuestion} activeOpacity={1}>
          <Text
            style={{
              color: currentIndex >= questions.length - 1 ? "gray" : "white",
              fontSize: 64,
            }}
            maxFontSizeMultiplier={1.1}
          >
            &gt;
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Party Modal */}
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
            setShowExistingParties(false);
            setPlayers(["", ""]);
          }}
        >
          <Text style={styles.closeButtonText} maxFontSizeMultiplier={1.1}>
            X
          </Text>
        </TouchableOpacity>

        <View style={styles.modalContainer}>
          {!showExistingParties ? (
            <View style={styles.formContainer}>
              <View style={styles.formTitleRow}>
                <View style={styles.partySelectMenuButton}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowExistingParties(true);
                    }}
                    style={{ padding: 8 }}
                  >
                    <Text
                      style={{ color: "white" }}
                      maxFontSizeMultiplier={1.4}
                    >
                      Select a Party
                    </Text>
                  </TouchableOpacity>
                </View>
                {isParty && (
                  <View style={styles.partySelectMenuButton}>
                    <TouchableOpacity
                      onPress={storeCurrentParty}
                      style={{ padding: 8 }}
                    >
                      <Text
                        style={{ color: "white" }}
                        maxFontSizeMultiplier={1.4}
                      >
                        Create a New Party
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.formTitleRow}>
                <Text style={styles.formTitle} maxFontSizeMultiplier={1.1}>
                  {isParty ? "Edit Party" : "Create a Party"}
                </Text>
                <Pressable onPress={addPlayer}>
                  <Text style={styles.addPlayer}>Add a Player</Text>
                </Pressable>
              </View>
              <ScrollView
                style={styles.partyMembersContainer}
                showsVerticalScrollIndicator={true}
              >
                {players.map((player, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={player}
                    placeholder={"Player " + (index + 1)}
                    onChangeText={(text) => handlePlayerChange(text, index)}
                  />
                ))}
              </ScrollView>
              <View style={styles.submitButtonContainer}>
                <Button
                  title="Submit"
                  onPress={isParty ? editParty : createParty}
                  color="black"
                />
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.partySelectMenuButton}>
                <Button
                  title="Create/Edit Party"
                  onPress={() => setShowExistingParties(false)}
                  color="white"
                />
              </View>
              <View style={styles.formTitleRow}>
                <Text style={styles.formTitle} maxFontSizeMultiplier={1.1}>
                  Select a Party
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={styles.partySelectionColumn}
                showsVerticalScrollIndicator={true}
              >
                {loadedParties.length < 1 && (
                  <Text style={{ color: "gray", fontSize: 16 }}>
                    No available parties
                  </Text>
                )}
                {loadedParties.map((loadedParty, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.partySelectButton}
                    onPress={() => loadSelectedParty(idx, loadedParty)}
                  >
                    <View style={styles.partySelectButtonContainer}>
                      <Text numberOfLines={1}>{loadedParty.join(", ")}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
    paddingTop: 24,
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
  selectPartyRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  partySelectMenuButton: {
    backgroundColor: "#007AFF",
  },
  partySelectionColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    gap: 24,
  },
  partySelectButton: {
    backgroundColor: "white",
    padding: 16,
    width: "100%",
    flexDirection: "row",
    gap: 8,
    borderRadius: 8,
  },
  partySelectButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  formTitleRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalContainer: {
    paddingTop: 120,
    paddingBottom: 32,
    paddingHorizontal: 32,
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    padding: 8,
    top: 60,
    right: 40,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#25292e",
    flex: 1,
    gap: 0,
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "white",
  },
  partyMembersContainer: {
    padding: 8,
    overflow: "scroll",
    flexGrow: 1,
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
    backgroundColor: "white",
    paddingHorizontal: 32,
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
    backgroundColor: "#007AFF",
    borderRadius: 24,
    justifyContent: "center",
  },
  createPartyButton: {
    alignSelf: "flex-end",
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  createPartyText: {
    fontSize: 16,
    color: "white",
  },
});
