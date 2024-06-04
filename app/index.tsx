import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Link href="/funQuestions" style={{ color: "blue" }}>Go To Fun Questions</Link>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
