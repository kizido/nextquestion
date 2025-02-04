import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "../firebaseConfig";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import * as Application from "expo-application";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function FavoriteQuestions() {
  const db = getFirestore(app);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSubmitQuestionOpen, setIsSubmitQuestionOpen] = useState(false);
  const [isRequestFeatureOpen, setIsRequestFeatureOpen] = useState(false);
  const [isSubmitBugOpen, setIsSubmitBugOpen] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<string>("");

  const [questions, setQuestions] = useState<string[]>([]);
  const [favoritedQuestions, setFavoritedQuestions] = useState<string[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionFavorited, setCurrentQuestionFavorited] =
    useState(false);

  const questionsLoaded = useRef(false);

  useEffect(() => {
    const getFavoriteQuestions = async () => {
      try {
        const favoriteQuestions = await AsyncStorage.getItem("favorites");
        if (favoriteQuestions !== null && favoriteQuestions.length > 0) {
          const favoriteQuestionsParsed: string[] =
            JSON.parse(favoriteQuestions);
          setQuestions(favoriteQuestionsParsed);
          setFavoritedQuestions(favoriteQuestionsParsed);
          setCurrentQuestion(favoriteQuestionsParsed[0]);
        }
      } catch (error) {
        console.log(error);
      }
      questionsLoaded.current = true;
    };
    getFavoriteQuestions();
  }, []);
  useEffect(() => {
    if (favoritedQuestions?.includes(currentQuestion)) {
      setCurrentQuestionFavorited(true);
    } else {
      setCurrentQuestionFavorited(false);
    }
  }, [currentQuestion]);
  useEffect(() => {
    const updateFavoritedQuestionsInStorage = async () => {
      try {
        const stringifiedFavorites = JSON.stringify(favoritedQuestions);
        await AsyncStorage.setItem("favorites", stringifiedFavorites);
      } catch (error) {
        console.log(error);
      }
    };
    updateFavoritedQuestionsInStorage();
  }, [favoritedQuestions]);
  useEffect(() => {
    if (questionsLoaded.current) {
      if (questions.length < 1) {
        setCurrentQuestion("");
      } else if (currentIndex >= questions.length) {
        const newIndex = currentIndex - 1;
        setCurrentQuestion(questions[newIndex]);
        setCurrentIndex(newIndex);
      } else {
        setCurrentQuestion(questions[currentIndex]);
      }
    }
  }, [questions]);
  const unfavoriteQuestion = async () => {
    try {
      if (favoritedQuestions.includes(currentQuestion)) {
        setFavoritedQuestions(
          favoritedQuestions.filter(
            (favQuestion) => favQuestion !== currentQuestion
          )
        );
        setQuestions(
          questions.filter((question) => question !== currentQuestion)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const nextQuestion = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    }
  };
  const previousQuestion = () => {
    let nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    }
  };

  const writeQuestionSubmissionToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbQuestionSubmissions = collection(db, "questionSubmissions");
    if (feedbackValue.trim() !== "") {
      await addDoc(dbQuestionSubmissions, {
        question: feedbackValue,
        userId: iosId,
      });
    }
    setFeedbackValue("");
  };
  const writeFeatureRequestToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbFeatureRequests = collection(db, "featureRequests");
    if (feedbackValue.trim() !== "") {
      await addDoc(dbFeatureRequests, {
        feature: feedbackValue,
        userId: iosId,
      });
    }
    setFeedbackValue("");
  };
  const writeBugReportToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbBugReports = collection(db, "bugReports");
    if (feedbackValue.trim() !== "") {
      await addDoc(dbBugReports, { bug: feedbackValue, userId: iosId });
    }
    setFeedbackValue("");
  };
  const createTwoButtonAlert = () =>
    Alert.alert("Are you sure you want to unfavorite this question?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => unfavoriteQuestion() },
    ]);
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFeedbackModalOpen}
        onRequestClose={() => setIsFeedbackModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setIsFeedbackModalOpen(false);
            setIsSubmitQuestionOpen(false);
            setIsRequestFeatureOpen(false);
            setIsSubmitBugOpen(false);
            setFeedbackValue("");
          }}
        >
          <Text style={styles.closeButtonText} maxFontSizeMultiplier={1}>
            X
          </Text>
        </TouchableOpacity>

        {!isSubmitQuestionOpen && !isRequestFeatureOpen && !isSubmitBugOpen && (
          <View style={styles.feedbackModalContainer}>
            <TouchableOpacity
              style={styles.feedbackModalButton}
              onPress={() => setIsSubmitQuestionOpen(true)}
            >
              <Text
                style={styles.feedbackModalText}
                maxFontSizeMultiplier={1.5}
              >
                Submit a New Question
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.feedbackModalButton}
              onPress={() => setIsRequestFeatureOpen(true)}
            >
              <Text
                style={styles.feedbackModalText}
                maxFontSizeMultiplier={1.5}
              >
                Request a Feature
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.feedbackModalButton}
              onPress={() => setIsSubmitBugOpen(true)}
            >
              <Text
                style={styles.feedbackModalText}
                maxFontSizeMultiplier={1.5}
              >
                Report a Bug
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {isSubmitQuestionOpen && (
          <ScrollView
            contentContainerStyle={styles.feedbackSubmissionFormContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{ fontSize: 20, color: "white", textAlign: "center" }}
              maxFontSizeMultiplier={2}
            >
              Enter a Question Submission
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                height: 128,
                padding: 16,
                fontSize: 16,
              }}
              multiline={true}
              numberOfLines={4}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              value={feedbackValue}
              onChangeText={(text) => setFeedbackValue(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: "lightgray", width: "100%" }}
              onPress={() => {
                writeQuestionSubmissionToDatabase();
                setIsSubmitQuestionOpen(false);
                setIsFeedbackModalOpen(false);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 8,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {isRequestFeatureOpen && (
          <ScrollView
            contentContainerStyle={styles.feedbackSubmissionFormContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{ fontSize: 20, color: "white", textAlign: "center" }}
              maxFontSizeMultiplier={2}
            >
              Enter a Feature Request
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                height: 128,
                padding: 16,
                fontSize: 16,
              }}
              multiline={true}
              numberOfLines={4}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              value={feedbackValue}
              onChangeText={(text) => setFeedbackValue(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: "lightgray", width: "100%" }}
              onPress={() => {
                writeFeatureRequestToDatabase();
                setIsRequestFeatureOpen(false);
                setIsFeedbackModalOpen(false);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 8,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {isSubmitBugOpen && (
          <ScrollView
            contentContainerStyle={styles.feedbackSubmissionFormContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={{ fontSize: 20, color: "white", textAlign: "center" }}
              maxFontSizeMultiplier={2}
            >
              Report a Bug
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "100%",
                height: 128,
                padding: 16,
                fontSize: 16,
              }}
              multiline={true}
              numberOfLines={4}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
              value={feedbackValue}
              onChangeText={(text) => setFeedbackValue(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: "lightgray", width: "100%" }}
              onPress={() => {
                writeBugReportToDatabase();
                setIsSubmitBugOpen(false);
                setIsFeedbackModalOpen(false);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  padding: 8,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>

      <View></View>
      <View style={styles.questionContainer}>
        <Image
          source={require("../assets/images/fullLogo.png")}
          style={{ width: 125, height: 70, marginTop: 20 }}
          resizeMode="contain"
        />
        <View style={{ paddingHorizontal: 32 }}>
          <Text style={styles.questionText} maxFontSizeMultiplier={1}>
            {questions.length >= 1
              ? currentQuestion
              : "You have no favorited questions yet."}
          </Text>
        </View>
        <Image
          source={require("../assets/images/fullLogo.png")}
          style={{
            width: 125,
            height: 70,
            marginBottom: 20,
            tintColor: "white",
          }}
          resizeMode="contain"
        />
      </View>
      {questions.length >= 1 && (
        <View style={styles.likeRow}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 48,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              // borderColor: questionLikeState ? "#3d7548" : "transparent",
              // borderWidth: 5,
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              gap: 16,
            }}
            onPress={() => {
              createTwoButtonAlert();
            }}
          >
            <AntDesign
              name={currentQuestionFavorited ? "star" : "staro"}
              size={36}
              color="#F9AB05"
            />
            <Text
              style={{ fontSize: 16, fontWeight: "700" }}
              maxFontSizeMultiplier={1}
            >
              {currentQuestionFavorited
                ? "Added to Favorites!"
                : "Add to Favorites!"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
      <View style={styles.questionArrowRow}>
        {questions.length >= 1 ? (
          <AntDesign
            name="arrowleft"
            size={48}
            color={currentIndex == 0 ? "gray" : "white"}
            onPress={previousQuestion}
          />
        ) : (
          <View />
        )}
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 48,
            height: 48,
            backgroundColor: "white",
            borderRadius: 32,
            borderWidth: 2,
            borderColor: "black",
          }}
          onPress={() => setIsFeedbackModalOpen(true)}
        >
          <AntDesign name="form" size={20} color="black" />
        </TouchableOpacity>
        {questions.length >= 1 ? (
          <AntDesign
            name="arrowright"
            size={48}
            color={currentIndex >= questions.length - 1 ? "gray" : "white"}
            onPress={nextQuestion}
          />
        ) : (
          <View />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fab625",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 36,
    paddingVertical: 30,
  },
  questionContainer: {
    // flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 8,
  },
  questionText: {
    color: "black",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  questionArrowRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
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
  feedbackSubmissionFormContainer: {
    paddingHorizontal: 64,
    paddingVertical: 128,
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 24,
  },
  feedbackModalContainer: {
    paddingHorizontal: 32,
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  feedbackModalButton: {
    backgroundColor: "white",
    width: "80%",
    paddingVertical: 16,
  },
  feedbackModalText: {
    textAlign: "center",
    fontSize: 20,
  },
  closeButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    top: 60,
    right: 30,
    zIndex: 1,
    backgroundColor: "black",
    borderRadius: 32,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "white",
  },
  closeButtonText: {
    fontSize: 24,
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
