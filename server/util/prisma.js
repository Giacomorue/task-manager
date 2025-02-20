import { PrismaClient } from '@prisma/client';

// Creiamo un'istanza globale di PrismaClient per prevenire la creazione di
// troppe connessioni durante lo sviluppo con Hot Module Replacement (HMR)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
