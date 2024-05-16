import { defaultStyles } from "@/constants/Styles";
import { MotiView, View } from "moti";
import { Skeleton } from "moti/skeleton";
import { StyleSheet } from "react-native";

export default function FormSkeleton() {
  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      style={defaultStyles.block}
      animate={{ backgroundColor: "#ffffff" }}
    >
      <View style={styles.container}>
        <View
          style={{
            gap: 13,
          }}
        >
          <Skeleton colorMode={"light"} height={14} width={200} />
          <Skeleton colorMode={"light"} height={14} width={150} />
          <Skeleton colorMode={"light"} height={14} width={100} />
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
