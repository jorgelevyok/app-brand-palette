import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createContext, useContext, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from "react-native-paper";

type Modo = {
  oscuro: boolean;
  cambiarOscuro: (valor: boolean) => void;
};

const ModoContext = createContext<Modo>({
  oscuro: false,
  cambiarOscuro: () => {},
});

export function useModo() {
  return useContext(ModoContext);
}

export default function RootLayout() {
  const [oscuro, setOscuro] = useState(false);

  return (
    <ModoContext.Provider value={{ oscuro, cambiarOscuro: setOscuro }}>
      <PaperProvider
        theme={oscuro ? MD3DarkTheme : MD3LightTheme}
        settings={{
          icon: ({ name, color, size, direction }) => (
            <MaterialCommunityIcons
              name={name}
              color={color}
              size={size}
              style={{ transform: [{ scaleX: direction === "rtl" ? -1 : 1 }] }}
            />
          ),
        }}
      >
        <StatusBar style={oscuro ? "light" : "dark"} />
        <Navegacion />
      </PaperProvider>
    </ModoContext.Provider>
  );
}

function Navegacion() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
