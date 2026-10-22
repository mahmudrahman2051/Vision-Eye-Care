require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./db/pool');

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    // Test database connection
    await testConnection();
  } catch (error) {
    console.warn('⚠️ Warning: Database connection issue:', error.message);
    console.warn('   Ensure DATABASE_URL is properly configured in your .env file.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Drishti API Server`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Port: ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}\n`);
  });
}

startServer();
