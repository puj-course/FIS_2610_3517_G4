/**
 * Hook useRUNTSimulator
 * Simula consultas a la base de datos RUNT (Registro Único Nacional de Tránsito)
 * Proporciona funciones para búsqueda por placa y VIN
 */

import { calculateDaysRemaining } from '../utils/dateUtils.js';

const runtDatabase = [
  {
    placa: 'ABC-123',
    vin: 'WVWZZZ3CZ9E123456',
    marca: 'Volkswagen',
    linea: 'Jetta',
    modelo: '2022',
    color: 'Blanco',
    anio: 2022,
    tipo: 'Automóvil',
    soat: {
      vigente: true,
      numero: 'SOAT-VW-001-2025',
      fechaInicio: '2025-01-10',
      fechaVencimiento: '2026-01-10',
      aseguradora: 'AXA',
      diasRestantes: 287
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00123',
      fechaVencimiento: '2026-06-30',
      responsable: 'Centro de Diagnóstico ABC',
      diasRestantes: 446
    }
  },
  {
    placa: 'XYZ-987',
    vin: 'CHEUUZZ7GH1234567',
    marca: 'Chevrolet',
    linea: 'NPR',
    modelo: '2020',
    color: 'Rojo',
    anio: 2020,
    tipo: 'Camión',
    soat: {
      vigente: false,
      numero: 'SOAT-CH-002-2024',
      fechaInicio: '2024-05-20',
      fechaVencimiento: '2025-05-20',
      aseguradora: 'MAPFRE',
      diasRestantes: -325
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00124',
      fechaVencimiento: '2026-09-15',
      responsable: 'Diagnóstico XYZ',
      diasRestantes: 523
    }
  },
  {
    placa: 'DEF-456',
    vin: 'FORDZZZ1FK2345678',
    marca: 'Ford',
    linea: 'Ranger',
    modelo: '2019',
    color: 'Azul',
    anio: 2019,
    tipo: 'Camioneta',
    soat: {
      vigente: true,
      numero: 'SOAT-FD-003-2025',
      fechaInicio: '2025-03-15',
      fechaVencimiento: '2026-03-15',
      aseguradora: 'La Equitativa',
      diasRestantes: 340
    },
    rtm: {
      vigente: false,
      numero: 'RTM-2024-00125',
      fechaInicio: '2024-03-25',
      fechaVencimiento: '2025-03-25',
      responsable: 'Centro de Diagnostico DEF',
      diasRestantes: -15
    }
  },
  {
    placa: 'GHI-789',
    vin: 'RENUZZZ8RG3456789',
    marca: 'Renault',
    linea: 'Kangoo',
    modelo: '2021',
    color: 'Gris',
    anio: 2021,
    tipo: 'Furgón',
    soat: {
      vigente: true,
      numero: 'SOAT-RN-004-2025',
      fechaInicio: '2025-02-01',
      fechaVencimiento: '2026-02-01',
      aseguradora: 'ARP',
      diasRestantes: 297
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00126',
      fechaVencimiento: '2026-12-15',
      responsable: 'Centro GHI',
      diasRestantes: 615
    }
  },
  {
    placa: 'JKL-012',
    vin: 'HYUUZZZ9HK4567890',
    marca: 'Hyundai',
    linea: 'H100',
    modelo: '2023',
    color: 'Negro',
    anio: 2023,
    tipo: 'Furgón',
    soat: {
      vigente: true,
      numero: 'SOAT-HY-005-2026',
      fechaInicio: '2025-06-10',
      fechaVencimiento: '2026-06-10',
      aseguradora: 'Zurich',
      diasRestantes: 427
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00127',
      fechaVencimiento: '2026-11-20',
      responsable: 'Centro JKL',
      diasRestantes: 590
    }
  },
  {
    placa: 'MNO-345',
    vin: 'TOYUZZZ0TM5678901',
    marca: 'Toyota',
    linea: 'Hiace',
    modelo: '2018',
    color: 'Blanco',
    anio: 2018,
    tipo: 'Furgón',
    soat: {
      vigente: false,
      numero: 'SOAT-TY-006-2024',
      fechaInicio: '2024-01-01',
      fechaVencimiento: '2025-01-01',
      aseguradora: 'SEGUROS MONTERREY',
      diasRestantes: -100
    },
    rtm: {
      vigente: false,
      numero: 'RTM-2024-00128',
      fechaVencimiento: '2025-05-10',
      responsable: 'Centro MNO',
      diasRestantes: 30
    }
  },
  {
    placa: 'PQR-678',
    vin: 'NISSUZZ1NQ6789012',
    marca: 'Nissan',
    linea: 'NV350',
    modelo: '2020',
    color: 'Plateado',
    anio: 2020,
    tipo: 'Furgón',
    soat: {
      vigente: true,
      numero: 'SOAT-NS-007-2025',
      fechaInicio: '2025-04-20',
      fechaVencimiento: '2026-04-20',
      aseguradora: 'Allianz',
      diasRestantes: 375
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00129',
      fechaVencimiento: '2026-08-15',
      responsable: 'Centro PQR',
      diasRestantes: 492
    }
  },
  {
    placa: 'STU-901',
    vin: 'VOLUZZZ2VU7890123',
    marca: 'Volvo',
    linea: 'FH16',
    modelo: '2021',
    color: 'Rojo',
    anio: 2021,
    tipo: 'Camión',
    soat: {
      vigente: true,
      numero: 'SOAT-VL-008-2026',
      fechaInicio: '2025-07-01',
      fechaVencimiento: '2026-07-01',
      aseguradora: 'HDI',
      diasRestantes: 447
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00130',
      fechaVencimiento: '2026-10-30',
      responsable: 'Centro STU',
      diasRestantes: 564
    }
  },
  {
    placa: 'VWX-234',
    vin: 'MERSZZZ3MW8901234',
    marca: 'Mercedes-Benz',
    linea: 'Sprinter',
    modelo: '2022',
    color: 'Blanco',
    anio: 2022,
    tipo: 'Furgón',
    soat: {
      vigente: true,
      numero: 'SOAT-MB-009-2025',
      fechaInicio: '2025-05-15',
      fechaVencimiento: '2026-05-15',
      aseguradora: 'Seguros Monterrey',
      diasRestantes: 400
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00131',
      fechaVencimiento: '2026-09-20',
      responsable: 'Centro VWX',
      diasRestantes: 528
    }
  },
  {
    placa: 'YZA-567',
    vin: 'ISUUZZZ4IZ9012345',
    marca: 'Isuzu',
    linea: 'NPR Max',
    modelo: '2019',
    color: 'Azul',
    anio: 2019,
    tipo: 'Camión',
    soat: {
      vigente: false,
      numero: 'SOAT-IS-010-2024',
      fechaInicio: '2024-02-10',
      fechaVencimiento: '2025-02-10',
      aseguradora: 'AXA',
      diasRestantes: -59
    },
    rtm: {
      vigente: true,
      numero: 'RTM-2025-00132',
      fechaVencimiento: '2026-07-25',
      responsable: 'Centro YZA',
      diasRestantes: 471
    }
  }
];

export function useRUNTSimulator() {
  const searchByPlaca = (placa) => {
    if (!placa || placa.trim().length === 0) {
      return { encontrado: false, error: 'Placa vacía' };
    }

    const placaUpper = placa.toUpperCase().trim();
    const vehiculo = runtDatabase.find(v => v.placa === placaUpper);

    if (vehiculo) {
      return {
        encontrado: true,
        data: {
          ...vehiculo,
          soat: {
            ...vehiculo.soat,
            diasRestantes: calculateDaysRemaining(vehiculo.soat.fechaVencimiento)
          },
          rtm: {
            ...vehiculo.rtm,
            diasRestantes: calculateDaysRemaining(vehiculo.rtm.fechaVencimiento)
          }
        }
      };
    }

    return { encontrado: false, error: 'Vehículo no encontrado en RUNT' };
  };

  const searchByVIN = (vin) => {
    if (!vin || vin.trim().length === 0) {
      return { encontrado: false, error: 'VIN vacío' };
    }

    const vinUpper = vin.toUpperCase().trim();
    if (vinUpper.length !== 17) {
      return { encontrado: false, error: 'VIN debe tener 17 caracteres' };
    }

    const vehiculo = runtDatabase.find(v => v.vin === vinUpper);

    if (vehiculo) {
      return {
        encontrado: true,
        data: {
          ...vehiculo,
          soat: {
            ...vehiculo.soat,
            diasRestantes: calculateDaysRemaining(vehiculo.soat.fechaVencimiento)
          },
          rtm: {
            ...vehiculo.rtm,
            diasRestantes: calculateDaysRemaining(vehiculo.rtm.fechaVencimiento)
          }
        }
      };
    }

    return { encontrado: false, error: 'Vehículo no encontrado en RUNT' };
  };

  const getAllVehiculos = () => {
    return runtDatabase.map(v => ({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      soatVigente: v.soat.vigente,
      rtmVigente: v.rtm.vigente
    }));
  };

  return {
    searchByPlaca,
    searchByVIN,
    getAllVehiculos
  };
}
