import { PrismaClient } from '../prisma/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@hospital.edu' },
    update: {},
    create: {
      name: 'Nicolas Admin',
      email: 'admin@hospital.edu',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });
  
  console.log('Usuario creado:', user);
  
  // Crear un área de ejemplo
  const area = await prisma.area.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Urgencias',
    },
  });
  
  console.log('Área creada:', area);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());