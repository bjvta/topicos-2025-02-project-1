// Polyfill for crypto.getRandomValues() - MUST be imported first!
import 'react-native-get-random-values';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { v4 as uuidv4 } from 'uuid';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * CLASE 4: Demostración de Concurrencia y Consistencia en Mobile
 *
 * Conceptos demostrados:
 * 1. ✅ Idempotencia con Request ID único
 * 2. ✅ Manejo de estados (idle, loading, success, error, pending)
 * 3. ✅ Optimistic UI (actualización inmediata de UI)
 * 4. ✅ Prevención de double-tap (deshabilitar botón)
 * 5. ✅ Retry strategy con exponential backoff
 * 6. ✅ Feedback visual claro al usuario
 */

// Tipos de estado de inscripción
type EnrollmentStatus = 'idle' | 'loading' | 'pending' | 'confirmed' | 'rejected' | 'error';

// Interfaz para el estado de una materia
interface CourseEnrollment {
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  requestId?: string;
  message?: string;
}

// Simulación de API - En producción, esto sería una llamada real al backend
const simulateEnrollmentAPI = async (
  studentId: string,
  courseId: string,
  requestId: string,
  shouldFail: boolean = false
): Promise<{ success: boolean; status: string; message: string }> => {
  console.log('📡 [API CALL] Iniciando llamada al servidor...');
  console.log(`   → Student ID: ${studentId}`);
  console.log(`   → Course ID: ${courseId}`);
  console.log(`   → Request ID: ${requestId}`);

  // Simula latencia de red (1-3 segundos)
  const delay = Math.random() * 2000 + 1000;
  console.log(`   ⏱️  Simulando latencia de red: ${delay.toFixed(0)}ms`);
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simula respuesta del servidor
  if (shouldFail) {
    console.log('   ❌ [NETWORK ERROR] Simulando fallo de conexión');
    throw new Error('Network error: Failed to connect to server');
  }

  // Simula diferentes respuestas del servidor
  const random = Math.random();

  if (random < 0.7) {
    // 70% de éxito
    console.log('   ✅ [SUCCESS] Inscripción confirmada por el servidor');
    return {
      success: true,
      status: 'confirmed',
      message: 'Inscripción confirmada exitosamente',
    };
  } else if (random < 0.85) {
    // 15% pending (en cola)
    console.log('   ⏳ [PENDING] Solicitud en cola de procesamiento');
    return {
      success: true,
      status: 'pending',
      message: 'Solicitud en cola de procesamiento',
    };
  } else {
    // 15% rechazado
    console.log('   ❌ [REJECTED] Inscripción rechazada por el servidor');
    return {
      success: false,
      status: 'rejected',
      message: 'Materia llena o ya inscrita',
    };
  }
};

// Función de retry con exponential backoff
const retryWithBackoff = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  console.log(`🔄 [RETRY STRATEGY] Configurado con ${maxRetries} intentos máximos`);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`\n🎯 [ATTEMPT ${attempt + 1}/${maxRetries}] Ejecutando request...`);
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`   ⚠️  [FAILED] Intento ${attempt + 1} falló: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        // Calcular delay con exponential backoff + jitter
        const exponentialDelay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000; // 0-1 segundo de jitter
        const totalDelay = exponentialDelay + jitter;

        console.log(`   ⏳ [BACKOFF] Esperando ${totalDelay.toFixed(0)}ms antes de reintentar...`);
        console.log(`      (Exponential: ${exponentialDelay}ms + Jitter: ${jitter.toFixed(0)}ms)`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      } else {
        console.log(`   ❌ [MAX RETRIES] Se agotaron los ${maxRetries} intentos`);
      }
    }
  }

  throw lastError;
};

export default function EnrollmentScreen() {
  const colorScheme = useColorScheme();

  // Estado de las materias disponibles
  const [courses, setCourses] = useState<CourseEnrollment[]>([
    { courseId: '1', courseName: 'Programación Web', status: 'idle' },
    { courseId: '2', courseName: 'Bases de Datos', status: 'idle' },
    { courseId: '3', courseName: 'Sistemas Distribuidos', status: 'idle' },
    { courseId: '4', courseName: 'Inteligencia Artificial', status: 'idle' },
  ]);

  // Simula modo de error de red para demostración
  const [networkErrorMode, setNetworkErrorMode] = useState(false);

  // Mensaje de bienvenida en la consola
  useEffect(() => {
    console.clear();
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   📚 CLASE 4: CONCURRENCIA Y CONSISTENCIA EN MOBILE       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('👋 ¡Bienvenido al demo interactivo!\n');
    console.log('📋 Esta consola mostrará el flujo completo de cada operación:');
    console.log('   • Generación de Request IDs (Idempotencia)');
    console.log('   • Optimistic UI updates');
    console.log('   • Estrategia de reintentos (Exponential backoff + Jitter)');
    console.log('   • Rollback en caso de errores');
    console.log('   • Estados de la UI en tiempo real\n');
    console.log('💡 Instrucciones:');
    console.log('   1. Toca "Inscribirse" en cualquier materia');
    console.log('   2. Observa los logs detallados en esta consola');
    console.log('   3. Activa "Red Inestable" para ver los reintentos\n');
    console.log('🎯 ¡Comencemos!\n');
    console.log('════════════════════════════════════════════════════════════\n');
  }, []);

  /**
   * FUNCIÓN PRINCIPAL DE INSCRIPCIÓN
   * Implementa todos los conceptos de la clase
   */
  const handleEnroll = async (courseId: string) => {
    const courseName = courses.find(c => c.courseId === courseId)?.courseName;

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`📚 [ENROLLMENT START] Iniciando inscripción: ${courseName}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // 1. Generar Request ID único (IDEMPOTENCIA)
    const requestId = uuidv4();
    console.log(`🔑 [IDEMPOTENCIA] Request ID generado: ${requestId}`);
    console.log('   → Este ID garantiza que la request sea idempotente');
    console.log('   → El backend puede detectar requests duplicadas usando este ID\n');

    // 2. OPTIMISTIC UI: Actualizar UI inmediatamente
    console.log('✨ [OPTIMISTIC UI] Actualizando interfaz ANTES de esperar respuesta');
    console.log('   → Estado cambia a "loading" inmediatamente');
    console.log('   → Usuario ve feedback instantáneo\n');

    setCourses(prev =>
      prev.map(course =>
        course.courseId === courseId
          ? {
              ...course,
              status: 'loading',
              requestId,
              message: 'Enviando solicitud...',
            }
          : course
      )
    );

    try {
      // 3. RETRY STRATEGY: Reintentar con exponential backoff
      const result = await retryWithBackoff(
        () => simulateEnrollmentAPI('student123', courseId, requestId, networkErrorMode),
        5,
        1000
      );

      // 4. Actualizar UI según respuesta del servidor
      console.log(`\n✅ [SERVER RESPONSE] Respuesta recibida: ${result.status}`);
      console.log(`   → Mensaje: ${result.message}`);
      console.log('   → Actualizando UI con el estado final\n');

      setCourses(prev =>
        prev.map(course =>
          course.courseId === courseId
            ? {
                ...course,
                status: result.status as EnrollmentStatus,
                message: result.message,
              }
            : course
        )
      );

      console.log('═══════════════════════════════════════════════════════');
      if (result.status === 'confirmed') {
        console.log(`🎉 [SUCCESS] Inscripción completada: ${courseName}`);
      } else if (result.status === 'pending') {
        console.log(`⏳ [PENDING] Inscripción en cola: ${courseName}`);
        console.log('   → El botón permanece deshabilitado hasta confirmación');
      } else if (result.status === 'rejected') {
        console.log(`❌ [REJECTED] Inscripción rechazada: ${courseName}`);
      }
      console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
      // 5. ROLLBACK en caso de error
      console.log('\n🔄 [ROLLBACK] Revirtiendo cambios de UI optimista');
      console.log(`   → Error: ${(error as Error).message}`);
      console.log('   → Estado cambia a "error"');
      console.log('   → Usuario ve mensaje de error claro\n');

      setCourses(prev =>
        prev.map(course =>
          course.courseId === courseId
            ? {
                ...course,
                status: 'error',
                message: 'Error de conexión. Intenta nuevamente.',
              }
            : course
        )
      );

      console.log('═══════════════════════════════════════════════════════');
      console.log(`❌ [ERROR] Inscripción falló: ${courseName}`);
      console.log('═══════════════════════════════════════════════════════\n');
    }
  };

  // Resetear todas las materias
  const resetAllCourses = () => {
    console.log('\n🔄 [RESET] Reseteando todas las materias a estado inicial');
    console.log('   → Todos los estados vuelven a "idle"');
    console.log('   → Request IDs eliminados\n');

    setCourses(prev =>
      prev.map(course => ({
        ...course,
        status: 'idle',
        message: undefined,
        requestId: undefined,
      }))
    );
  };

  // Toggle de modo error de red
  const toggleNetworkMode = () => {
    const newMode = !networkErrorMode;
    setNetworkErrorMode(newMode);

    console.log('\n📶 [NETWORK MODE] Modo de red cambiado');
    console.log(`   → Nuevo modo: ${newMode ? '🔴 Red Inestable (simulará errores)' : '🟢 Red Normal'}`);
    console.log(`   → ${newMode ? 'Las requests fallarán y se reintentarán' : 'Las requests funcionarán normalmente'}\n`);
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: EnrollmentStatus): string => {
    switch (status) {
      case 'loading':
        return '#FFA500'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'pending':
        return '#2196F3'; // Blue
      case 'rejected':
        return '#F44336'; // Red
      case 'error':
        return '#F44336'; // Red
      default:
        return colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: EnrollmentStatus): string => {
    switch (status) {
      case 'idle':
        return 'No inscrito';
      case 'loading':
        return 'Procesando...';
      case 'confirmed':
        return '✅ Confirmado';
      case 'pending':
        return '⏳ Pendiente';
      case 'rejected':
        return '❌ Rechazado';
      case 'error':
        return '⚠️ Error';
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Sistema de Inscripción
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Demostración de Concurrencia y Consistencia
          </ThemedText>
        </ThemedView>

        {/* Conceptos explicados */}
        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            💡 Conceptos demostrados:
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Idempotencia con Request ID único{'\n'}
            • Optimistic UI (actualización inmediata){'\n'}
            • Prevención de double-tap{'\n'}
            • Retry con exponential backoff{'\n'}
            • Estados claros (idle → loading → success/error)
          </ThemedText>
        </ThemedView>

        {/* Control de modo error de red */}
        <ThemedView style={styles.controlBox}>
          <Pressable
            style={[
              styles.toggleButton,
              networkErrorMode && styles.toggleButtonActive,
            ]}
            onPress={toggleNetworkMode}>
            <ThemedText style={styles.toggleButtonText}>
              {networkErrorMode ? '📡 Simular Red Inestable: ON' : '📶 Red Normal'}
            </ThemedText>
          </Pressable>
        </ThemedView>

        {/* Lista de materias */}
        <ThemedView style={styles.coursesContainer}>
          <ThemedText type="subtitle" style={styles.coursesTitle}>
            Materias Disponibles:
          </ThemedText>

          {courses.map(course => (
            <ThemedView key={course.courseId} style={styles.courseCard}>
              <View style={styles.courseInfo}>
                <ThemedText type="defaultSemiBold" style={styles.courseName}>
                  {course.courseName}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.courseStatus,
                    { color: getStatusColor(course.status) },
                  ]}>
                  {getStatusText(course.status)}
                </ThemedText>
                {course.message && (
                  <ThemedText style={styles.courseMessage}>
                    {course.message}
                  </ThemedText>
                )}
                {course.requestId && (
                  <ThemedText style={styles.requestId}>
                    ID: {course.requestId.slice(0, 8)}...
                  </ThemedText>
                )}
              </View>

              <View style={styles.courseActions}>
                <Pressable
                  style={[
                    styles.enrollButton,
                    (course.status === 'loading' ||
                     course.status === 'confirmed' ||
                     course.status === 'pending') &&
                      styles.enrollButtonDisabled,
                  ]}
                  onPress={() => handleEnroll(course.courseId)}
                  disabled={
                    course.status === 'loading' ||
                    course.status === 'confirmed' ||
                    course.status === 'pending'
                  }>
                  {course.status === 'loading' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <ThemedText style={styles.enrollButtonText}>
                      {course.status === 'confirmed'
                        ? 'Inscrito'
                        : course.status === 'pending'
                        ? 'En cola...'
                        : 'Inscribirse'}
                    </ThemedText>
                  )}
                </Pressable>
              </View>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Botón de reset */}
        <Pressable style={styles.resetButton} onPress={resetAllCourses}>
          <ThemedText style={styles.resetButtonText}>
            🔄 Resetear Todo
          </ThemedText>
        </Pressable>

        {/* Nota educativa */}
        <ThemedView style={styles.noteBox}>
          <ThemedText style={styles.noteText}>
            Se observa cómo el botón se deshabilita durante la carga (prevención de
            double-tap), cómo la UI se actualiza inmediatamente (Optimistic UI), y
            cómo cada request tiene un ID único (idempotencia).{'\n\n'}
            Activa el modo "Red Inestable" para ver la estrategia de reintentos en
            acción.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoBox: {
    padding: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  infoTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  controlBox: {
    marginBottom: 20,
  },
  toggleButton: {
    padding: 14,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderColor: 'rgba(255, 152, 0, 0.5)',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  coursesContainer: {
    marginBottom: 20,
  },
  coursesTitle: {
    marginBottom: 12,
  },
  courseCard: {
    padding: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  courseInfo: {
    marginBottom: 12,
  },
  courseName: {
    fontSize: 16,
    marginBottom: 6,
  },
  courseStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseMessage: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  requestId: {
    fontSize: 10,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  courseActions: {
    flexDirection: 'row',
  },
  enrollButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  enrollButtonDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    opacity: 0.6,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    padding: 14,
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noteBox: {
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
