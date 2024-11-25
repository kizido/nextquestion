import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import app from "../firebaseConfig";
import {
  collection,
  addDoc,
  getFirestore,
  where,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import questions from "../deepQuestions.json";
import * as Application from "expo-application";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function DeepQuestions() {
  const db = getFirestore(app);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPartyModal, setShowPartyModal] = useState(false);

  const [players, setPlayers] = useState(["", ""]);

  const [party, setParty] = useState<string[]>([]);
  const [isParty, setIsParty] = useState(false);
  const [currentPartyIndex, setCurrentPartyIndex] = useState<number>(0);

  const [showExistingParties, setShowExistingParties] = useState(false);
  const [loadedParties, setLoadedParties] = useState<string[][]>([]);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSubmitQuestionOpen, setIsSubmitQuestionOpen] = useState(false);
  const [isRequestFeatureOpen, setIsRequestFeatureOpen] = useState(false);
  const [isSubmitBugOpen, setIsSubmitBugOpen] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<string>("");

  const [questionLikeState, setQuestionLikeState] = useState(false);
  const [questionDislikeState, setQuestionDislikeState] = useState(false);

  const [favoritedQuestions, setFavoritedQuestions] = useState<string[]>([]);

  const questionLikeInProgress = useRef(false);

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
  const [currentQuestionFavorited, setCurrentQuestionFavorited] =
    useState(false);

  const nextQuestion = () => {
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
      await AsyncStorage.setItem(`party${storageKey}`, JSON.stringify(party));
      setPlayers(["", ""]);
      setParty([]);
      setIsParty(false);
      loadPartySelection();
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
  const updateNewQuestionsToDB = async () => {
    const dbQuestions = collection(db, "questions");
    const dbQuestionsSnapshot = await getDocs(dbQuestions);
    const dbQuestionDocumentList = dbQuestionsSnapshot.docs.map((doc) =>
      doc.data()
    );

    for (let i = 0; i < questions.length; i++) {
      // If the question in the JSON is not in the online DB, add it
      if (
        !dbQuestionDocumentList.some((doc) => doc.question === questions[i])
      ) {
        addDoc(dbQuestions, {
          question: questions[i],
          packId: "base",
          category: "deep",
        });
      }
    }
  };
  const getDbQuestions = async () => {
    // const dbQuestions = collection(db, "questions");
    // const dbQuestionsSnapshot = await getDocs(dbQuestions);
    // const dbQuestionsList = dbQuestionsSnapshot.docs.map((doc) => doc.data());
  };
  const writeQuestionSubmissionToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbQuestionSubmissions = collection(db, "questionSubmissions");
    addDoc(dbQuestionSubmissions, { question: feedbackValue, userId: iosId });
    setFeedbackValue("");
  };
  const writeFeatureRequestToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbFeatureRequests = collection(db, "featureRequests");
    addDoc(dbFeatureRequests, { feature: feedbackValue, userId: iosId });
    setFeedbackValue("");
  };
  const writeBugReportToDatabase = async () => {
    const iosId = await Application.getIosIdForVendorAsync();
    const dbBugReports = collection(db, "bugReports");
    addDoc(dbBugReports, { bug: feedbackValue, userId: iosId });
    setFeedbackValue("");
  };
  useEffect(() => {
    getFavoritedQuestions();
    // getCurrentParty();
    // getDbQuestions();

    // RUN THIS CODE TO SYNC ONLINE DB TO LOCAL
    // updateNewQuestionsToDB();

    // Application.getIosIdForVendorAsync().then((iosId) => { console.log(iosId )});
  }, []);
  // useEffect(() => {
  //   if (party.length > 0) {
  //     setIsParty(true);
  //   } else {
  //     setIsParty(false);
  //   }
  // }, [party]);
  // useEffect(() => {
  //   if (showPartyModal) {
  //     loadPartySelection();
  //   }
  // }, [showPartyModal]);
  // useEffect(() => {
  //   let isCancelled = false;

  //   const getQuestionLikeState = async () => {
  //     setQuestionLikeState(false);
  //     setQuestionDislikeState(false);
  //     const iosId = await Application.getIosIdForVendorAsync();

  //     const questionsCol = collection(db, "questions");
  //     const q = query(questionsCol, where("question", "==", currentQuestion));
  //     const querySnapshot = await getDocs(q);
  //     if (!isCancelled) {
  //       if (!querySnapshot.empty) {
  //         console.log("QUESTION FOUND!");
  //         const doc = querySnapshot.docs[0];

  //         const docRef = doc.ref;

  //         const likersCol = collection(docRef, "likeIds");
  //         const likersQ = query(likersCol, where("id", "==", iosId));
  //         const likerSnapshot = await getDocs(likersQ);

  //         if (!isCancelled) {
  //           if (!likerSnapshot.empty) {
  //             console.log("IOS ID FOUND IN LIKERS!");
  //             setQuestionLikeState(true);
  //           } else {
  //             console.log("IOS ID NOT FOUND IN LIKERS!");
  //             const dislikersCol = collection(docRef, "dislikeIds");
  //             const dislikersQ = query(dislikersCol, where("id", "==", iosId));
  //             const dislikerSnapshot = await getDocs(dislikersQ);

  //             if (!isCancelled && !dislikerSnapshot.empty) {
  //               console.log("IOS ID FOUND IN DISLIKERS");
  //               setQuestionDislikeState(true);
  //             }
  //           }
  //         }
  //       } else {
  //         console.log("QUESTION NOT FOUND!");
  //       }
  //     }
  //   };
  //   getQuestionLikeState();

  //   return () => {
  //     isCancelled = true;
  //   };
  // }, [currentQuestion]);
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
  const likeQuestion = async () => {
    if (questionLikeInProgress.current) {
      return;
    }
    questionLikeInProgress.current = true;
    const iosId = await Application.getIosIdForVendorAsync();

    const questionCol = collection(db, "questions");
    const questionQuery = query(
      questionCol,
      where("question", "==", currentQuestion)
    );
    const questionSnapshot = await getDocs(questionQuery);
    if (!questionSnapshot.empty) {
      console.log("FOUND QUESTION TO LIKE");
      const questionDoc = questionSnapshot.docs[0].ref;
      const questionLikeCol = collection(questionDoc, "likeIds");
      if (questionLikeState === true) {
        const questionLikerQuery = query(
          questionLikeCol,
          where("id", "==", iosId)
        );
        const questionLikerSnapshot = await getDocs(questionLikerQuery);
        const questionLikerDoc = questionLikerSnapshot.docs[0].ref;
        deleteDoc(questionLikerDoc);
        setQuestionLikeState(false);
      } else {
        // Delete id from dislike id list if applicable (so you can't have like and dislike both selected simultaneously)
        const questionDislikeCol = collection(questionDoc, "dislikeIds");
        const questionDislikeQuery = query(
          questionDislikeCol,
          where("id", "==", iosId)
        );
        const questionDislikeSnapshot = await getDocs(questionDislikeQuery);
        if (!questionDislikeSnapshot.empty) {
          const questionDislikeDoc = questionDislikeSnapshot.docs[0].ref;
          deleteDoc(questionDislikeDoc);
        }

        addDoc(questionLikeCol, { id: iosId });
        setQuestionDislikeState(false);
        setQuestionLikeState(true);
      }
    }
    questionLikeInProgress.current = false;
  };
  const dislikeQuestion = async () => {
    if (questionLikeInProgress.current) {
      return;
    }
    questionLikeInProgress.current = true;

    console.log("QUESTION DISLIKE BUTTON PRESSED");
    const iosId = await Application.getIosIdForVendorAsync();

    const questionCol = collection(db, "questions");
    const questionQuery = query(
      questionCol,
      where("question", "==", currentQuestion)
    );
    const questionSnapshot = await getDocs(questionQuery);
    if (!questionSnapshot.empty) {
      console.log("FOUND QUESTION TO DISLIKE");
      const questionDoc = questionSnapshot.docs[0].ref;
      const questionDislikeCol = collection(questionDoc, "dislikeIds");
      if (questionDislikeState === true) {
        const questionDislikerQuery = query(
          questionDislikeCol,
          where("id", "==", iosId)
        );
        const questionDislikerSnapshot = await getDocs(questionDislikerQuery);
        const questionDislikerDoc = questionDislikerSnapshot.docs[0].ref;
        deleteDoc(questionDislikerDoc);
        setQuestionDislikeState(false);
      } else {
        // Delete id from like id list if applicable
        const questionLikeCol = collection(questionDoc, "likeIds");
        const questionLikeQuery = query(
          questionLikeCol,
          where("id", "==", iosId)
        );
        const questionLikeSnapshot = await getDocs(questionLikeQuery);
        if (!questionLikeSnapshot.empty) {
          const questionLikeDoc = questionLikeSnapshot.docs[0].ref;
          deleteDoc(questionLikeDoc);
        }

        addDoc(questionDislikeCol, { id: iosId });
        setQuestionLikeState(false);
        setQuestionDislikeState(true);
      }
    }
    questionLikeInProgress.current = false;
  };
  const getFavoritedQuestions = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        const favoritesParsedArray: string[] = JSON.parse(favorites);
        setFavoritedQuestions(favoritesParsedArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const favoriteQuestion = async () => {
    try {
      if (favoritedQuestions.includes(currentQuestion)) {
        setFavoritedQuestions(
          favoritedQuestions.filter(
            (favQuestion) => favQuestion !== currentQuestion
          )
        );
        setCurrentQuestionFavorited(false);
      } else {
        setFavoritedQuestions([...favoritedQuestions, currentQuestion]);
        setCurrentQuestionFavorited(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            backgroundColor: "black",
            borderRadius: 32,
            borderWidth: 1,
            borderColor: "white",
          }}
          onPress={() => setIsFeedbackModalOpen(true)}
        >
          <Text
            maxFontSizeMultiplier={1.3}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            ?
          </Text>
        </TouchableOpacity>
      </View> */}

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

      {/* {isParty ? (
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
      )} */}

      {/* <Text style={{ color: "white", fontSize: 24, fontWeight: 800 }}>
        Hypothetical
      </Text> */}
      <View></View>
      <View style={styles.questionContainer}>
        {/* <Text></Text> */}
        <Image
          source={require("../assets/images/fullLogo.png")}
          style={{ width: 125, height: 70, marginTop: 20 }}
          resizeMode="contain"
        />
        <View style={{ paddingHorizontal: 32 }}>
          <Text style={styles.questionText} maxFontSizeMultiplier={1}>
            {currentQuestion}
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
            // setQuestionFavorited(!questionFavorited);
            favoriteQuestion();
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
      {/* <View style={styles.likeRow}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 48,
            backgroundColor: "#FA3C1F",
            justifyContent: "center",
            alignItems: "center",
            borderColor: questionDislikeState ? "#9e1b2b" : "transparent",
            borderWidth: 5,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
          onPress={() => dislikeQuestion()}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "700" }}
            maxFontSizeMultiplier={1}
          >
            Don't Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 48,
            backgroundColor: "#00E868",
            justifyContent: "center",
            alignItems: "center",
            borderColor: questionLikeState ? "#3d7548" : "transparent",
            borderWidth: 5,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
          }}
          onPress={() => likeQuestion()}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "700" }}
            maxFontSizeMultiplier={1}
          >
            Good Question
          </Text>
        </TouchableOpacity>
      </View> */}
      <StatusBar style="auto" />
      <View style={styles.questionArrowRow}>
        <AntDesign
          name="arrowleft"
          size={48}
          color={currentIndex == 0 ? "gray" : "white"}
          onPress={previousQuestion}
        />
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
          {/* <Text
            maxFontSizeMultiplier={1}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            ?
          </Text> */}
          <AntDesign name="form" size={20} color="black" />
        </TouchableOpacity>
        <AntDesign
          name="arrowright"
          size={48}
          color={currentIndex >= questions.length - 1 ? "gray" : "white"}
          onPress={nextQuestion}
        />
        {/* <TouchableOpacity onPress={previousQuestion} activeOpacity={1}>
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
        </TouchableOpacity> */}
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
          <Text style={styles.closeButtonText} maxFontSizeMultiplier={1}>
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
                <Text style={styles.formTitle} maxFontSizeMultiplier={1}>
                  {isParty ? "Edit Party" : "Create a Party"}
                </Text>
                <Pressable onPress={addPlayer}>
                  <Text style={styles.addPlayer} maxFontSizeMultiplier={1}>
                    Add a Player
                  </Text>
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
    backgroundColor: "#bf9562",
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
