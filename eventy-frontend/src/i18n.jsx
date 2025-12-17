import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import onboarding from "./translations/onboarding.json";
import navbar from "./translations/navbar.json";
import footer from "./translations/footer.json";
import home from "./translations/home.json";
import login from "./translations/login.json";
import verifyEmail from "./translations/verifyEmail.json";
import contactUs from "./translations/contactUs.json";
import create from "./translations/create.json";
import createSteps from "./translations/createSteps.json";
i18n.use(initReactI18next).init({
  resources: {
    en: {
      navbar: navbar.en,
      onboarding: onboarding.en,
      footer: footer.en,
      home: home.en,
      login: login.en,
      verifyEmail: verifyEmail.en,
      contactUs: contactUs.en,
      create: create.en,
      createSteps: createSteps.en,
    },
    ar: {
      navbar: navbar.ar,
      onboarding: onboarding.ar,
      footer: footer.ar,
      home: home.ar,
      login: login.ar,
      verifyEmail: verifyEmail.ar,
      contactUs: contactUs.ar,
      create: create.ar,
      createSteps: createSteps.ar,
    },
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
