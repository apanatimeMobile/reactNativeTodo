import {useThemeContext} from "./AccentThemeProvider";

function useTheme() {
  return useThemeContext();
}

export default useTheme;
export {useTheme};