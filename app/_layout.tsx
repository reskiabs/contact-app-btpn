import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "../store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Contact",
              headerLargeTitle: true,
              headerBlurEffect: "regular",
              headerTransparent: true,

              headerRight: () => (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "App info",
                        "Swipe right to delete, Swipe down to Search Contact, Press + to add new contact and Press Edit to update contact, Thank you!"
                      )
                    }
                  >
                    <Ionicons
                      name="information-circle-outline"
                      color={Colors.primary}
                      size={30}
                    />
                  </TouchableOpacity>
                  <Link href="/(modals)/new-contact" asChild>
                    <TouchableOpacity>
                      <Ionicons
                        name="add-circle"
                        color={Colors.primary}
                        size={30}
                      />
                    </TouchableOpacity>
                  </Link>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="(modals)/new-contact"
            options={{
              presentation: "modal",
              // title: "New Contact",
              headerTransparent: true,
              headerBlurEffect: "regular",
              headerStyle: {
                backgroundColor: Colors.background,
              },
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
