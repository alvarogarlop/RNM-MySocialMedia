export default {
  expo: {
    name: "RNM-SocialMedia",
    slug: "RNM-SocialMedia",
    scheme: "rnm-socialmedia",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      icon: {
        dark: "./assets/icon.png",
        light: "./assets/icon.png",
        tinted: "./assets/icon.png",
      },
      bundleIdentifier: "com.vadinsavin.RNM-SocialMedia",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.vadinsavin.RNMSocialMedia",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
      output: "server",
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "http://localhost:8081",
        },
      ],
      "expo-secure-store",
    ],
    extra: {
      router: {
        origin: "http://localhost:8081",
      },
      eas: {
        projectId: "21f0566c-63f3-47f6-9c5c-c0e208a8e670",
      },
    },
  },
};
