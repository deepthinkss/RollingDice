import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageSourcePropType,
  Pressable,
  Animated,
  Dimensions,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import DiceOne from "../assets/One.png";
import DiceTwo from "../assets/Two.png";
import DiceThree from "../assets/Three.png";
import DiceFour from "../assets/Four.png";
import DiceFive from "../assets/Five.png";
import DiceSix from "../assets/Six.png";

const { width, height } = Dimensions.get("window");

const diceOptions: { [key: number]: ImageSourcePropType[] } = {
  6: [DiceOne, DiceTwo, DiceThree, DiceFour, DiceFive, DiceSix],
};

const funFacts = [
  "Did you know? Rolling a 6 on a fair dice has a 1/6 chance!",
  "Believe in yourself! Every roll is a new opportunity.",
  "Fun Fact: The first dice were made from animal bones.",
  "Keep rolling! You're doing great.",
  "A small roll can lead to a big outcome. Just try!",
];

function App(): JSX.Element {
  const [diceImage, setDiceImage] = useState<ImageSourcePropType>(DiceOne);
  const [diceSides, setDiceSides] = useState<number>(6);
  const [score, setScore] = useState<number>(0);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [funFact, setFunFact] = useState<string>("Roll the dice to see a fun fact!");
  const diceAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(1)).current;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/dice-roll.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const rollDiceOnTap = async () => {
    await playSound();

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Dice bounce animation
    Animated.sequence([
      Animated.timing(diceAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    let randomNumber = Math.floor(Math.random() * diceSides) + 1;
    setDiceImage(diceOptions[diceSides][randomNumber - 1]);
    setScore(score + randomNumber);
    setRollHistory([randomNumber, ...rollHistory]);
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
  };

  const resetHistory = () => {
    setRollHistory([]);
    setScore(0);
    setFunFact("Roll the dice to see a fun fact!");
  };

  const diceStyle = {
    transform: [
      {
        scale: diceAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  const buttonStyle = {
    transform: [{ scale: buttonAnimation }],
  };

  const AppBar = () => (
    <LinearGradient
      colors={["#3399ff", "#8EA7E9"]}
      style={styles.appBar}
    >
      <Text style={styles.appBarTitle}>RollaDice</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={["#8EA7E9", "#E2E8F4"]} // Gradient background for the entire screen
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppBar />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          {/* Dice Card */}
          <LinearGradient
            colors={["#FFFFFF", "#E2E8e4"]}
            style={styles.card}
          >
            <Animated.View style={[styles.diceContainer, diceStyle]}>
              <Image style={styles.diceImage} source={diceImage} />
            </Animated.View>
          </LinearGradient>

          {/* Button Card */}
          <LinearGradient
            colors={["#8EA7E9", "#ffffff"]}
            style={styles.card}
          >
            <Animated.View style={buttonStyle}>
              <Pressable style={styles.rollDiceBtn} onPress={rollDiceOnTap}>
                <Text style={styles.rollDiceBtnText}>Roll the Dice</Text>
              </Pressable>
            </Animated.View>
          </LinearGradient>

          {/* Fun Fact Card */}
          <LinearGradient
            colors={["#FFFFFF", "#F5F5F5"]}
            style={styles.card}
          >
            <Text style={styles.funFact}>{funFact}</Text>
          </LinearGradient>

          {/* Score and History Card */}
          <LinearGradient
            colors={["#FFFFFF", "#F5F5F5"]}
            style={styles.card}
          >
            <Text style={styles.scoreText}>Total Score: {score}</Text>
            <Text style={styles.historyTitle}>Roll History:</Text>
            <FlatList
              data={rollHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Text style={styles.historyItem}>
                  Roll {index + 1}: {item}
                </Text>
              )}
            />
            <Pressable style={styles.resetButton} onPress={resetHistory}>
              <Text style={styles.resetButtonText}>Reset History</Text>
            </Pressable>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Ensure the gradient covers the entire screen
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  appBar: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  appBarTitle: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "800",
    textTransform: "uppercase",
    paddingTop: 20,
  },
  card: {
    width: "90%",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 25,
    alignItems: "center",
  },
  diceContainer: {
    alignItems: "center",
  },
  diceImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  rollDiceBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  rollDiceBtnText: {
    fontSize: 20,
    color: "#555555",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  funFact: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#4A4A4A",
    textAlign: "center",
    lineHeight: 24,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A4A4A",
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
  },
  resetButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

export default App;