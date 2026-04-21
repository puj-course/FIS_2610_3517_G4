/**
 * reporteGenerator.js
 * Generador de reportes PDF y CSV para validaciones RUNT
 */

export const reporteGenerator = {
  /**
   * Genera un reporte PDF de una validación específica
   * @param {Object} validation - Objeto de validación
   * @returns {string} - Contenido HTML para convertir a PDF
   */
  generateValidationPDFContent(validation) {
    if (!validation?.resultadoRUNT?.data) {
      return '<p>No hay datos para generar reporte</p>';
    }

    const data = validation.resultadoRUNT.data;
    const timestamp = new Date(validation.timestamp).toLocaleString('es-CO');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            border-bottom: 3px solid #003366;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #003366;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 12px;
            color: #666;
          }
          .section {
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 15px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #003366;
            margin-bottom: 10px;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 5px;
          }
          .field-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
          }
          .field-label {
            font-weight: bold;
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            width: 30%;
          }
          .field-value {
            color: #333;
            font-size: 12px;
            width: 70%;
          }
          .status-verde {
            color: white;
            background-color: #4CAF50;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: bold;
            display: inline-block;
          }
          .status-amarillo {
            color: white;
            background-color: #FF9800;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: bold;
            display: inline-block;
          }
          .status-rojo {
            color: white;
            background-color: #f44336;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: bold;
            display: inline-block;
          }
          .alert {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 10px 0;
            border-radius: 3px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #cccccc;
            font-size: 10px;
            color: #666;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          table td {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🚗 SYNTIX DRIVE CONTROL</div>
          <div class="subtitle">Reporte de Validación RUNT - Sistema de Gestión Documental de Flotas</div>
        </div>

        <div class="section">
          <div class="section-title">INFORMACIÓN DE AUDITORÍA</div>
          <div class="field-row">
            <div class="field-label">ID Validación:</div>
            <div class="field-value">${validation.id}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Fecha/Hora:</div>
            <div class="field-value">${timestamp}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Usuario:</div>
            <div class="field-value">${validation.usuario}</div>
          </div>
          <div class="field-row">
            <div class="field-label">IP de Consulta:</div>
            <div class="field-value">${validation.ip}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">DATOS DEL VEHÍCULO (RUNT)</div>
          <div class="grid">
            <div>
              <div class="field-row">
                <div class="field-label">Placa:</div>
                <div class="field-value" style="font-size: 16px; font-weight: bold;">${data.placa}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Marca:</div>
                <div class="field-value">${data.marca}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Modelo:</div>
                <div class="field-value">${data.modelo}</div>
              </div>
            </div>
            <div>
              <div class="field-row">
                <div class="field-label">Línea:</div>
                <div class="field-value">${data.linea}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Color:</div>
                <div class="field-value">${data.color}</div>
              </div>
              <div class="field-row">
                <div class="field-label">Año:</div>
                <div class="field-value">${data.anio}</div>
              </div>
            </div>
          </div>
          <div class="field-row" style="margin-top: 15px;">
            <div class="field-label">VIN:</div>
            <div class="field-value" style="font-family: monospace; font-size: 11px;">${data.vin}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">VALIDACIÓN SOAT</div>
          <div class="field-row">
            <div class="field-label">Número Póliza:</div>
            <div class="field-value">${data.soat.numero}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Aseguradora:</div>
            <div class="field-value">${data.soat.aseguradora}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Vigencia Inicial:</div>
            <div class="field-value">${new Date(data.soat.fechaInicio).toLocaleDateString('es-CO')}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Fecha Vencimiento:</div>
            <div class="field-value">${new Date(data.soat.fechaVencimiento).toLocaleDateString('es-CO')}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Días Restantes:</div>
            <div class="field-value" style="font-size: 14px; font-weight: bold;">
              ${data.soat.diasRestantes > 0 ? data.soat.diasRestantes : 'VENCIDO'}
            </div>
          </div>
          <div class="field-row">
            <div class="field-label">Estado:</div>
            <div class="field-value">
              <span class="status-${data.soat.vigente ? 'verde' : 'rojo'}">
                ${data.soat.vigente ? 'VIGENTE' : 'VENCIDO'}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">VALIDACIÓN RTM (TECNOMECÁNICA)</div>
          <div class="field-row">
            <div class="field-label">Número RTM:</div>
            <div class="field-value">${data.rtm.numero}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Centro de Diagnóstico:</div>
            <div class="field-value">${data.rtm.responsable}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Fecha Vencimiento:</div>
            <div class="field-value">${new Date(data.rtm.fechaVencimiento).toLocaleDateString('es-CO')}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Días Restantes:</div>
            <div class="field-value" style="font-size: 14px; font-weight: bold;">
              ${data.rtm.diasRestantes > 0 ? data.rtm.diasRestantes : 'VENCIDO'}
            </div>
          </div>
          <div class="field-row">
            <div class="field-label">Estado:</div>
            <div class="field-value">
              <span class="status-${data.rtm.vigente ? 'verde' : 'rojo'}">
                ${data.rtm.vigente ? 'VIGENTE' : 'VENCIDO'}
              </span>
            </div>
          </div>
        </div>

        ${validation.notas ? `
          <div class="section alert">
            <div class="section-title">NOTAS</div>
            <p>${validation.notas}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Este documento fue generado automáticamente por SYNTIX Drive Control</p>
          <p>Fecha de generación: ${new Date().toLocaleString('es-CO')}</p>
          <p>© 2026 SYNTIX TECH - Blindaje operativo para flotas mediante cumplimiento documental</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  },

  /**
   * Genera CSV con historial de validaciones
   * @param {Array} validations - Array de validaciones
   * @returns {string} - Contenido CSV
   */
  generateHistoryCSV(validations) {
    if (!validations || validations.length === 0) return '';

    const headers = ['Placa', 'Fecha', 'Hora', 'Usuario', 'SOAT Vigente', 'RTM Vigente', 'Días SOAT', 'Días RTM', 'Notas'];
    
    const rows = validations.map(v => [
      v.placa,
      new Date(v.timestamp).toLocaleDateString('es-CO'),
      new Date(v.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      v.usuario,
      v.resultadoRUNT?.data?.soat?.vigente ? 'Sí' : 'No',
      v.resultadoRUNT?.data?.rtm?.vigente ? 'Sí' : 'No',
      v.resultadoRUNT?.data?.soat?.diasRestantes ?? '',
      v.resultadoRUNT?.data?.rtm?.diasRestantes ?? '',
      (v.notas || '').replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell)}"`).join(','))
    ].join('\n');

    return csvContent;
  },

  /**
   * Descarga un archivo
   * @param {string} content - Contenido del archivo
   * @param {string} filename - Nombre del archivo
   * @param {string} mimeType - Tipo MIME
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  /**
   * Descarga validación como PDF (requiere librería externa)
   * @param {Object} validation - Validación a descargar
   */
  downloadValidationAsPDF(validation) {
    const htmlContent = this.generateValidationPDFContent(validation);
    // En producción, usar jspdf + html2canvas o similar
    console.log('PDF download requirería jspdf/html2canvas');
    // Por ahora, descargar como HTML
    this.downloadFile(htmlContent, `validacion-${validation.placa}-${validation.id}.html`, 'text/html');
  },

  /**
   * Descarga historial como CSV
   * @param {Array} validations - Validaciones a descargar
   */
  downloadHistoryAsCSV(validations) {
    const csv = this.generateHistoryCSV(validations);
    const filename = `historial-validaciones-${new Date().toISOString().split('T')[0]}.csv`;
    this.downloadFile(csv, filename, 'text/csv');
  }
};
