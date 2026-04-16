import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function ValidacionResultadoCard({
  datosRUNT,
  vehiculoSistema,
  conductorAsignado,
  onGuardar,
  loading = false
}) {
  if (!datosRUNT?.encontrado) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-12 h-12 text-syntix-red" />
        </div>
        <h3 className="text-xl font-bold text-syntix-red mb-2">Vehículo no encontrado</h3>
        <p className="text-red-700">La placa o VIN ingresado no existe en la base de datos RUNT.</p>
      </div>
    );
  }

  const data = datosRUNT.data;
  
  // Funciones auxiliares para estados
  const getStateColor = (vigente, diasRestantes) => {
    if (!vigente || diasRestantes < 0) return 'rojo';
    if (diasRestantes <= 30) return 'amarillo';
    return 'verde';
  };

  const soatState = getStateColor(data.soat.vigente, data.soat.diasRestantes);
  const rtmState = getStateColor(data.rtm.vigente, data.rtm.diasRestantes);
  const licenciaState = conductorAsignado ? 
    getStateColor(conductorAsignado.estado === 'verde', conductorAsignado.diasRestantes) : 'rojo';

  // Validar coincidencias con sistema
  const coincidencias = {
    placaCoincidia: vehiculoSistema?.placa === data.placa,
    marcaCoincidia: vehiculoSistema?.marca?.toLowerCase() === data.marca.toLowerCase(),
    modeloCoincidia: vehiculoSistema?.modelo?.toLowerCase() === data.modelo.toLowerCase(),
    conductorAsignado: !!conductorAsignado
  };

  const alertas = [];
  if (!data.soat.vigente) alertas.push('⚠️ SOAT VENCIDO');
  if (!data.rtm.vigente) alertas.push('⚠️ RTM VENCIDO');
  if (!conductorAsignado) alertas.push('⚠️ SIN CONDUCTOR ASIGNADO');
  if (!coincidencias.placaCoincidia) alertas.push('⚠️ PLACA NO COINCIDE');
  if (data.soat.diasRestantes <= 30 && data.soat.diasRestantes > 0) alertas.push('⚠️ SOAT PRÓXIMO A VENCER');
  if (data.rtm.diasRestantes <= 30 && data.rtm.diasRestantes > 0) alertas.push('⚠️ RTM PRÓXIMO A VENCER');

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Alertas detectadas:</h4>
              <ul className="space-y-1">
                {alertas.map((alerta, idx) => (
                  <li key={idx} className="text-sm text-amber-800">{alerta}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Información del Vehículo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-syntix-navy mb-4">Información del Vehículo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Placa</p>
            <p className="text-lg font-black text-gray-900">{data.placa}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Marca</p>
            <p className="text-lg font-bold text-gray-900">{data.marca}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Línea</p>
            <p className="text-lg font-bold text-gray-900">{data.linea}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Modelo</p>
            <p className="text-lg font-bold text-gray-900">{data.modelo}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Color</p>
            <p className="text-lg font-bold text-gray-900">{data.color}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">VIN</p>
            <p className="text-xs font-mono text-gray-900">{data.vin}</p>
          </div>
        </div>
      </div>

      {/* Validación SOAT */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-syntix-navy">Validación SOAT</h3>
          <StatusBadge status={soatState} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Número Póliza</p>
            <p className="font-mono font-bold text-gray-900">{data.soat.numero}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Aseguradora</p>
            <p className="font-bold text-gray-900">{data.soat.aseguradora}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Inicio Vigencia</p>
            <p className="font-bold text-gray-900">{new Date(data.soat.fechaInicio).toLocaleDateString('es-CO')}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Vencimiento</p>
            <p className="font-bold text-gray-900">{new Date(data.soat.fechaVencimiento).toLocaleDateString('es-CO')}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Días Restantes</p>
            <p className={`text-2xl font-black ${
              soatState === 'verde' ? 'text-green-600' : 
              soatState === 'amarillo' ? 'text-amber-600' : 'text-syntix-red'
            }`}>
              {data.soat.diasRestantes} días
            </p>
          </div>
        </div>
      </div>

      {/* Validación RTM */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-syntix-navy">Validación RTM (Tecnomecánica)</h3>
          <StatusBadge status={rtmState} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Número RTM</p>
            <p className="font-mono font-bold text-gray-900">{data.rtm.numero}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Responsable</p>
            <p className="font-bold text-gray-900">{data.rtm.responsable}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Vencimiento</p>
            <p className="font-bold text-gray-900">{new Date(data.rtm.fechaVencimiento).toLocaleDateString('es-CO')}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-500 uppercase">Días Restantes</p>
            <p className={`text-2xl font-black ${
              rtmState === 'verde' ? 'text-green-600' : 
              rtmState === 'amarillo' ? 'text-amber-600' : 'text-syntix-red'
            }`}>
              {data.rtm.diasRestantes} días
            </p>
          </div>
        </div>
      </div>

      {/* Validación Licencia */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-syntix-navy">Validación Licencia</h3>
          {conductorAsignado ? (
            <StatusBadge status={licenciaState} />
          ) : (
            <span className="bg-red-100 text-syntix-red px-3 py-1 rounded-full text-xs font-bold">NO ASIGNADO</span>
          )}
        </div>
        {conductorAsignado ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Conductor</p>
              <p className="font-bold text-gray-900">{conductorAsignado.nombre}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Documento</p>
              <p className="font-bold text-gray-900">{conductorAsignado.documento}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Categoría</p>
              <p className="font-bold text-gray-900">{conductorAsignado.categoria}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Vencimiento</p>
              <p className="font-bold text-gray-900">{new Date(conductorAsignado.fechaVencimiento).toLocaleDateString('es-CO')}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <p className="text-red-700 font-bold">No hay conductor asignado a este vehículo</p>
          </div>
        )}
      </div>

      {/* Botón Guardar */}
      <button
        onClick={onGuardar}
        disabled={loading}
        className="w-full bg-syntix-navy text-white py-3 rounded-xl font-bold hover:bg-syntix-navy/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        {loading ? 'Guardando...' : 'Guardar esta Validación'}
      </button>
    </div>
  );
}
