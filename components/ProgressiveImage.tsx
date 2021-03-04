import React from "react";
import {
  StyleSheet,
  View,
  ImageStyle,
  Animated,
  ImageURISource,
} from "react-native";

interface Props {
  image: string;
  style?: ImageStyle;
  defaultImage:
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation
    | Animated.WithAnimatedObject<ImageURISource>
    | Animated.WithAnimatedArray<ImageURISource>;
}
const { Value } = Animated;
const ProgressiveImage = ({ image, defaultImage, style }: Props) => {
  const defaultImageAnimated = new Value(0);
  const imageAnimated = new Value(0);

  const handleDefaultImageChange = () => {
    Animated.timing(defaultImageAnimated, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };
  const handleImageChange = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: false,
      duration: 1000,
    }).start(() => {
      Animated.timing(defaultImageAnimated, {
        toValue: 0,
        useNativeDriver: false,
        duration: 1000,
      }).start();
    });
  };

  return (
    <View>
      <Animated.Image
        source={defaultImage}
        style={[
          style,
          { opacity: defaultImageAnimated },
          {
            width: "100%",
          },
        ]}
        onLoad={handleDefaultImageChange}
        blurRadius={1}
        resizeMode="cover"
      />
      <Animated.Image
        source={{ uri: image }}
        style={[style, { opacity: imageAnimated }, styles.imageOverlay]}
        onLoad={handleImageChange}
        resizeMode="cover"
      />
    </View>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
