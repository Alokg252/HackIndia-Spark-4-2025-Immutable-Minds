import DatabaseService from './DatabaseService';

export interface UserCourse {
  id: number;
  userId: string;
  courseId: number;
  title: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
  instructor: string;
  duration: string;
  tags: string[];
  certificateHash?: string;
}

class UserCourseService {
  private static instance: UserCourseService;
  private db: DatabaseService;

  private constructor() {
    console.log('Initializing UserCourseService');
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): UserCourseService {
    if (!UserCourseService.instance) {
      UserCourseService.instance = new UserCourseService();
    }
    return UserCourseService.instance;
  }

  public async addCourse(courseId: number, userId: string): Promise<void> {
    console.log(`Adding course ${courseId} for user ${userId}`);
    try {
      const userCourses = await this.db.query('user_courses', { userId });
      console.log('Current user courses:', userCourses);

      if (!userCourses.some(course => course.courseId === courseId)) {
        const newCourse = {
          id: Date.now(),
          userId,
          courseId,
          title: `Course ${courseId}`, // This should be fetched from a course service
          progress: 0,
          completed: false,
          lastAccessed: new Date().toISOString()
        };
        console.log('Adding new course:', newCourse);
        const result = await this.db.execute('INSERT', 'user_courses', newCourse);
        console.log('Course addition result:', result);
        
        // Verify the course was added
        const updatedCourses = await this.db.query('user_courses', { userId });
        console.log('Updated user courses:', updatedCourses);
      } else {
        console.log('Course already exists for user');
      }
    } catch (error) {
      console.error('Error in addCourse:', error);
      throw error;
    }
  }

  public async getUserCourses(userId: string): Promise<UserCourse[]> {
    console.log(`Fetching courses for user ${userId}`);
    const userCourses = await this.db.query('user_courses', { userId });
    console.log('Found user courses:', userCourses);
    return userCourses;
  }

  public async updateProgress(courseId: number, userId: string, progress: number): Promise<void> {
    console.log(`Updating progress for course ${courseId} for user ${userId} to ${progress}%`);
    const userCourses = await this.db.query('user_courses', { userId, courseId });
    console.log('Found course to update:', userCourses);

    if (userCourses.length > 0) {
      const course = userCourses[0];
      const updatedCourse = {
        ...course,
        progress,
        completed: progress >= 100,
        lastAccessed: new Date().toISOString()
      };
      console.log('Updating course:', updatedCourse);
      await this.db.execute('UPDATE', 'user_courses', updatedCourse);
    } else {
      console.log('Course not found for user');
    }
  }

  public async isCourseOwned(courseId: number, userId: string): Promise<boolean> {
    console.log(`Checking if user ${userId} owns course ${courseId}`);
    const userCourses = await this.db.query('user_courses', { userId, courseId });
    const isOwned = userCourses.length > 0;
    console.log('Course ownership status:', isOwned);
    return isOwned;
  }

  public async getCompletedCourses(userId: string): Promise<UserCourse[]> {
    console.log(`Fetching completed courses for user ${userId}`);
    const userCourses = await this.db.query('user_courses', { userId, completed: true });
    console.log('Found completed courses:', userCourses);
    return userCourses;
  }
}

export default UserCourseService; 