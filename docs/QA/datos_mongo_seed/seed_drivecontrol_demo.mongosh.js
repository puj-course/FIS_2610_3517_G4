/*
  Seed academico para DriveControl / AutoMinder Enterprise.

  Uso recomendado:
  - Importar en la base logistica_db.
  - Usar el mismo correo con el que se inicia sesion en la app.
  - Por defecto usa el correo observado en la prueba local. Se puede cambiar con OWNER_EMAIL.
*/

const OWNER_EMAIL =
  (typeof process !== 'undefined' && process.env.OWNER_EMAIL) ||
  'uafv718ily@lnovic.com';

const OWNER_EMPRESA =
  (typeof process !== 'undefined' && process.env.OWNER_EMPRESA) ||
  'Transportes Syntix Demo';

const SEED_TAG = 'drivecontrol-demo-alertas-2026-05';

const objectId = (hex) => ObjectId(hex);
const id = (hex) => objectId(hex).toString();

const conductores = [
  {
    _id: objectId('665100000000000000000001'),
    nombre: 'Laura Martinez Rojas',
    documento: '1002457801',
    telefono: '3004567812',
    categoria: 'C2',
    fechaVencimiento: '2027-08-15',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000002'),
    nombre: 'Andres Felipe Gomez',
    documento: '1018457790',
    telefono: '3012223344',
    categoria: 'C3',
    fechaVencimiento: '2026-05-17',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000003'),
    nombre: 'Natalia Perez Cardenas',
    documento: '1020998877',
    telefono: '3028889911',
    categoria: 'B1',
    fechaVencimiento: '2026-04-12',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000004'),
    nombre: 'Carlos Eduardo Torres',
    documento: '1007984512',
    telefono: '3105557890',
    categoria: 'C2',
    fechaVencimiento: '2027-02-01',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000005'),
    nombre: 'Diana Carolina Ruiz',
    documento: '1030555012',
    telefono: '3119098877',
    categoria: 'C1',
    fechaVencimiento: '2026-05-22',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000006'),
    nombre: 'Miguel Angel Castro',
    documento: '1008001123',
    telefono: '3126654410',
    categoria: 'C3',
    fechaVencimiento: '2025-12-15',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000007'),
    nombre: 'Valentina Herrera Diaz',
    documento: '1045566120',
    telefono: '3137789012',
    categoria: 'B1',
    fechaVencimiento: '2028-01-30',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000008'),
    nombre: 'Jorge Ivan Prieto',
    documento: '1007991234',
    telefono: '3140012456',
    categoria: 'C2',
    fechaVencimiento: '2026-05-10',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665100000000000000000009'),
    nombre: 'Sofia Alejandra Mora',
    documento: '1052200112',
    telefono: '3158800123',
    categoria: 'C1',
    fechaVencimiento: '2027-11-09',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66510000000000000000000a'),
    nombre: 'Felipe Cardenas Nieto',
    documento: '1022334455',
    telefono: '3169087722',
    categoria: 'C2',
    fechaVencimiento: '2026-03-02',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66510000000000000000000b'),
    nombre: 'Camila Andrea Pardo',
    documento: '1009988776',
    telefono: '3178832211',
    categoria: 'B1',
    fechaVencimiento: '2026-05-19',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66510000000000000000000c'),
    nombre: 'Oscar Javier Molina',
    documento: '1008012345',
    telefono: '3189090909',
    categoria: 'C3',
    fechaVencimiento: '2028-06-20',
    ownerEmail: OWNER_EMAIL,
    seedTag: SEED_TAG,
  },
];

const vehiculos = [
  {
    _id: objectId('665200000000000000000001'),
    placa: 'SYN101',
    marca: 'Chevrolet',
    modelo: 'NHR',
    anio: 2021,
    tipo: 'Camioneta de reparto',
    conductorId: id('665100000000000000000001'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000002'),
    placa: 'SYN102',
    marca: 'Hino',
    modelo: 'Dutro',
    anio: 2020,
    tipo: 'Camion liviano',
    conductorId: id('665100000000000000000002'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000003'),
    placa: 'SYN103',
    marca: 'Renault',
    modelo: 'Kangoo',
    anio: 2019,
    tipo: 'Van urbana',
    conductorId: id('665100000000000000000003'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000004'),
    placa: 'SYN104',
    marca: 'Isuzu',
    modelo: 'NPR',
    anio: 2022,
    tipo: 'Camion mediano',
    conductorId: id('665100000000000000000004'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000005'),
    placa: 'SYN105',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2023,
    tipo: 'Pickup',
    conductorId: id('665100000000000000000005'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000006'),
    placa: 'SYN106',
    marca: 'Foton',
    modelo: 'Aumark',
    anio: 2021,
    tipo: 'Camion carga seca',
    conductorId: id('665100000000000000000006'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000007'),
    placa: 'SYN107',
    marca: 'Nissan',
    modelo: 'Frontier',
    anio: 2022,
    tipo: 'Pickup operativa',
    conductorId: id('665100000000000000000007'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000008'),
    placa: 'SYN108',
    marca: 'JAC',
    modelo: 'HFC',
    anio: 2018,
    tipo: 'Camion logistico',
    conductorId: id('665100000000000000000008'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('665200000000000000000009'),
    placa: 'SYN109',
    marca: 'Mercedes-Benz',
    modelo: 'Sprinter',
    anio: 2020,
    tipo: 'Van empresarial',
    conductorId: id('665100000000000000000009'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66520000000000000000000a'),
    placa: 'SYN110',
    marca: 'Volkswagen',
    modelo: 'Delivery',
    anio: 2019,
    tipo: 'Camion urbano',
    conductorId: id('66510000000000000000000a'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66520000000000000000000b'),
    placa: 'SYN111',
    marca: 'Kia',
    modelo: 'K2700',
    anio: 2017,
    tipo: 'Camioneta carga',
    conductorId: id('66510000000000000000000b'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66520000000000000000000c'),
    placa: 'SYN112',
    marca: 'Ford',
    modelo: 'Transit',
    anio: 2024,
    tipo: 'Van de soporte',
    conductorId: id('66510000000000000000000c'),
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66520000000000000000000d'),
    placa: 'SYN113',
    marca: 'Hyundai',
    modelo: 'HD65',
    anio: 2016,
    tipo: 'Camion refrigerado',
    conductorId: null,
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
  {
    _id: objectId('66520000000000000000000e'),
    placa: 'SYN114',
    marca: 'Chevrolet',
    modelo: 'NPR Reward',
    anio: 2022,
    tipo: 'Camion de ruta',
    conductorId: null,
    ownerEmail: OWNER_EMAIL,
    ownerEmpresa: OWNER_EMPRESA,
    seedTag: SEED_TAG,
  },
];

const soats = [
  ['665300000000000000000001', '665200000000000000000001', 'SYN101', 'SOAT20260001', 'Seguros Mundial', '2026-01-01', '2026-01-01', '2027-01-01'],
  ['665300000000000000000002', '665200000000000000000002', 'SYN102', 'SOAT20260002', 'Seguros Bolivar', '2025-05-17', '2025-05-17', '2026-05-17'],
  ['665300000000000000000003', '665200000000000000000003', 'SYN103', 'BOL20260003', 'SURA', '2025-04-12', '2025-04-12', '2026-04-12'],
  ['665300000000000000000004', '665200000000000000000004', 'SYN104', 'SUR20260004', 'Previsora Seguros', '2026-02-01', '2026-02-01', '2027-02-01'],
  ['665300000000000000000005', '665200000000000000000005', 'SYN105', 'PRE20260005', 'Aseguradora Solidaria', '2025-05-22', '2025-05-22', '2026-05-22'],
  ['665300000000000000000006', '665200000000000000000006', 'SYN106', 'MAP20260006', 'Mapfre', '2024-12-15', '2024-12-15', '2025-12-15'],
  ['665300000000000000000007', '665200000000000000000007', 'SYN107', 'ALL20260007', 'Allianz', '2026-01-30', '2026-01-30', '2027-01-30'],
  ['665300000000000000000008', '665200000000000000000008', 'SYN108', 'LIB20260008', 'Liberty Seguros', '2025-05-11', '2025-05-11', '2026-05-11'],
  ['665300000000000000000009', '665200000000000000000009', 'SYN109', 'SOAT20260009', 'Seguros Mundial', '2026-03-01', '2026-03-01', '2027-03-01'],
  ['66530000000000000000000a', '66520000000000000000000a', 'SYN110', 'BOL20260010', 'Seguros Bolivar', '2025-03-02', '2025-03-02', '2026-03-02'],
  ['66530000000000000000000b', '66520000000000000000000b', 'SYN111', 'SUR20260011', 'SURA', '2025-05-19', '2025-05-19', '2026-05-19'],
  ['66530000000000000000000c', '66520000000000000000000c', 'SYN112', 'PRE20260012', 'Previsora Seguros', '2026-06-20', '2026-06-20', '2027-06-20'],
].map(([soatId, vehiculoId, placaVehiculo, numeroPoliza, aseguradora, fechaExpedicion, fechaInicioVigencia, fechaFinVigencia]) => ({
  _id: objectId(soatId),
  vehiculoId: id(vehiculoId),
  placaVehiculo,
  numeroPoliza,
  aseguradora,
  fechaExpedicion,
  fechaInicioVigencia,
  fechaFinVigencia,
  fechaInicio: fechaInicioVigencia,
  fechaVencimiento: fechaFinVigencia,
  observaciones: 'Dato demo canónico para validación SOAT.',
  ownerEmail: OWNER_EMAIL,
  ownerEmpresa: OWNER_EMPRESA,
  seedTag: SEED_TAG,
}));

const rtms = [
  ['665400000000000000000001', '665200000000000000000001', 'SYN101', 'RTM20260001', 'CDA Bogota Norte', '2026-02-01', '2027-02-01', 'Aprobado'],
  ['665400000000000000000002', '665200000000000000000002', 'SYN102', 'RTM20260002', 'CDA Movilidad Capital', '2025-05-14', '2026-05-14', 'Aprobado'],
  ['665400000000000000000003', '665200000000000000000003', 'SYN103', 'CDA20260003', 'CDA Andino', '2025-03-30', '2026-03-30', 'Aprobado'],
  ['665400000000000000000004', '665200000000000000000004', 'SYN104', 'REV20260004', 'CDA Autocontrol', '2026-04-01', '2027-04-01', 'Aprobado'],
  ['665400000000000000000005', '665200000000000000000005', 'SYN105', 'TEC20260005', 'CDA Revision Segura', '2025-05-20', '2026-05-20', 'Pendiente'],
  ['665400000000000000000006', '665200000000000000000006', 'SYN106', 'RTM20260006', 'CDA Centro Diagnostico Vial', '2024-11-10', '2025-11-10', 'Rechazado'],
  ['665400000000000000000007', '665200000000000000000007', 'SYN107', 'RTM20260007', 'CDA Ruta Segura', '2026-08-01', '2027-08-01', 'Aprobado'],
  ['665400000000000000000008', '665200000000000000000008', 'SYN108', 'RTM20260008', 'CDA Tecnica Motor', '2025-05-11', '2026-05-11', 'Aprobado'],
  ['665400000000000000000009', '665200000000000000000009', 'SYN109', 'CDA20260009', 'CDA Bogota Norte', '2026-07-01', '2027-07-01', 'Aprobado'],
  ['66540000000000000000000a', '66520000000000000000000a', 'SYN110', 'REV20260010', 'CDA Movilidad Capital', '2025-02-20', '2026-02-20', 'Rechazado'],
  ['66540000000000000000000b', '66520000000000000000000b', 'SYN111', 'TEC20260011', 'CDA Andino', '2025-05-18', '2026-05-18', 'Pendiente'],
  ['66540000000000000000000c', '66520000000000000000000c', 'SYN112', 'RTM20260012', 'CDA Autocontrol', '2026-09-01', '2027-09-01', 'Aprobado'],
].map(([rtmId, vehiculoId, placaVehiculo, numeroCertificado, cda, fechaExpedicion, fechaVencimiento, resultado]) => ({
  _id: objectId(rtmId),
  vehiculoId: id(vehiculoId),
  placaVehiculo,
  numeroCertificado,
  numeroRtm: numeroCertificado,
  cda,
  nitCda: '',
  fechaExpedicion,
  fechaInicio: fechaExpedicion,
  fechaVencimiento,
  resultado,
  observaciones: 'Dato demo canónico para validación RTM.',
  ownerEmail: OWNER_EMAIL,
  ownerEmpresa: OWNER_EMPRESA,
  seedTag: SEED_TAG,
}));

print(`Importando datos demo para ownerEmail=${OWNER_EMAIL}`);

const user = db.usuarios.findOne({ email: OWNER_EMAIL });
if (user) {
  db.usuarios.updateOne(
    { email: OWNER_EMAIL },
    {
      $set: {
        empresa: user.empresa || OWNER_EMPRESA,
        nombre: user.nombre || 'Usuario Demo DriveControl',
      },
    }
  );
} else {
  print(`Aviso: no existe usuario con email ${OWNER_EMAIL}. Inicia sesion con ese correo o cambia OWNER_EMAIL antes de importar.`);
}

db.conductors.deleteMany({
  $or: [
    { ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG },
    { _id: { $in: conductores.map((item) => item._id) } },
  ],
});
db.vehiculos.deleteMany({
  $or: [
    { ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG },
    { _id: { $in: vehiculos.map((item) => item._id) } },
  ],
});
db.soats.deleteMany({
  $or: [
    { ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG },
    { _id: { $in: soats.map((item) => item._id) } },
  ],
});
db.rtms.deleteMany({
  $or: [
    { ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG },
    { _id: { $in: rtms.map((item) => item._id) } },
  ],
});

db.conductors.insertMany(conductores);
db.vehiculos.insertMany(vehiculos);
db.soats.insertMany(soats);
db.rtms.insertMany(rtms);

print('Resumen de importacion:');
printjson({
  ownerEmail: OWNER_EMAIL,
  conductores: db.conductors.countDocuments({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG }),
  vehiculos: db.vehiculos.countDocuments({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG }),
  soats: db.soats.countDocuments({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG }),
  rtms: db.rtms.countDocuments({ ownerEmail: OWNER_EMAIL, seedTag: SEED_TAG }),
});

print('Listo. Abre http://localhost:3000 con ese mismo usuario y revisa dashboard, vehiculos, documentos y alertas.');
