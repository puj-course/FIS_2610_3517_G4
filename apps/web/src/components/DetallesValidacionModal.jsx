import React, { useState } from 'react';
import { X, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function DetallesValidacionModal({
  isOpen,
  onClose,
  validation,
  historialPlaca = [],
  onDeleteValidation,
  onDownloadPDF
}) {
  const [expandedHistorial, setExpandedHistorial] = useState(false);

  if (!isOpen || !validation) return null;

  const getStateColor = (vigente, diasRestantes) => {
    if (!vigente || diasRestantes < 0) return 'rojo';
    if (diasRestantes <= 30) return 'amarillo';
    return 'verde';
  };

  const data = validation.resultadoRUNT?.data;
  const soatState = data ? getStateColor(data.soat.vigente, data.soat.diasRestantes) : 'rojo';
  const rtmState = data ? getStateColor(data.rtm.vigente, data.rtm.diasRestantes) : 'rojo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-syntix-navy">Detalles de Validación</h2>
            <p className="text-sm text-gray-600 mt-1">{validation.placa}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información de Auditoría */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 mb-3">Información de Auditoría</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase">Usuario</p>
                <p className="text-blue-900 font-bold">{validation.usuario}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase">Fecha y Hora</p>
                <p className="text-blue-900 font-bold">
                  {new Date(validation.timestamp).toLocaleString('es-CO')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase">ID Validación</p>
                <p className="text-blue-900 font-mono text-xs">{validation.id}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 uppercase">IP</p>
                <p className="text-blue-900 font-mono">{validation.ip}</p>
              </div>
            </div>
          </div>

          {/* Datos RUNT Consultados */}
          {data && (
            <>
              <div>
                <h3 className="font-bold text-lg text-syntix-navy mb-3">Datos RUNT Consultados</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Placa</p>
                    <p className="font-bold text-gray-900">{data.placa}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Marca</p>
                    <p className="font-bold text-gray-900">{data.marca}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Modelo</p>
                    <p className="font-bold text-gray-900">{data.modelo}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Color</p>
                    <p className="font-bold text-gray-900">{data.color}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Tipo</p>
                    <p className="font-bold text-gray-900">{data.tipo}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Año</p>
                    <p className="font-bold text-gray-900">{data.anio}</p>
                  </div>
                </div>
              </div>

              {/* SOAT Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-syntix-navy">SOAT</h4>
                  <StatusBadge status={soatState} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Póliza</p>
                    <p className="font-bold text-gray-900">{data.soat.numero}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Aseguradora</p>
                    <p className="font-bold text-gray-900">{data.soat.aseguradora}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Vencimiento</p>
                    <p className="font-bold text-gray-900">
                      {new Date(data.soat.fechaVencimiento).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Días Restantes</p>
                    <p className={`font-black ${
                      soatState === 'verde' ? 'text-green-600' :
                      soatState === 'amarillo' ? 'text-amber-600' : 'text-syntix-red'
                    }`}>
                      {data.soat.diasRestantes}
                    </p>
                  </div>
                </div>
              </div>

              {/* RTM Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-syntix-navy">RTM (Tecnomecánica)</h4>
                  <StatusBadge status={rtmState} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Número</p>
                    <p className="font-bold text-gray-900">{data.rtm.numero}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Responsable</p>
                    <p className="font-bold text-gray-900">{data.rtm.responsable}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Vencimiento</p>
                    <p className="font-bold text-gray-900">
                      {new Date(data.rtm.fechaVencimiento).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Días Restantes</p>
                    <p className={`font-black ${
                      rtmState === 'verde' ? 'text-green-600' :
                      rtmState === 'amarillo' ? 'text-amber-600' : 'text-syntix-red'
                    }`}>
                      {data.rtm.diasRestantes}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notas */}
          {validation.notas && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-bold text-yellow-900 mb-2">Notas</h4>
              <p className="text-yellow-800">{validation.notas}</p>
            </div>
          )}

          {/* Historial de Validaciones por Placa */}
          {historialPlaca && historialPlaca.length > 0 && (
            <div>
              <button
                onClick={() => setExpandedHistorial(!expandedHistorial)}
                className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-lg font-bold text-syntix-navy hover:bg-gray-200 transition-colors"
              >
                <span>📋 Historial de {validation.placa} ({historialPlaca.length} validaciones)</span>
                {expandedHistorial ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {expandedHistorial && (
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {historialPlaca.map((val, idx) => (
                    <div 
                      key={val.id}
                      className={`p-3 rounded-lg text-sm ${
                        val.id === validation.id 
                          ? 'bg-syntix-navy/10 border-l-4 border-syntix-navy' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="font-bold">Validación {historialPlaca.length - idx}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(val.timestamp).toLocaleString('es-CO')}
                      </p>
                      <p className="text-xs text-gray-600">Por: {val.usuario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-6 flex gap-3">
          <button
            onClick={() => onDownloadPDF?.(validation.id)}
            className="flex-1 bg-syntix-green text-white py-2 rounded-lg font-bold hover:bg-syntix-green/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
          <button
            onClick={() => {
              onDeleteValidation?.(validation.id);
              onClose();
            }}
            className="flex-1 bg-syntix-red text-white py-2 rounded-lg font-bold hover:bg-syntix-red/90 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
