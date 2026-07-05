import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const existing = await prisma.user.findFirst({ where: { email: 'devbox@example.com' } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('devbox123', 10);
    await prisma.user.create({
      data: {
        name: 'DevBox Admin',
        email: 'devbox@example.com',
        password: hashedPassword,
        role: 'Developer',
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
