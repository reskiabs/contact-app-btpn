import { defaultStyles } from "@/constants/Styles";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";
import { StyleSheet } from "react-native";

export default function UserSkeleton() {
  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      style={defaultStyles.block}
      animate={{ backgroundColor: "#ffffff" }}
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <View key={index} style={styles.container}>
          <Skeleton colorMode={"light"} radius="round" height={40} width={40} />
          <View
            style={{
              gap: 5,
            }}
          >
            <Skeleton colorMode={"light"} height={15} width={300} />
            <Skeleton colorMode={"light"} height={12} width={250} />
          </View>
        </View>
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: "center",
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "white",
    flexDirection: "column",
  },
  container: {
    padding: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
