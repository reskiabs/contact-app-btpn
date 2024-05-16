import BoxedIcon from "@/components/BoxedIcon";
import FormSkeleton from "@/components/FormSkeleton";
import ProfileImgSkeleton from "@/components/ProfileImgSkeleton";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import {
  fetchDetailData,
  selectDetailData,
  selectDetailLoading,
  selectError,
} from "@/utils/dataSlice";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

const devices = [
  {
    name: "Broadcast Lists",
    icon: "megaphone",
    backgroundColor: Colors.green,
  },
  {
    name: "Starred Messages",
    icon: "star",
    backgroundColor: Colors.yellow,
  },
  {
    name: "Linked Devices",
    icon: "laptop-outline",
    backgroundColor: Colors.green,
  },
];

const items = [
  {
    name: "Account",
    icon: "key",
    backgroundColor: Colors.primary,
  },
  {
    name: "Privacy",
    icon: "lock-closed",
    backgroundColor: "#33A5D1",
  },
  {
    name: "Chats",
    icon: "logo-whatsapp",
    backgroundColor: Colors.green,
  },
  {
    name: "Notifications",
    icon: "notifications",
    backgroundColor: Colors.red,
  },
  {
    name: "Storage and Data",
    icon: "repeat",
    backgroundColor: Colors.green,
  },
];

const support = [
  {
    name: "Help",
    icon: "information",
    backgroundColor: Colors.primary,
  },
  {
    name: "Tell a Friend",
    icon: "heart",
    backgroundColor: Colors.red,
  },
];

interface Contact {
  firstName: string;
  lastName: string;
  age: number;
  photo: string;
}
const NewContact = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState("");

  const detailData = useSelector(selectDetailData);
  const isLoading = useSelector(selectDetailLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailData(id) as any);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (detailData) {
      setFirstName(detailData.firstName);
      setLastName(detailData.lastName);
      setAge(detailData?.age?.toString());
      setPhoto(detailData.photo);
    }
  }, [detailData]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleFirstNameChange = (text: string) => {
    if (!/\s/.test(text)) {
      setFirstName(text);
    }
  };

  const handleLastNameChange = (text: string) => {
    if (!/\s/.test(text)) {
      setLastName(text);
    }
  };

  const handleAgeChange = (text: string) => {
    if (text.length <= 2) {
      setAge(text);
    }
  };

  const postData = async (contact: Contact) => {
    try {
      const response = await axios.post(
        "https://contact.herokuapp.com/contact",
        contact
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error while posting data:", error);
    }
  };

  const updateData = async (contact: Contact) => {
    try {
      const response = await axios.put(
        `https://contact.herokuapp.com/contact/${id}`,
        contact
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error while updating data:", error);
    }
  };

  const onSubmit = () => {
    if (id) {
      updateData({ firstName, lastName, age: parseInt(age), photo });
      router.replace("/");
    } else {
      postData({ firstName, lastName, age: parseInt(age), photo });
    }
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack.Screen
        options={{
          title: id ? "Edit Contact" : "New Contact",
          headerLeft: () => (
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={{ color: Colors.primary }}>Cancel</Text>
              </TouchableOpacity>
            </Link>
          ),
          headerRight: () => (
            <TouchableOpacity disabled={true}>
              <Text
                onPress={onSubmit}
                style={{ color: Colors.primary, fontWeight: "bold" }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {isLoading ? (
          <ProfileImgSkeleton />
        ) : photo ? (
          <View style={styles.profileContainer}>
            <Image source={{ uri: photo }} style={styles.image} />
            <TouchableOpacity onPress={() => setPhoto("")}>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "500",
                  marginTop: 10,
                }}
              >
                Reset Image
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Ionicons name="person" size={72} color={Colors.muted} />
            </View>
            <TouchableOpacity onPress={pickImage}>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: "500",
                  marginTop: 10,
                }}
              >
                Add Image
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <FormSkeleton />
        ) : (
          <View style={defaultStyles.block}>
            <TextInput
              style={styles.input}
              onChangeText={handleFirstNameChange}
              value={firstName}
              placeholder="First Name"
            />

            <View style={styles.separator} />
            <TextInput
              style={styles.input}
              onChangeText={handleLastNameChange}
              value={lastName}
              placeholder="Last Name"
            />

            <View style={styles.separator} />
            <TextInput
              style={styles.input}
              onChangeText={handleAgeChange}
              value={age}
              placeholder="Age"
              keyboardType="numeric"
            />
          </View>
        )}

        <Text style={styles.error}>
          Do not include spaces and input more than two digits!
        </Text>

        <View style={defaultStyles.block}>
          <FlatList
            data={devices}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />
                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray}
                />
              </View>
            )}
          />
        </View>

        <View style={defaultStyles.block}>
          <FlatList
            data={items}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />
                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray}
                />
              </View>
            )}
          />
        </View>

        <View style={defaultStyles.block}>
          <FlatList
            data={support}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View style={defaultStyles.separator} />
            )}
            renderItem={({ item }) => (
              <View style={defaultStyles.item}>
                <BoxedIcon
                  name={item.icon}
                  backgroundColor={item.backgroundColor}
                />
                <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.gray}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default NewContact;

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
    padding: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginLeft: 15,
  },
  imageContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: 100,
    height: 100,
    display: "flex",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  image: {
    borderRadius: 100,
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  error: {
    color: "red",
    marginLeft: 15,
    marginTop: 5,
    fontSize: 11,
  },
});
