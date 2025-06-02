/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primaryColor = '#00FF00'; // Fluorescent Green
const secondaryColor = '#BB00FF'; // Fluorescent Purple

export const Colors = {
  light: {
    text: '#000000', // Black
    background: '#FFFFFF', // White
    tint: primaryColor, // Fluorescent Green for interactive elements
    icon: '#000000', // Black for default icons
    tabIconDefault: '#000000', // Black
    tabIconSelected: primaryColor, // Fluorescent Green
    primary: primaryColor,
    secondary: secondaryColor,
  },
  dark: {
    text: '#FFFFFF', // White
    background: '#000000', // Black
    tint: primaryColor, // Fluorescent Green for interactive elements
    icon: '#FFFFFF', // White for default icons
    tabIconDefault: '#FFFFFF', // White
    tabIconSelected: primaryColor, // Fluorescent Green
    primary: primaryColor,
    secondary: secondaryColor,
  },
};
