/**
 * MOCK APPLICATION SERVICE
 * This is a demonstration version that simulates Firebase functionality
 * for frontend-only demonstration purposes.
 */

// For mock implementation, no need to import firebase/firestore
import { db, IS_DEMO_MODE } from '../config/firebase';

// In-memory storage for mock applications
const mockApplications = [];
let mockApplicationId = 1;

export const submitApplication = async (applicationData) => {
  try {
    console.log('[DEMO] Submitting application:', applicationData);

    // Create a unique ID for the application
    const applicationId = `mock-app-${mockApplicationId++}`;
    
    // Create a mock application record
    const application = {
      id: applicationId,
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store in mock database
    mockApplications.push(application);
    
    console.log('[DEMO] Application submitted successfully:', applicationId);
    return applicationId;
  } catch (error) {
    console.error('[DEMO] Error submitting application:', error);
    throw error;
  }
};

export const getApplications = async (userId) => {
  try {
    console.log('[DEMO] Getting applications for user:', userId);
    
    // Filter applications by userId if provided
    const userApplications = userId 
      ? mockApplications.filter(app => app.userId === userId)
      : mockApplications;
    
    // If no applications found, create some mock data
    if (userApplications.length === 0) {
      const mockData = [
        {
          id: `mock-app-${mockApplicationId++}`,
          fullName: 'Ahmed bin Abdullah',
          icNumber: '891224106543',
          address: '123 Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur',
          phone: '01223456789',
          email: 'ahmed@example.com',
          monthlyIncome: '2500',
          dependents: '4',
          reason: 'Lost my job due to company downsizing and struggling to support my family.',
          asnafCategory: 'fakir',
          status: 'approved',
          createdAt: new Date('2025-04-20T09:30:00').toISOString(),
          updatedAt: new Date('2025-04-22T14:45:00').toISOString(),
          userId: userId || 'anonymous'
        },
        {
          id: `mock-app-${mockApplicationId++}`,
          fullName: 'Fatimah binti Hassan',
          icNumber: '930518085412',
          address: '45 Lorong Bahagia, Kampung Harmoni, 40100 Shah Alam, Selangor',
          phone: '0187654321',
          email: 'fatimah@example.com',
          monthlyIncome: '1800',
          dependents: '3',
          reason: 'Single mother with three children, struggling with medical expenses.',
          asnafCategory: 'miskin',
          status: 'pending',
          createdAt: new Date('2025-05-01T11:20:00').toISOString(),
          updatedAt: new Date('2025-05-01T11:20:00').toISOString(),
          userId: userId || 'anonymous'
        }
      ];
      
      // Add to mock database
      mockApplications.push(...mockData);
      return mockData;
    }
    
    return userApplications;
  } catch (error) {
    console.error('[DEMO] Error getting applications:', error);
    throw error;
  }
};

// Add more mock functions as needed
export const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    const appIndex = mockApplications.findIndex(app => app.id === applicationId);
    if (appIndex === -1) {
      throw new Error('Application not found');
    }
    
    mockApplications[appIndex].status = newStatus;
    mockApplications[appIndex].updatedAt = new Date().toISOString();
    
    return mockApplications[appIndex];
  } catch (error) {
    console.error('[DEMO] Error updating application status:', error);
    throw error;
  }
};