/**
 * MOCK FIREBASE CONFIGURATION
 * This file provides mock implementations of Firebase services
 * for frontend-only demonstration purposes.
 */

// Mock Firestore database
class MockFirestore {
  constructor() {
    console.log('[DEMO] Initializing mock Firestore database');
    this.collections = {};
  }
  
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return {
      name,
      add: (data) => {
        const id = `mock-id-${Math.random().toString(36).substring(2, 11)}`;
        this.collections[name].push({ id, ...data });
        return { id };
      },
      get: () => {
        return this.collections[name];
      }
    };
  }
}

// Mock Storage
class MockStorage {
  constructor() {
    console.log('[DEMO] Initializing mock Firebase Storage');
    this.files = {};
  }
  
  ref(path) {
    return {
      path,
      put: (file) => {
        this.files[path] = file;
        return { ref: { getDownloadURL: () => Promise.resolve(`https://mock-storage/${path}`) } };
      },
      getDownloadURL: () => Promise.resolve(`https://mock-storage/${path}`)
    };
  }
}

// Create mock instances
export const db = new MockFirestore();
export const storage = new MockStorage();

// Add a demo flag to indicate we're using mocks
export const IS_DEMO_MODE = true;

console.log('[DEMO] Firebase mock services initialized for frontend-only demo');