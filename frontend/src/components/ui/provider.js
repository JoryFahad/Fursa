import { ChakraProvider, ColorModeScript, localStorageManager } from "@chakra-ui/react";
import theme from "../../theme";

export function Provider({ children }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
        {children}
      </ChakraProvider>
    </>
  );
}
