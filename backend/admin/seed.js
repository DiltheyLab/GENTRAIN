import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'secretPassword';
  const roleName = 'superuser';

  // If there isn't a role with the name "superuser", create it
  let role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: roleName,
      },
    });
    console.log(`Role "${roleName}" created`);
  }

  // Check if a user with the superuser role already exists
  const existingAdmin = await prisma.User.findFirst({
    where: { roleId: role.id },
  });

  if (!existingAdmin) {
    await prisma.User.create({
      data: {
        username,
        password: await hash(password),
        roleId: role.id,
        created_at: new Date(),
      },
    });
    console.log(`Superadmin "${username}" created with default password`);
  } else {
    console.log('Superadmin already exists, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
