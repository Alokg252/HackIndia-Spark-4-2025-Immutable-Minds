import DatabaseService from './DatabaseService';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    const db = DatabaseService.getInstance();
    await db.initialize();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
} 