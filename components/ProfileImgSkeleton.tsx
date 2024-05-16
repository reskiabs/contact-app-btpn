import Colors from "@/constants/Colors";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";
import { StyleSheet } from "react-native";

export default function ProfileImgSkeleton() {
  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      animate={{ backgroundColor: Colors.background }}
    >
      <View style={styles.container}>
        <Skeleton colorMode={"light"} radius="round" height={100} width={100} />

        <Skeleton colorMode={"light"} height={14} width={90} />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
});
