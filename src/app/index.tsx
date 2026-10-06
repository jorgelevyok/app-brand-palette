import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Dialog,
  Divider,
  FAB,
  IconButton,
  List,
  ProgressBar,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useModo } from "@/app/_layout";

const PRESUPUESTO = 400_000;

type Movimiento = {
  id: string;
  titulo: string;
  detalle: string;
  monto: number;
  icono: string;
  ingreso: boolean;
};

const movimientosIniciales: Movimiento[] = [
  {
    id: "1",
    titulo: "Supermercado",
    detalle: "Comida",
    monto: 25_000,
    icono: "cart-outline",
    ingreso: false,
  },
  {
    id: "2",
    titulo: "Uber",
    detalle: "Transporte",
    monto: 8_500,
    icono: "car-outline",
    ingreso: false,
  },
  {
    id: "3",
    titulo: "Sueldo",
    detalle: "Ingreso",
    monto: 750_000,
    icono: "cash",
    ingreso: true,
  },
];

function pesos(valor: number) {
  const texto = Math.abs(valor).toLocaleString("es-AR");
  return valor < 0 ? `-$${texto}` : `$${texto}`;
}

function iconoPara(detalle: string, ingreso: boolean) {
  if (ingreso) return "cash";
  const texto = detalle.toLowerCase();
  if (texto.includes("trans")) return "car-outline";
  if (texto.includes("comida") || texto.includes("super")) return "cart-outline";
  return "receipt-outline";
}

export default function Index() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { oscuro, cambiarOscuro } = useModo();
  const [movimientos, setMovimientos] = useState(movimientosIniciales);
  const [ingresos, setIngresos] = useState(750_000);
  const [gastos, setGastos] = useState(264_700);
  const [formulario, setFormulario] = useState(false);
  const [aviso, setAviso] = useState("");
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("gasto");
  const [error, setError] = useState("");
  const espacioInferior = insets.bottom + 16;
  const saldo = ingresos - gastos;
  const progreso = Math.min(gastos / PRESUPUESTO, 1);

  function abrirFormulario() {
    setTitulo("");
    setDetalle("");
    setMonto("");
    setTipo("gasto");
    setError("");
    setFormulario(true);
  }

  function guardarMovimiento() {
    const concepto = titulo.trim();
    const valor = Number(monto.replace(/\D/g, ""));
    const ingreso = tipo === "ingreso";

    if (!concepto) {
      setError("Escribí un concepto.");
      return;
    }

    if (!valor) {
      setError("El monto tiene que ser mayor a 0.");
      return;
    }

    const categoria = detalle.trim() || (ingreso ? "Ingreso" : "Gasto");
    const nuevo: Movimiento = {
      id: Date.now().toString(),
      titulo: concepto,
      detalle: categoria,
      monto: valor,
      icono: iconoPara(categoria, ingreso),
      ingreso,
    };

    setMovimientos((lista) => [nuevo, ...lista]);
    if (ingreso) setIngresos((actual) => actual + valor);
    else setGastos((actual) => actual + valor);
    setFormulario(false);
    setAviso("Movimiento agregado");
  }

  return (
    <View style={[styles.pantalla, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Actividad Nº5" />
        <IconButton
          icon={oscuro ? "weather-sunny" : "weather-night"}
          onPress={() => cambiarOscuro(!oscuro)}
          accessibilityLabel={oscuro ? "Modo claro" : "Modo oscuro"}
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={[
          styles.cuerpo,
          { paddingBottom: espacioInferior + 88 },
        ]}
      >
        <Card>
          <Card.Content style={styles.saldo}>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Saldo disponible
            </Text>
            <Text variant="headlineLarge">{pesos(saldo)}</Text>

            <View style={styles.resumen}>
              <View style={styles.columna}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Ingresos
                </Text>
                <Text
                  variant="titleMedium"
                  style={{ color: theme.colors.primary }}
                >
                  {pesos(ingresos)}
                </Text>
              </View>
              <View style={styles.columna}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Gastos
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                  {pesos(gastos)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bloque}>
          <Text variant="titleMedium">Presupuesto mensual</Text>
          <ProgressBar progress={progreso} color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {pesos(gastos)} de {pesos(PRESUPUESTO)}
          </Text>
        </View>

        <View style={styles.bloque}>
          <Text variant="titleMedium">Últimos movimientos</Text>
          {movimientos.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.titulo}
                description={item.detalle}
                style={styles.item}
                left={(props) => <List.Icon {...props} icon={item.icono} />}
                right={() => (
                  <Text
                    variant="titleMedium"
                    style={{
                      color: item.ingreso
                        ? theme.colors.primary
                        : theme.colors.error,
                      alignSelf: "center",
                    }}
                  >
                    {item.ingreso ? `+${pesos(item.monto)}` : `-${pesos(item.monto)}`}
                  </Text>
                )}
              />
              {index < movimientos.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primaryContainer,
            bottom: espacioInferior,
          },
        ]}
        color={theme.colors.onPrimaryContainer}
        onPress={abrirFormulario}
        accessibilityLabel="Agregar movimiento"
      />

      <Dialog visible={formulario} onDismiss={() => setFormulario(false)}>
        <Dialog.Title>Nuevo movimiento</Dialog.Title>
        <Dialog.Content style={styles.formulario}>
          <TextInput
            label="Concepto"
            value={titulo}
            onChangeText={(texto) => {
              setTitulo(texto);
              setError("");
            }}
            mode="outlined"
          />
          <TextInput
            label="Categoría"
            value={detalle}
            onChangeText={(texto) => {
              setDetalle(texto);
              setError("");
            }}
            mode="outlined"
            placeholder="Comida, transporte..."
          />
          <TextInput
            label="Monto"
            value={monto ? Number(monto).toLocaleString("es-AR") : ""}
            onChangeText={(texto) => {
              setMonto(texto.replace(/\D/g, ""));
              setError("");
            }}
            mode="outlined"
            keyboardType="number-pad"
            left={<TextInput.Affix text="$" />}
          />
          <SegmentedButtons
            value={tipo}
            onValueChange={(valor) => {
              setTipo(valor);
              setError("");
            }}
            buttons={[
              { value: "gasto", label: "Gasto", icon: "cash-minus" },
              { value: "ingreso", label: "Ingreso", icon: "cash-plus" },
            ]}
          />
          {error ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
              {error}
            </Text>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setFormulario(false)}>Cancelar</Button>
          <Button mode="contained" onPress={guardarMovimiento}>
            Guardar
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Snackbar
        visible={aviso.length > 0}
        onDismiss={() => setAviso("")}
        duration={2500}
      >
        {aviso}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  cuerpo: {
    padding: 20,
    gap: 24,
  },
  saldo: {
    gap: 8,
  },
  resumen: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  columna: {
    flex: 1,
    gap: 2,
  },
  bloque: {
    gap: 12,
  },
  item: {
    paddingHorizontal: 0,
  },
  fab: {
    position: "absolute",
    right: 20,
  },
  formulario: {
    gap: 12,
  },
});
