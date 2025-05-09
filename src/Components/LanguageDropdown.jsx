import React, { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import Fr from "../assets/fr.svg";
import En from "../assets/en.svg";
import Ar from "../assets/ar.svg";

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "ar", name: "العربية", flag: Ar },
    { code: "en", name: "English", flag: En },
    { code: "fr", name: "Français", flag: Fr },
  ];

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <>
      <Select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        displayEmpty
        inputProps={{ "aria-label": "Select language" }}
        sx={{
          borderRadius: "4px",
          padding: "8px",
          maxWidth: "200px",
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <span style={{ marginRight: "8px" }}>
              <img src={lang.flag} alt={lang.name} width="20" height="20" />
            </span>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
