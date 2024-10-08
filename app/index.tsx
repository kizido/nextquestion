import {
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
import React, { useState } from "react";
import { Link } from "expo-router";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import app from "../firebaseConfig";
import * as Application from "expo-application";

const HomeScreen = () => {
  const db = getFirestore(app);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSubmitQuestionOpen, setIsSubmitQuestionOpen] = useState(false);
  const [isRequestFeatureOpen, setIsRequestFeatureOpen] = useState(false);
  const [isSubmitBugOpen, setIsSubmitBugOpen] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<string>("");

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

  return (
    <View style={styles.container}>
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
            position: "absolute",
            top: 60,
            right: 30
          }}
          onPress={() => setIsFeedbackModalOpen(true)}
        >
          <Text
            maxFontSizeMultiplier={1.3}
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white"
            }}
          >
            ?
          </Text>
        </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
        <Text style={styles.titleText} maxFontSizeMultiplier={1}>
          Hypothetical
        </Text>
      </View>
      <Link href="/funQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#c97353" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Fun Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/deepQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#d9b991" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Deep Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/personalQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#6cc48c" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Personal Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/fantasyQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#c5adc7" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Fantasy Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/futureQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#9dcbd4" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Future Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/mixupQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#e76f51" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Mix It Up
          </Text>
        </Pressable>
      </Link>

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
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleText: {
    color: "white",
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 32,
  },
  button: {
    width: "90%", // Set a fixed width
    height: 64, // Set a fixed height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
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
});
