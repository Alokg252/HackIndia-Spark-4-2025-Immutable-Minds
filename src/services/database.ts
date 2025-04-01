import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'learnify.db');

// Database schema
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_notifications (
    user_id INTEGER PRIMARY KEY,
    course_updates BOOLEAN DEFAULT 1,
    certificates BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY,
    courses_enrolled INTEGER DEFAULT 0,
    certificates_earned INTEGER DEFAULT 0,
    hours_learned INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    instructor TEXT NOT NULL,
    total_lessons INTEGER NOT NULL,
    thumbnail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    last_accessed DATETIME,
    next_lesson TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    credential_id TEXT UNIQUE NOT NULL,
    skills TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );
`;

class DatabaseService {
  private static instance: DatabaseService;
  private db: any;

  private constructor() {}

  static async getInstance(): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      await DatabaseService.instance.initialize();
    }
    return DatabaseService.instance;
  }

  private async initialize() {
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Initialize schema
    await this.db.exec(schema);
  }

  // User operations
  async createUser(walletAddress: string): Promise<number> {
    const result = await this.db.run(
      'INSERT INTO users (wallet_address) VALUES (?)',
      [walletAddress]
    );
    
    // Initialize notifications and stats
    await this.db.run(
      'INSERT INTO user_notifications (user_id) VALUES (?)',
      [result.lastID]
    );
    await this.db.run(
      'INSERT INTO user_stats (user_id) VALUES (?)',
      [result.lastID]
    );

    return result.lastID;
  }

  async getUserByWallet(walletAddress: string) {
    return await this.db.get(
      `SELECT u.*, un.*, us.* 
       FROM users u 
       LEFT JOIN user_notifications un ON u.id = un.user_id 
       LEFT JOIN user_stats us ON u.id = us.user_id 
       WHERE u.wallet_address = ?`,
      [walletAddress]
    );
  }

  async updateUserProfile(userId: number, data: {
    displayName?: string;
    email?: string;
    bio?: string;
  }) {
    const updates = [];
    const values = [];
    
    if (data.displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(data.displayName);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    values.push(userId);
    
    await this.db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  async updateUserNotifications(userId: number, data: {
    courseUpdates?: boolean;
    certificates?: boolean;
  }) {
    const updates = [];
    const values = [];
    
    if (data.courseUpdates !== undefined) {
      updates.push('course_updates = ?');
      values.push(data.courseUpdates ? 1 : 0);
    }
    if (data.certificates !== undefined) {
      updates.push('certificates = ?');
      values.push(data.certificates ? 1 : 0);
    }
    
    values.push(userId);
    
    await this.db.run(
      `UPDATE user_notifications SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );
  }

  // Course operations
  async getUserCourses(userId: number) {
    return await this.db.all(
      `SELECT uc.*, c.title, c.instructor, c.total_lessons, c.thumbnail 
       FROM user_courses uc 
       JOIN courses c ON uc.course_id = c.id 
       WHERE uc.user_id = ? 
       ORDER BY uc.updated_at DESC`,
      [userId]
    );
  }

  async updateCourseProgress(
    userId: number,
    courseId: number,
    progress: number,
    completedLessons: number,
    nextLesson: string
  ) {
    await this.db.run(
      `UPDATE user_courses 
       SET progress = ?, 
           completed_lessons = ?, 
           next_lesson = ?,
           last_accessed = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND course_id = ?`,
      [progress, completedLessons, nextLesson, userId, courseId]
    );
  }

  // Certificate operations
  async getUserCertificates(userId: number) {
    return await this.db.all(
      `SELECT c.*, co.title as course_title, co.instructor 
       FROM certificates c 
       JOIN courses co ON c.course_id = co.id 
       WHERE c.user_id = ? 
       ORDER BY c.issue_date DESC`,
      [userId]
    );
  }

  async createCertificate(
    userId: number,
    courseId: number,
    credentialId: string,
    skills: string
  ) {
    await this.db.run(
      `INSERT INTO certificates (user_id, course_id, credential_id, skills) 
       VALUES (?, ?, ?, ?)`,
      [userId, courseId, credentialId, skills]
    );

    // Update user stats
    await this.db.run(
      `UPDATE user_stats 
       SET certificates_earned = certificates_earned + 1 
       WHERE user_id = ?`,
      [userId]
    );
  }
}

export default DatabaseService; 