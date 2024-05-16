import SwipeableRow from "@/components/SwipeableRow";
import UserSkeleton from "@/components/UserSkeleton";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import {
  fetchData,
  selectData,
  selectError,
  selectIsLoading,
} from "@/utils/dataSlice";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  CurvedTransition,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

const transition = CurvedTransition.delay(100);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Calls = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const editing = useSharedValue(-30);

  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const data = useSelector(selectData);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  const filterData = (query: string) => {
    const filteredData = data.filter(
      (item) =>
        item.firstName.toLowerCase().includes(query.toLowerCase()) ||
        item.lastName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredData);
  };

  useEffect(() => {
    filterData(search);
  }, [search]);

  const onEdit = () => {
    let editingNew = !isEditing;
    editing.value = editingNew ? 0 : -30;
    setIsEditing(editingNew);
  };

  const editContact = (id: any) => {
    router.push({
      pathname: "/(modals)/new-contact",
      params: { id: id },
    });
  };

  const removeCall = () => {};

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(editing.value),
      },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search",
            onChangeText: (event) => setSearch(event.nativeEvent.text),
          },
          headerLeft: () => (
            <TouchableOpacity onPress={onEdit}>
              <Text style={{ color: Colors.primary, fontSize: 18 }}>
                {isEditing ? "Done" : "Edit"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {isLoading ? (
          <UserSkeleton />
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <Animated.View style={defaultStyles.block} layout={transition}>
            <Animated.FlatList
              data={search !== "" ? searchResults : data}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={defaultStyles.separator} />
              )}
              itemLayoutAnimation={transition}
              skipEnteringExitingAnimations
              renderItem={({ item, index }) => (
                <SwipeableRow onDelete={() => removeCall()}>
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    entering={FadeInUp.delay(index * 10)}
                    exiting={FadeOutUp}
                  >
                    <AnimatedTouchableOpacity
                      onPress={() => editContact(item.id)}
                      style={[animatedRowStyle, { paddingLeft: 8 }]}
                    >
                      <Ionicons
                        name="remove-circle"
                        color={Colors.muted}
                        size={24}
                      />
                    </AnimatedTouchableOpacity>
                    <Animated.View
                      style={[
                        defaultStyles.item,
                        animatedRowStyle,
                        { paddingLeft: 10 },
                      ]}
                    >
                      <Image
                        source={{
                          uri:
                            // item.photo ||
                            "file:///Users/reskiabbas/Library/Developer/CoreSimulator/Devices/0679454E-2872-4111-BE76-74BE586503C4/data/Containers/Data/Application/AC37EC8B-29C3-467B-8CDA-DEE225986E86/Library/Caches/ImagePicker/A4E488E0-9802-404B-9D44-D9A6FD75ED9B.jpg",
                        }}
                        style={styles.avatar}
                      />
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text
                          style={{
                            fontSize: 18,
                          }}
                        >
                          {item.firstName} {item.lastName}
                        </Text>

                        <View
                          style={{ flexDirection: "row", gap: 6, marginTop: 3 }}
                        >
                          <Ionicons
                            name="cloud"
                            size={16}
                            color={Colors.cyan}
                          />

                          <Text
                            style={{
                              color: Colors.gray,
                              flex: 1,
                            }}
                          >
                            {item.age} years old
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <Text style={{ color: Colors.gray }}>Swipe Left</Text>
                        <Ionicons
                          name="arrow-back"
                          size={24}
                          color={Colors.red}
                        />
                      </View>
                    </Animated.View>
                  </Animated.View>
                </SwipeableRow>
              )}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Calls;
