import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import hrJSON from "../locales/hr-HR.json";
//import enJSON from "../locales/en-US.json";

export const languages = [
  { code: "hr-HR", label: "Hrvatski" },
  { code: "en-US", label: "English" },
];

i18n.use(initReactI18next).init({
  resources: {
    "hr-HR": { ...hrJSON },
    //"en-US": { ...enJSON },
  },
  lng: languages[0].code, // Initial language
  fallbackLng: languages[0].code,
});
