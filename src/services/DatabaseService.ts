class DatabaseService {
  private static instance: DatabaseService;
  private storage: Storage;

  private constructor() {
    console.log('Initializing DatabaseService');
    this.storage = window.localStorage;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize() {
    console.log('Initializing database collections...');
    // Initialize default data if not exists
    if (!this.storage.getItem('user_profiles')) {
      console.log('Initializing user_profiles collection');
      this.storage.setItem('user_profiles', '[]');
    }
    if (!this.storage.getItem('tasks')) {
      console.log('Initializing tasks collection');
      this.storage.setItem('tasks', '[]');
    }
    if (!this.storage.getItem('events')) {
      console.log('Initializing events collection');
      this.storage.setItem('events', '[]');
    }
    if (!this.storage.getItem('timetable')) {
      console.log('Initializing timetable collection');
      this.storage.setItem('timetable', '[]');
    }
    if (!this.storage.getItem('user_courses')) {
      console.log('Initializing user_courses collection');
      this.storage.setItem('user_courses', '[]');
    }
    console.log('Database initialization complete');
  }

  private getCollection(name: string): any[] {
    const data = this.storage.getItem(name);
    console.log(`Getting collection ${name}:`, data);
    return data ? JSON.parse(data) : [];
  }

  private setCollection(name: string, data: any[]) {
    console.log(`Setting collection ${name}:`, data);
    this.storage.setItem(name, JSON.stringify(data));
  }

  public async query(collection: string, filter: Record<string, any> = {}): Promise<any[]> {
    console.log(`Querying collection ${collection} with filter:`, filter);
    const data = this.getCollection(collection);
    const filteredData = data.filter(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });
    console.log(`Query result for ${collection}:`, filteredData);
    return filteredData;
  }

  public async execute(operation: string, collection: string, data: any): Promise<any> {
    console.log(`Executing ${operation} on collection ${collection}:`, data);
    const currentData = this.getCollection(collection);
    
    if (operation === 'INSERT') {
      const newId = currentData.length > 0 ? Math.max(...currentData.map(item => item.id)) + 1 : 1;
      const newItem = { id: newId, ...data };
      currentData.push(newItem);
      this.setCollection(collection, currentData);
      console.log(`Inserted new item in ${collection}:`, newItem);
      return newItem;
    }
    
    if (operation === 'UPDATE') {
      const index = currentData.findIndex(item => item.id === data.id);
      if (index !== -1) {
        currentData[index] = { ...currentData[index], ...data };
        this.setCollection(collection, currentData);
        console.log(`Updated item in ${collection}:`, currentData[index]);
        return currentData[index];
      }
    }
    
    return null;
  }
}

export default DatabaseService; 