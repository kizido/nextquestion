import { Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

export default function RootLayout() {
  const navigation = useNavigation(); // Get navigation object

  return (
    <Stack
      screenOptions={{
        headerTransparent: false,
        headerStyle: { backgroundColor: "#1C1C1E" },
        headerTitle: "Hypothetical",
        headerBackTitle: "",
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerBackVisible: true,
        // headerLeft: () => <AntDesign name="home" size={32} color="white" />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, orientation: "portrait" }}
      />
    </Stack>
  );
}
