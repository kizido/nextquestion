import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText} maxFontSizeMultiplier={1}>
        Hypothetical
      </Text>
      <Link href="/funQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#007AFF" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Fun Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/deepQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#34C759" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Deep Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/personalQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#FF3B30" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Personal Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/fantasyQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#FF9500" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Fantasy Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/futureQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#FF2D55" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Future Questions
          </Text>
        </Pressable>
      </Link>
      <Link href="/mixupQuestions" asChild>
        <Pressable style={{ ...styles.button, backgroundColor: "#5856D6" }}>
          <Text style={styles.buttonText} maxFontSizeMultiplier={1}>
            Mix It Up
          </Text>
        </Pressable>
      </Link>
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
    fontSize: 48,
    fontWeight: "500",
    marginBottom: 32,
  },
  button: {
    width: "100%", // Set a fixed width
    height: 64, // Set a fixed height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
