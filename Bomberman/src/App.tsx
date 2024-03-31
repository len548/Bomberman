import React from "react";
import { Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./view/WelcomeScreen/WelcomeScreen";
import { ConfigScreen } from "./view/ConfigScreen/ConfigScreen";
import { InstructionsScreen } from "./view/InstructionsScreen/InstructionsScreen";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme/InstructionsTheme";
import './App.css';
 
function App() {
  return (
    <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<WelcomeScreen onStart={() => console.log('Game started!')} />} />
          <Route path="/config" element={<ConfigScreen />} />
          <Route path="/instructions" element={<InstructionsScreen />} />
        </Routes>
    </ThemeProvider>
  );
}
 
export default App;