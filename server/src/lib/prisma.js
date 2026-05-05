const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const maskedUrl = process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':****@');
console.log(`Prisma initialized with URL: ${maskedUrl}`);

module.exports = prisma;
