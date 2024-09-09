import { Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerStyle: { backgroundColor: "#1C1C1E" },
        headerTitle: "",
        headerBackTitle: "Home",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, orientation: "portrait" }} />
      {/* <Stack.Screen name="funQuestions" /> */}
    </Stack>
  );
}
