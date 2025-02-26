import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔹 Seeding Objects');
  // Создаем пользователей (глав отделов)
  const head3 = await prisma.user.create({
    data: {
      email: 'head3@example.com',
      password: 'password',
      name: 'Head 3',
      role: 'manager',
    },
  });

  const subDepartment1 = await prisma.department.create({
    data: {
      name: 'Sub Department 1',
      headId: head3.id,
      parentDepartmentId: 'a3c3cb82-35b0-4511-8d18-cad24c109443',
    },
  });
  //
  // const subDepartment2 = await prisma.department.create({
  //   data: {
  //     name: 'Sub Department 2',
  //     parentDepartmentId: parentDepartment.id,
  //   },
  // });
  //
  // // Добавляем подчиненных сотрудников
  // const employee1 = await prisma.user.create({
  //   data: {
  //     email: 'employee1@example.com',
  //     password: 'password',
  //     name: 'Employee 1',
  //     role: 'member',
  //   },
  // });
  //
  const employee4 = await prisma.user.create({
    data: {
      email: 'employee4@example.com',
      password: 'password',
      name: 'Employee 4',
      role: 'member',
    },
  });
  await prisma.departmentMember.create({
    data: {
      userId: employee4.id,
      departmentId: subDepartment1.id,
      role: 'member',
    },
  });

  console.log('Departments and employees seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
