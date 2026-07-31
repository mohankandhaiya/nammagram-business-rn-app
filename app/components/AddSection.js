import React, { useRef, useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function AddSection({ ads }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000); // auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, ads.length]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {ads.map((ad, index) => (
          <View key={index} style={{ width }}>
            <Image source={{ uri: ad.image }} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Indicator Dots */}
      <View style={styles.dotsContainer}>
        {ads.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",       // ✅ full device width
    height: 200,        // adjust height as needed
    resizeMode: "cover",// ✅ ensures image fills width
    // borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#006d3a",
    width: 10,
    height: 10,
  },
});




