const prisma = require("./prisma.js");

const connectToDb = async () => {
    try {
        console.log("🔄 Attempting to connect to PostgreSQL database via Prisma...");
        await prisma.$connect();
        console.log("✅ Database connected successfully via Prisma!");
    } catch (error) {
        console.error("❌ Failed to connect to the database. Error:", error.message);
        throw error;
    }
};

module.exports = connectToDb;
