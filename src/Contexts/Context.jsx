import { createContext } from "react";

export let FormInputContext = createContext({
  labelTitle: "",
  handelChange: null,
  inputValue: "",
  type: '',
  icon: null,  
  register: null, 
  error: null,
  sx: {} 
});