import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Clase 4: Concurrencia en Mobile</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">📚 Tema de la clase</ThemedText>
        <ThemedText>
          Hoy aprenderemos sobre{' '}
          <ThemedText type="defaultSemiBold">Concurrencia y Consistencia</ThemedText> en
          aplicaciones móviles.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">💡 Conceptos clave</ThemedText>
        <ThemedText>
          {'\u2022'} <ThemedText type="defaultSemiBold">Optimistic UI:</ThemedText> actualizar la interfaz antes de recibir confirmación del servidor{'\n'}
          {'\u2022'} <ThemedText type="defaultSemiBold">Idempotencia:</ThemedText> usar Request IDs únicos para prevenir duplicados{'\n'}
          {'\u2022'} <ThemedText type="defaultSemiBold">Retry Strategies:</ThemedText> reintentos automáticos con exponential backoff{'\n'}
          {'\u2022'} <ThemedText type="defaultSemiBold">Estado de UI:</ThemedText> manejo claro de estados (idle, loading, success, error){'\n'}
          {'\u2022'} <ThemedText type="defaultSemiBold">Double-tap prevention:</ThemedText> evitar toques múltiples accidentales
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🎯 Demo interactiva</ThemedText>
        <ThemedText>
          Ve a la pestaña{' '}
          <ThemedText type="defaultSemiBold">"Inscripción"</ThemedText> para ver una
          demostración completa de todos estos conceptos en acción.
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Podrás inscribirte en materias, ver estados en tiempo real, simular errores de red
          y observar cómo funcionan las estrategias de reintentos.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🛠️ Actividad para estudiantes</ThemedText>
        <ThemedText>
          Implementa un cliente móvil con:{'\n'}
          1. Botón "Inscribirse" con Request ID único{'\n'}
          2. Estados visibles (Loading, Success, Error){'\n'}
          3. Prevención de doble clic{'\n'}
          4. Pruebas con/sin conexión{'\n\n'}
          <ThemedText type="defaultSemiBold">Entrega: Martes 14 Oct</ThemedText>
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
