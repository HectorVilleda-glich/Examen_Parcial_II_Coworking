import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const spaces = [
  // SALAS
  {
    name: 'Sala Ejecutiva Premium',
    description: 'Sala de reuniones ejecutiva con equipamiento de primera. Ideal para juntas de directorio y negociaciones importantes.',
    location: 'Piso 3, Zona Norte',
    capacity: 12,
    type: 'SALA',
    price: 200,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  },
  {
    name: 'Sala de Conferencias',
    description: 'Amplia sala con proyector de alta definicion y sistema de sonido. Perfecta para presentaciones y capacitaciones.',
    location: 'Piso 2, Zona Centro',
    capacity: 30,
    type: 'SALA',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800',
  },
  {
    name: 'Sala Creativa',
    description: 'Espacio inspirador con pizarron blanco y area de brainstorming. Ideal para equipos de diseno y marketing.',
    location: 'Piso 1, Zona Sur',
    capacity: 8,
    type: 'SALA',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
  },
  {
    name: 'Sala VIP Todo Incluido',
    description: 'Nuestra sala premium con WiFi de alta velocidad, proyector 4K, cafetera profesional y servicio de catering incluido.',
    location: 'Piso 4, Zona Norte',
    capacity: 15,
    type: 'SALA',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800',
  },
  // ESCRITORIOS
  {
    name: 'Escritorio Individual',
    description: 'Escritorio privado en area tranquila. Incluye silla ergonomica y enchufes personales.',
    location: 'Piso 1, Zona Este',
    capacity: 1,
    type: 'ESCRITORIO',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  },
  {
    name: 'Escritorio con WiFi Premium',
    description: 'Escritorio en area de coworking con acceso a internet de alta velocidad y monitor externo.',
    location: 'Piso 2, Zona Este',
    capacity: 1,
    type: 'ESCRITORIO',
    price: 100,
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
  },
  {
    name: 'Estacion de Trabajo Completa',
    description: 'Escritorio con monitor dual, keyboard mecanico, WiFi dedicado y acceso a cafeteria ilimitada.',
    location: 'Piso 2, Zona Centro',
    capacity: 1,
    type: 'ESCRITORIO',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
  },
  {
    name: 'Escritorio Economica',
    description: 'Escritorio compartido en area abierta. Conexion WiFi incluida. Ideal para freelancers.',
    location: 'Piso 1, Zona Oeste',
    capacity: 1,
    type: 'ESCRITORIO',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
  },
  // AUDITORIOS
  {
    name: 'Auditorio Principal',
    description: 'Auditorio con capacidad para eventos masivos. Proyector laser, sistema de sonido envolvente y escenario.',
    location: 'Planta Baja, Zona Central',
    capacity: 100,
    type: 'AUDITORIO',
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  {
    name: 'Auditorio Mediano',
    description: 'Espacio para presentaciones y conferencias con proyector HD y areas de coffee break.',
    location: 'Piso 3, Zona Sur',
    capacity: 50,
    type: 'AUDITORIO',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
  },
  {
    name: 'Sala de Eventos Premium',
    description: 'Auditorio de lujo con WiFi de alta velocidad, proyector 4K, cafetera profesional y cabina de traduccion.',
    location: 'Piso 4, Zona Central',
    capacity: 75,
    type: 'AUDITORIO',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
  },
];

async function main() {
  console.log('Limpiando espacios existentes...');
  await prisma.space.deleteMany();

  console.log('Creando espacios de coworking...\n');
  for (const space of spaces) {
    const created = await prisma.space.create({ data: space });
    console.log(`  [${created.type.padEnd(10)}] ${created.name.padEnd(30)} L ${created.price}/hora`);
  }

  console.log(`\nTotal: ${spaces.length} espacios creados exitosamente`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
