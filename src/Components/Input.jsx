import { TextField, InputAdornment } from "@mui/material";
import { useContext } from "react";
import { FormInputContext } from "../Contexts/Context";

export default function Input() {
  const inputContext = useContext(FormInputContext);

  if (!inputContext) {
    console.error("FormInputContext is not available");
    return null;
  }

  return (
    <TextField
      id="outlined-basic"
      label={inputContext.labelTitle || ""}
      variant="outlined"
      value={inputContext.inputValue || ""}
      onChange={(e) => {
        if (inputContext.handelChange) {
          inputContext.handelChange(e.target.value);
        }
      }}
      type={inputContext.type || "text"}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderWidth: "3px",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: '20px',
            transition: "all ease-in-out 0.3s",
          },
          "&:hover fieldset": {
            borderColor: "#03235A",
            borderWidth: "3px",
            transition: "all ease-in-out 0.3s",
          },
        },
        width: "100%",
        marginBottom: 2,
        "& .MuiInputLabel-root": {
          "&.Mui-focused": {
            color: "#03235A",
            transition: "all ease-in-out 0.3s",
          },
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#03235A",
          borderWidth: "3px",
          transition: "all ease-in-out 0.3s",
        },
      }}
      error={!!inputContext.error}
      helperText={inputContext.error?.message || ""}
      InputProps={{
        startAdornment: inputContext.icon && (
          <InputAdornment position="start" sx={{ color: '#03235A' }}>
            {inputContext.icon}
          </InputAdornment>
        ),
      }}
      multiline={inputContext.multiline || false}
      rows={inputContext.rows || 1}
     
    />
  );
}