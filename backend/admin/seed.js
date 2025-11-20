import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'secretPassword';

  const superUserRoleName = 'superuser';
  const normalUserRoleName = 'user';

  // --- Ensure superuser role exists ---
  let superUserRole = await prisma.role.findUnique({
    where: { name: superUserRoleName },
  });

  if (!superUserRole) {
    superUserRole = await prisma.role.create({
      data: { name: superUserRoleName },
    });
    console.log(`Role "${superUserRoleName}" created`);
  }

  // --- Ensure normal user role exists ---
  let normalUserRole = await prisma.role.findUnique({
    where: { name: normalUserRoleName },
  });

  if (!normalUserRole) {
    normalUserRole = await prisma.role.create({
      data: { name: normalUserRoleName },
    });
    console.log(`Role "${normalUserRoleName}" created`);
  }

  console.log("SUPERUSERROLE", superUserRole);
  
  // --- Ensure admin user exists ---
  const existingAdmin = await prisma.User.findFirst({
    where: { roleId: superUserRole.id },
  });

  if (!existingAdmin) {
    await prisma.User.create({
      data: {
        username,
        password: await hash(password),
        roleId: superUserRole.id,
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
