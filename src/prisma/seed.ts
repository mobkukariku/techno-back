import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔹 Seeding Objects');

  await prisma.department.createMany({
    data: [
      {
        id: '2',
        name: 'Software Assistants',
        parentDepartmentId: '1',
      },
      {
        id: '3',
        name: 'Hardware Assistants',
        parentDepartmentId: '1',
      },
      {
        id: '4',
        name: 'Data Science Assistants',
        parentDepartmentId: '1',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
