import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

export default prisma;
