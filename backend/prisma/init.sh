#!/bin/sh

cat $(pwd)/prisma/api.prisma > $(pwd)/api/schema.prisma
echo "" >> $(pwd)/api/schema.prisma
cat $(pwd)/prisma/shared.prisma >> $(pwd)/api/schema.prisma

cat $(pwd)/prisma/admin.prisma > $(pwd)/admin/schema.prisma
echo "" >> $(pwd)/admin/schema.prisma
cat $(pwd)/prisma/shared.prisma >> $(pwd)/admin/schema.prisma

exit 0