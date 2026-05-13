import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const OnboardingContext = createContext(null);

const ONBOARDING_VERSION = 's12-03-v1';
const ONBOARDING_PENDING_PREFIX = 'syntix_onboarding_pending:';
const createStep = (id, title, description, path, target = null, learnings = [], extra = {}) => ({
  id,
  title,
  description,
  path,
  target,
  learnings,
  ...extra,
});

const ONBOARDING_STEPS = [
  createStep(
    'tour-introduction',
    'Introduccion al recorrido',
    'Este recorrido te acompaña pantalla por pantalla. La idea es que veas cómo se conecta cada módulo dentro de la operación diaria de Drive Control.',
    '/dashboard',
    null,
    ['Vas a recorrer el flujo completo del backoffice.', 'Cada parada resalta una parte real de la interfaz.', 'Puedes avanzar, volver o salir cuando quieras.']
  ),
  createStep(
    'tour-goal',
    'Que lograras al terminar',
    'Al final del tutorial sabrás dónde registrar información, dónde revisar riesgos, dónde validar en RUNT y dónde ajustar la configuración general del sistema.',
    '/dashboard',
    null,
    ['Identificar módulos clave.', 'Ubicar acciones rápidas.', 'Reconocer puntos de seguimiento y control.']
  ),
  createStep(
    'sidebar-navigation',
    'Menu principal del sistema',
    'La barra lateral es tu mapa del producto. Desde aquí entras a todos los módulos operativos sin perder el contexto del dashboard.',
    '/dashboard',
    'sidebar',
    ['Desde este menú recorres todo el sistema.', 'Cada opción representa un flujo operativo distinto.']
  ),
  createStep(
    'dashboard-summary',
    'Vista general del dashboard',
    'Este bloque resume el estado general de la cuenta y te da una lectura rápida antes de entrar a los detalles.',
    '/dashboard',
    'dashboard-summary',
    ['Aquí empieza la revisión diaria.', 'Sirve para detectar carga operativa y alertas pendientes.']
  ),
  createStep(
    'dashboard-header-actions',
    'Acciones rápidas desde el encabezado',
    'Sin salir del dashboard puedes ir a vehículos o abrir altas rápidas para vehículo, SOAT y RTM.',
    '/dashboard',
    'dashboard-header-actions',
    ['Pensado para ejecutar tareas comunes con menos clics.']
  ),
  createStep('dashboard-action-vehicles', 'Acceso directo a Vehículos', 'Este botón te lleva al módulo donde administras la flota registrada.', '/dashboard', 'dashboard-action-vehicles'),
  createStep('dashboard-action-add-vehicle', 'Alta rápida de vehículo', 'Este acceso abre el formulario para registrar un vehículo nuevo desde el propio dashboard.', '/dashboard', 'dashboard-action-add-vehicle'),
  createStep('dashboard-action-add-soat', 'Alta rápida de SOAT', 'Desde aquí puedes cargar directamente una póliza SOAT sin navegar a otra pantalla.', '/dashboard', 'dashboard-action-add-soat'),
  createStep('dashboard-action-add-rtm', 'Alta rápida de RTM', 'Este acceso te ahorra pasos cuando necesitas registrar una revisión técnico-mecánica.', '/dashboard', 'dashboard-action-add-rtm'),
  createStep('dashboard-stat-veh-culos', 'Indicador de vehículos', 'Esta tarjeta muestra cuántos vehículos tienes registrados actualmente.', '/dashboard', 'dashboard-stat-veh-culos'),
  createStep('dashboard-stat-conductores', 'Indicador de conductores', 'Esta tarjeta resume cuántos conductores activos están cargados en la cuenta.', '/dashboard', 'dashboard-stat-conductores'),
  createStep('dashboard-stat-docs-vencen-pronto', 'Indicador de documentos próximos', 'Este número te avisa cuántos vehículos ya entran en zona preventiva por vencimiento documental.', '/dashboard', 'dashboard-stat-docs-vencen-pronto'),
  createStep('dashboard-stat-alertas', 'Indicador de alertas', 'Aquí ves el volumen de alertas pendientes que el sistema ya está detectando.', '/dashboard', 'dashboard-stat-alertas'),
  createStep('dashboard-quick-actions', 'Bloque de accesos rápidos', 'Este panel conecta el dashboard con los módulos más consultados del sistema.', '/dashboard', 'dashboard-quick-actions'),
  createStep('dashboard-quick-vehicles', 'Acceso rápido a vehículos', 'Atajo directo para entrar a la gestión de flota.', '/dashboard', 'dashboard-quick-vehicles'),
  createStep('dashboard-quick-conductores', 'Acceso rápido a conductores', 'Atajo para administrar el personal que opera los vehículos.', '/dashboard', 'dashboard-quick-conductores'),
  createStep('dashboard-quick-documentos', 'Acceso rápido a documentos', 'Entra a la vista donde controlas SOAT y RTM por vehículo.', '/dashboard', 'dashboard-quick-documentos'),
  createStep('dashboard-quick-alertas', 'Acceso rápido a alertas', 'Abre el centro donde se consolidan los avisos importantes.', '/dashboard', 'dashboard-quick-alertas'),
  createStep('dashboard-quick-runt', 'Acceso rápido a validación RUNT', 'Te lleva a la consulta simulada de placa o VIN para contraste externo.', '/dashboard', 'dashboard-quick-runt'),
  createStep('dashboard-quick-reportes', 'Acceso rápido a reportes', 'Entra al resumen ejecutivo y exportable del estado de la flota.', '/dashboard', 'dashboard-quick-reportes'),
  createStep('dashboard-recent-vehicles', 'Vehículos recientes', 'Este bloque te muestra los últimos vehículos cargados para que puedas revisar rápidamente nuevos registros.', '/dashboard', 'dashboard-recent-vehicles'),
  createStep('dashboard-recent-alerts', 'Alertas recientes', 'Aquí ves una muestra de las alertas activas más cercanas al trabajo diario.', '/dashboard', 'dashboard-recent-alerts'),
  createStep('dashboard-doc-status', 'Semáforo documental', 'Este bloque resume el significado de los estados documentales y conecta con los módulos donde se corrigen.', '/dashboard', 'dashboard-doc-status'),
  createStep('dashboard-doc-links', 'Enlaces a documentos y vehículos', 'Desde aquí saltas al módulo exacto donde puedes revisar o corregir información documental.', '/dashboard', 'dashboard-doc-links'),
  createStep('alerts-header', 'Centro de alertas', 'El módulo de alertas reúne los vencimientos y avisos que requieren atención operativa.', '/alertas', 'alerts-header'),
  createStep('alerts-date-filter', 'Filtro por fecha simulada', 'Esta herramienta permite mover la fecha de referencia para anticiparte a futuros vencimientos.', '/alertas', 'alerts-date-filter'),
  createStep('alerts-reset-date', 'Volver a hoy', 'Este botón restaura la fecha actual después de una simulación.', '/alertas', 'alerts-reset-date'),
  createStep('alerts-list', 'Listado de alertas activas', 'Aquí se muestran las alertas generadas según la prioridad y la fecha seleccionada.', '/alertas', 'alerts-list'),
  createStep('documents-header', 'Gestión de documentos', 'Esta pantalla centraliza el control documental de la flota para que SOAT y RTM no queden dispersos.', '/documentos', 'documents-header'),
  createStep('documents-add-soat', 'Registrar un SOAT', 'Este botón abre el flujo para cargar una nueva póliza al sistema.', '/documentos', 'documents-add-soat'),
  createStep('documents-add-rtm', 'Registrar una RTM', 'Desde aquí cargas una nueva revisión técnico-mecánica.', '/documentos', 'documents-add-rtm'),
  createStep('documents-soat-table', 'Tabla de pólizas SOAT', 'Esta tabla muestra vigencia, días restantes y acciones disponibles por cada póliza.', '/documentos', 'documents-soat-table'),
  createStep('documents-rtm-table', 'Tabla de revisiones RTM', 'Esta tabla te deja seguir el mismo control para las revisiones técnico-mecánicas.', '/documentos', 'documents-rtm-table'),
  createStep('conductors-header', 'Gestión de conductores', 'En este módulo organizas el personal asociado a la operación de la flota.', '/conductores', 'conductors-header'),
  createStep('conductors-add-button', 'Registrar un conductor', 'Este acceso abre el formulario para crear un conductor nuevo.', '/conductores', 'conductors-add-button'),
  createStep('conductors-search', 'Buscar por nombre o documento', 'El buscador ayuda a encontrar rápidamente un conductor específico dentro del listado.', '/conductores', 'conductors-search'),
  createStep('conductors-table', 'Listado de conductores', 'Aquí revisas contacto, documento, categoría y estado de licencia del personal registrado.', '/conductores', 'conductors-table'),
  createStep('runt-header', 'Validación RUNT', 'Esta pantalla está pensada para contrastar datos internos con una consulta externa simulada.', '/validacion-runt', 'runt-header'),
  createStep('runt-search-type', 'Elegir el tipo de búsqueda', 'Puedes consultar por placa o por VIN según el dato que tengas disponible.', '/validacion-runt', 'runt-search-type'),
  createStep('runt-search-input', 'Ingresar el identificador', 'En este campo escribes la placa o el VIN que quieres validar.', '/validacion-runt', 'runt-search-input'),
  createStep('runt-search-button', 'Ejecutar la consulta', 'Este botón lanza la búsqueda y muestra el resultado validado.', '/validacion-runt', 'runt-search-button'),
  createStep('runt-recent-searches', 'Búsquedas recientes', 'Cuando ya has consultado placas, esta sección te deja reutilizarlas con un clic.', '/validacion-runt', 'runt-recent-searches'),
  createStep('runt-history-link', 'Ir al historial de validaciones', 'Este enlace conecta la consulta puntual con la bitácora completa del sistema.', '/validacion-runt', 'runt-history-link'),
  createStep('runt-history-header', 'Historial de validaciones', 'Aquí se conserva la evidencia de consultas RUNT que ya hiciste en el sistema.', '/historial-validaciones', 'runt-history-header'),
  createStep('runt-history-export', 'Exportar historial', 'Este botón descarga un CSV con las validaciones visibles en el historial.', '/historial-validaciones', 'runt-history-export'),
  createStep('runt-history-stats', 'Indicadores del historial', 'Estas tarjetas resumen volumen, cumplimiento y comportamiento reciente de las validaciones.', '/historial-validaciones', 'runt-history-stats'),
  createStep('runt-history-filters', 'Filtros del historial', 'Puedes filtrar por placa, estado o rango de fechas para revisar solo lo que necesitas.', '/historial-validaciones', 'runt-history-filters'),
  createStep('runt-history-table', 'Tabla del historial', 'En esta tabla revisas cada validación guardada y sus acciones disponibles.', '/historial-validaciones', 'runt-history-table'),
  createStep('reports-header', 'Reportes y analítica', 'Este módulo presenta una visión ejecutiva del cumplimiento de la flota.', '/reportes', 'reports-header'),
  createStep('reports-export', 'Descargar CSV de reportes', 'Aquí puedes exportar el estado actual de la operación para compartirlo fuera del sistema.', '/reportes', 'reports-export'),
  createStep('reports-compliance-card', 'Cumplimiento total', 'Esta tarjeta concentra el porcentaje global de vehículos al día.', '/reportes', 'reports-compliance-card'),
  createStep('reports-distribution-card', 'Distribución de estados', 'Este bloque separa el estado de la flota entre verde, amarillo y rojo.', '/reportes', 'reports-distribution-card'),
  createStep('settings-header', 'Configuración del sistema', 'Esta pantalla agrupa parámetros, respaldos y restablecimiento del entorno.', '/configuracion', 'settings-header'),
  createStep('settings-threshold', 'Umbral de alerta amarilla', 'Aquí defines cuántos días antes del vencimiento se activan alertas preventivas.', '/configuracion', 'settings-threshold'),
  createStep('settings-save-button', 'Guardar el umbral', 'Este botón aplica el cambio del parámetro de alerta.', '/configuracion', 'settings-save-button'),
  createStep('settings-data-management', 'Gestión de datos locales', 'En esta sección están las herramientas de respaldo e importación de información.', '/configuracion', 'settings-data-management'),
  createStep('settings-export', 'Exportar respaldo', 'Este botón crea una copia local de las claves de la aplicación.', '/configuracion', 'settings-export'),
  createStep('settings-import', 'Importar respaldo', 'Aquí puedes restaurar datos previamente exportados.', '/configuracion', 'settings-import'),
  createStep('settings-reset', 'Restablecer datos', 'Este acceso elimina la información local del entorno de pruebas cuando necesitas empezar de cero.', '/configuracion', 'settings-reset'),
  createStep('vehicles-header', 'Gestión de vehículos', 'Este módulo es la base operativa de la flota: aquí registras y revisas cada vehículo.', '/vehiculos', 'vehicles-header'),
  createStep('vehicles-add-button', 'Crear un vehículo nuevo', 'Este botón abre el formulario principal de alta.', '/vehiculos', 'vehicles-add-button'),
  createStep('vehicles-search', 'Buscar vehículos', 'El buscador filtra por placa, marca, modelo o usuario asociado.', '/vehiculos', 'vehicles-search'),
  createStep('vehicles-filter', 'Filtrar por estado general', 'Este filtro separa vehículos al día, por vencer o en estado crítico.', '/vehiculos', 'vehicles-filter'),
  createStep('vehicles-table', 'Tabla de la flota', 'Aquí se consolidan los datos principales del vehículo, su conductor y su estado general.', '/vehiculos', 'vehicles-table'),
  createStep(
    'vehicle-form',
    'Formulario de alta de vehículo',
    'Este formulario es el punto de partida para incorporar un vehículo al sistema y comenzar a controlarlo documentalmente.',
    '/vehiculos',
    'vehicle-form',
    ['Registrar placa, marca, modelo, año y tipo.', 'Iniciar el seguimiento documental desde el alta.'],
    { autoOpenModal: true }
  ),
  createStep('vehicle-plate-field', 'Formato de la placa', 'En este campo registras la placa principal del vehículo. La interfaz la convierte a mayúsculas y espera un formato breve como ABC123 o ABC-123.', '/vehiculos', 'vehicle-plate-field'),
  createStep('vehicle-brand-model-fields', 'Marca y modelo del vehículo', 'Aquí completas la identificación comercial del vehículo. Estos datos te ayudan a reconocer rápidamente la unidad dentro de la tabla.', '/vehiculos', 'vehicle-brand-model-fields'),
  createStep('vehicle-year-type-fields', 'Año y tipo del vehículo', 'En esta parte defines el año y la categoría del vehículo. Eso ayuda a clasificar la flota y mantener registros consistentes.', '/vehiculos', 'vehicle-year-type-fields'),
  createStep('vehicle-submit-actions', 'Guardar o cancelar el registro', 'Cuando termines, puedes guardar el vehículo para incorporarlo a la flota o cancelar si todavía necesitas corregir algo.', '/vehiculos', 'vehicle-submit-actions'),
];

const normalizeText = (value) => String(value ?? '').trim();
const normalizeEmail = (value) => normalizeText(value).toLowerCase();
const getLocalStorage = () =>
  (typeof globalThis !== 'undefined' && globalThis.localStorage ? globalThis.localStorage : null);

const getStorageKey = (user) => {
  const userId = normalizeEmail(user?.email || user?.empresa || '');
  return userId ? `syntix_onboarding_state:${userId}` : null;
};

const getPendingStorageKey = (userOrEmail) => {
  const userId = normalizeEmail(typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email);
  return userId ? `${ONBOARDING_PENDING_PREFIX}${userId}` : null;
};

const readOnboardingState = (storageKey) => {
  const storage = getLocalStorage();
  if (!storageKey || !storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(storageKey);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    return parsed?.version === ONBOARDING_VERSION ? parsed : null;
  } catch (error) {
    console.error('No fue posible leer el estado de onboarding.', error);
    return null;
  }
};

const writeOnboardingState = (storageKey, status) => {
  const storage = getLocalStorage();
  if (!storageKey || !storage) {
    return;
  }

  try {
    storage.setItem(
      storageKey,
      JSON.stringify({
        version: ONBOARDING_VERSION,
        status,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    console.error('No fue posible guardar el estado de onboarding.', error);
  }
};

const readQueuedOnboarding = (pendingStorageKey) => {
  const storage = getLocalStorage();
  if (!pendingStorageKey || !storage) {
    return false;
  }

  try {
    return storage.getItem(pendingStorageKey) === ONBOARDING_VERSION;
  } catch (error) {
    console.error('No fue posible leer la cola de onboarding.', error);
    return false;
  }
};

export function queueOnboardingForUser(userOrEmail) {
  const pendingStorageKey = getPendingStorageKey(userOrEmail);
  const storage = getLocalStorage();
  if (!pendingStorageKey || !storage) {
    return;
  }

  try {
    storage.setItem(pendingStorageKey, ONBOARDING_VERSION);
  } catch (error) {
    console.error('No fue posible programar el onboarding para el usuario.', error);
  }
}

export function clearQueuedOnboardingForUser(userOrEmail) {
  const pendingStorageKey = getPendingStorageKey(userOrEmail);
  const storage = getLocalStorage();
  if (!pendingStorageKey || !storage) {
    return;
  }

  try {
    storage.removeItem(pendingStorageKey);
  } catch (error) {
    console.error('No fue posible limpiar la cola de onboarding.', error);
  }
}

export function OnboardingProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const storageKey = useMemo(() => getStorageKey(user), [user]);
  const pendingStorageKey = useMemo(() => getPendingStorageKey(user), [user]);
  const [savedState, setSavedState] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !storageKey) {
      setSavedState(null);
      setShowWelcome(false);
      setIsTourActive(false);
      setShowCompletion(false);
      setCurrentStepIndex(0);
      return;
    }

    const storedState = readOnboardingState(storageKey);
    const hasQueuedOnboarding = readQueuedOnboarding(pendingStorageKey);
    setSavedState(storedState);
    setShowWelcome(Boolean(hasQueuedOnboarding && !storedState));
    setIsTourActive(false);
    setShowCompletion(false);
    setCurrentStepIndex(0);
  }, [isAuthenticated, pendingStorageKey, storageKey]);

  const persistState = useCallback(
    (status) => {
      if (!storageKey) {
        return;
      }

      const nextState = {
        version: ONBOARDING_VERSION,
        status,
        updatedAt: new Date().toISOString(),
      };

      writeOnboardingState(storageKey, status);
      clearQueuedOnboardingForUser(user);
      setSavedState(nextState);
    },
    [storageKey, user]
  );

  const startTour = useCallback(() => {
    setShowWelcome(false);
    setShowCompletion(false);
    setCurrentStepIndex(0);
    setIsTourActive(true);
  }, []);

  const skipWelcome = useCallback(() => {
    persistState('skipped');
    setShowWelcome(false);
    setIsTourActive(false);
    setShowCompletion(true);
    setCurrentStepIndex(0);
    navigate('/dashboard');
  }, [navigate, persistState]);

  const skipTour = useCallback(() => {
    persistState('skipped');
    setShowWelcome(false);
    setIsTourActive(false);
    setShowCompletion(true);
    setCurrentStepIndex(0);
    navigate('/dashboard');
  }, [navigate, persistState]);

  const finishTour = useCallback(() => {
    persistState('completed');
    setShowWelcome(false);
    setIsTourActive(false);
    setShowCompletion(true);
    setCurrentStepIndex(0);
    navigate('/dashboard');
  }, [navigate, persistState]);

  const closeCompletion = useCallback(() => {
    setShowCompletion(false);
    navigate('/dashboard');
  }, [navigate]);

  const currentStep = isTourActive ? ONBOARDING_STEPS[currentStepIndex] : null;
  const isInteractionLocked = showWelcome || isTourActive || showCompletion;

  useEffect(() => {
    if (!isTourActive || !currentStep?.path) {
      return;
    }

    if (location.pathname !== currentStep.path) {
      navigate(currentStep.path);
    }
  }, [currentStep?.path, isTourActive, location.pathname, navigate]);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex >= ONBOARDING_STEPS.length - 1) {
      finishTour();
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  }, [currentStepIndex, finishTour]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      currentStep,
      currentStepIndex,
      hasSeenOnboarding: Boolean(savedState),
      isInteractionLocked,
      isTourActive,
      isNewUserPromptEligible: showWelcome,
      showCompletion,
      showWelcome,
      startTour,
      skipWelcome,
      skipTour,
      finishTour,
      closeCompletion,
      goToNextStep,
      goToPreviousStep,
      steps: ONBOARDING_STEPS,
    }),
    [
      currentStep,
      currentStepIndex,
      savedState,
      isInteractionLocked,
      isTourActive,
      showWelcome,
      showCompletion,
      startTour,
      skipWelcome,
      skipTour,
      finishTour,
      closeCompletion,
      goToNextStep,
      goToPreviousStep,
    ]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding debe usarse dentro de OnboardingProvider.');
  }

  return context;
}

OnboardingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
