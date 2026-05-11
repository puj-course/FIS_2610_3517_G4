import { useEffect, useMemo, useRef } from 'react';
import { useAlertHub } from './useAlertHub.js';
import { useVehicles } from './useVehicles.js';
import { useConductors } from './useConductors.js';
import { useDocuments } from './useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import SoatAlertAdapter from '@/patterns/adapters/SoatAlertAdapter.js';
import RtmAlertAdapter from '@/patterns/adapters/RtmAlertAdapter.js';
import ConductorAlertAdapter from '@/patterns/adapters/ConductorAlertAdapter.js';
import VehicleAlertAdapter from '@/patterns/adapters/VehicleAlertAdapter.js';
import PriorityAlertSortStrategy from '@/patterns/strategy/PriorityAlertSortStrategy.js';
import UrgencyAlertSortStrategy from '@/patterns/strategy/UrgencyAlertSortStrategy.js';
import { isValidPlate, normalizePlate } from '@/utils/colombiaFormats.js';

const soatAlertAdapter = new SoatAlertAdapter();
const rtmAlertAdapter = new RtmAlertAdapter();
const conductorAlertAdapter = new ConductorAlertAdapter();
const vehicleAlertAdapter = new VehicleAlertAdapter();

const UNKNOWN_VEHICLE_LABEL = 'Vehiculo no encontrado';
const ALERT_SOURCE_KEYS = ['soats', 'rtms', 'conductores', 'vehiculos'];
const sourceOwners = new Map();

const retainAlertSource = (sourceKey, ownerId) => {
  const owners = sourceOwners.get(sourceKey) || new Set();
  owners.add(ownerId);
  sourceOwners.set(sourceKey, owners);
};

const releaseAlertSource = (sourceKey, ownerId) => {
  const owners = sourceOwners.get(sourceKey);
  if (!owners) return true;

  owners.delete(ownerId);
  if (owners.size === 0) {
    sourceOwners.delete(sourceKey);
    return true;
  }

  return false;
};

const resolveVehiclePlate = (documento, vehiculos = []) => {
  const vehiculo = vehiculos.find(
    (item) => String(documento.vehiculoId) === String(item._id || item.id)
  );

  const placa = normalizePlate(vehiculo?.placa || documento.placaVehiculo || documento.vehiculoPlaca || documento.placa || '');

  return isValidPlate(placa) ? placa : UNKNOWN_VEHICLE_LABEL;
};

const enrichDocumentWithVehicle = (documento, vehiculos) => {
  const placa = resolveVehiclePlate(documento, vehiculos);

  return {
    ...documento,
    placa,
    placaVehiculo: placa,
    vehiculoPlaca: placa,
  };
};

// La fachada se asegura de activar las fuentes de alertas y elegir la estrategia de orden visible.
export function useAlertsFacade(sortMode = 'priority') {
  const sourceOwnerId = useRef(Symbol('alerts-facade-owner'));
  const { soats } = useDocuments();
  const { rtms } = useRtm();
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();

  const {
    alerts,
    registerSourceAlerts,
    clearSourceAlerts,
    setSortStrategy,
  } = useAlertHub();

  const enrichedSoats = useMemo(
    () => soats.map((soat) => enrichDocumentWithVehicle(soat, vehiculos)),
    [soats, vehiculos]
  );

  const enrichedRtms = useMemo(
    () => rtms.map((rtm) => enrichDocumentWithVehicle(rtm, vehiculos)),
    [rtms, vehiculos]
  );

  useEffect(() => {
    const ownerId = sourceOwnerId.current;
    ALERT_SOURCE_KEYS.forEach((sourceKey) => retainAlertSource(sourceKey, ownerId));

    return () => {
      ALERT_SOURCE_KEYS.forEach((sourceKey) => {
        if (releaseAlertSource(sourceKey, ownerId)) {
          clearSourceAlerts(sourceKey);
        }
      });
    };
  }, [clearSourceAlerts]);

  useEffect(() => {
    registerSourceAlerts('soats', soatAlertAdapter.adaptMany(enrichedSoats));
  }, [enrichedSoats, registerSourceAlerts]);

  useEffect(() => {
    registerSourceAlerts('rtms', rtmAlertAdapter.adaptMany(enrichedRtms));
  }, [enrichedRtms, registerSourceAlerts]);

  useEffect(() => {
    registerSourceAlerts('conductores', conductorAlertAdapter.adaptMany(conductores));
  }, [conductores, registerSourceAlerts]);

  useEffect(() => {
    registerSourceAlerts('vehiculos', vehicleAlertAdapter.adaptMany(vehiculos));
  }, [registerSourceAlerts, vehiculos]);

  useEffect(() => {
    // Cambiar la estrategia no recrea las alertas; solo altera la forma de priorizarlas en pantalla.
    const strategy =
      sortMode === 'urgency'
        ? new UrgencyAlertSortStrategy()
        : new PriorityAlertSortStrategy();

    setSortStrategy(strategy);
  }, [sortMode, setSortStrategy]);

  const criticalAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'rojo'),
    [alerts]
  );

  const warningAlerts = useMemo(
    () => alerts.filter((alert) => alert.prioridad === 'amarillo'),
    [alerts]
  );

  return {
    alerts,
    totalAlerts: alerts.length,
    criticalAlerts,
    warningAlerts,
  };
}
