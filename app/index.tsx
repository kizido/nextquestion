import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Hypothetical</Text>
      <Link href="/funQuestions" asChild>
        <Pressable style={{...styles.button, backgroundColor: '#8B0000'}}>
          <Text style={styles.buttonText}>Fun Questions</Text>
        </Pressable>
      </Link>
      <Link href="/deepQuestions" asChild>
      <Pressable style={{...styles.button, backgroundColor: '#00008B'}}>
          <Text style={styles.buttonText}>Deep Questions</Text>
        </Pressable>
      </Link>
      <Link href="/personalQuestions" asChild>
      <Pressable style={{...styles.button, backgroundColor: '#006400'}}>
          <Text style={styles.buttonText}>Personal Questions</Text>
        </Pressable>
      </Link>
      <Link href="/fantasyQuestions" asChild>
      <Pressable style={{...styles.button, backgroundColor: '#4B0082'}}>
          <Text style={styles.buttonText}>Fantasy Questions</Text>
        </Pressable>
      </Link>
      <Link href="/futureQuestions" asChild>
      <Pressable style={{...styles.button, backgroundColor: '#FF8C00'}}>
          <Text style={styles.buttonText}>Future Questions</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "white",
    fontSize: 48,
    fontWeight: "500",
    marginBottom: 32,
  },
  button: {
    width: 200, // Set a fixed width
    height: 60, // Set a fixed height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
