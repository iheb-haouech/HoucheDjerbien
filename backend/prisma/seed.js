const prisma = require('../src/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('issam2026', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'contact@djerbahouch.fr' },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      name: 'Admin Djerba Houches',
    },
    create: {
      name: 'Admin Djerba Houches',
      email: 'contact@djerbahouch.fr',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  
  console.log('Admin account ready:', admin.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });