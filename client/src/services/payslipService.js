/**
 * MOCK PAYSLIP SERVICE
 * This is a demonstration version that simulates Firebase functionality
 * for frontend demo purposes.
 */

// In-memory storage for mock data
const mockPayslips = [];
let mockDocumentId = 1;

/**
 * Upload a payslip document and store its extracted information
 * @param {File} file - The payslip file to upload
 * @param {Object} extractedData - Data extracted from the document
 * @param {string} userId - User ID (optional)
 * @returns {Promise<string>} - Document ID of the created record
 */
export const uploadPayslip = async (file, extractedData, userId = null) => {
  try {
    console.log('[DEMO] Uploading payslip:', file?.name);
    
    // Create mock payslip data
    const payslipData = {
      id: `mock-doc-${mockDocumentId++}`,
      fileName: file?.name || 'sample-payslip.pdf',
      fileType: file?.type || 'application/pdf',
      fileSize: file?.size || 250000,
      uploadDate: new Date().toISOString(),
      userId: userId || 'anonymous',
      name: extractedData.name || null,
      monthlySalary: extractedData.salary ? Number(extractedData.salary) : null,
      monthlyDeductions: extractedData.deductions ? Number(extractedData.deductions) : 0,
      totalZakatableAssets: extractedData.assets ? Number(extractedData.assets) : null,
      status: 'processed',
      processingDate: new Date().toISOString(),
      fileUrl: 'https://example.com/mock-payslip.pdf'
    };
    
    // Store in mock database
    mockPayslips.push(payslipData);
    
    console.log('[DEMO] Payslip uploaded successfully:', payslipData.id);
    return payslipData.id;
  } catch (error) {
    console.error('[DEMO] Error in mock uploadPayslip:', error);
    throw error;
  }
};

/**
 * Get all payslips for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of payslip documents
 */
export const getUserPayslips = async (userId) => {
  try {
    console.log('[DEMO] Getting payslips for user:', userId);
    
    if (!userId) {
      console.warn('[DEMO] No user ID provided to getUserPayslips');
      return [];
    }
    
    // Filter payslips by userId
    const userPayslips = mockPayslips.filter(p => p.userId === userId);
    
    // If no payslips found for this user, create some mock data
    if (userPayslips.length === 0) {
      const mockData = [
        {
          id: `mock-doc-${mockDocumentId++}`,
          fileName: 'payslip-april-2025.pdf',
          fileType: 'application/pdf',
          fileSize: 245000,
          uploadDate: new Date('2025-04-15T09:30:00').toISOString(),
          processingDate: new Date('2025-04-15T09:31:00').toISOString(),
          userId: userId,
          name: 'John Doe',
          monthlySalary: 5000,
          monthlyDeductions: 500,
          totalZakatableAssets: 50000,
          status: 'processed',
          fileUrl: 'https://example.com/mock-payslip-1.pdf'
        },
        {
          id: `mock-doc-${mockDocumentId++}`,
          fileName: 'payslip-may-2025.pdf',
          fileType: 'application/pdf',
          fileSize: 248000,
          uploadDate: new Date('2025-05-05T10:15:00').toISOString(),
          processingDate: new Date('2025-05-05T10:16:00').toISOString(),
          userId: userId,
          name: 'John Doe',
          monthlySalary: 5200,
          monthlyDeductions: 520,
          totalZakatableAssets: 52000,
          status: 'processed',
          fileUrl: 'https://example.com/mock-payslip-2.pdf'
        }
      ];
      
      // Add to mock database
      mockPayslips.push(...mockData);
      return mockData.map(doc => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
        processingDate: new Date(doc.processingDate)
      }));
    }
    
    return userPayslips.map(doc => ({
      ...doc,
      uploadDate: new Date(doc.uploadDate),
      processingDate: doc.processingDate ? new Date(doc.processingDate) : null
    }));
  } catch (error) {
    console.error('[DEMO] Error in mock getUserPayslips:', error);
    throw error;
  }
};

/**
 * Save a payslip document after payment
 * @param {Object} userData - User data containing personal and document information
 * @returns {Promise<string>} - Document ID of the created record
 */
export const savePayslipAfterPayment = async (userData) => {
  try {
    console.log('[DEMO] Saving payslip after payment:', userData);
    
    // Create mock payslip data
    const payslipData = {
      id: `mock-doc-${mockDocumentId++}`,
      userId: userData.userId || 'anonymous',
      name: userData.personalInfo?.name || 
            userData.documentData?.name || 
            'Demo User',
      monthlySalary: userData.personalInfo?.salary ? Number(userData.personalInfo.salary) : 
                    (userData.documentData?.salary ? Number(userData.documentData.salary) : 5000),
                    
      monthlyDeductions: userData.personalInfo?.deductions ? Number(userData.personalInfo.deductions) : 
                         (userData.documentData?.deductions ? Number(userData.documentData.deductions) : 500),
                         
      totalZakatableAssets: userData.personalInfo?.assets ? Number(userData.personalInfo.assets) : 
                           (userData.documentData?.assets ? Number(userData.documentData.assets) : 50000),
      
      zakatAmount: userData.zakatAmount ? Number(userData.zakatAmount) : 1250,
      fileName: userData.documentData?.fileName || 'demo-payslip.pdf',
      fileType: userData.documentData?.fileType || 'application/pdf',
      fileSize: userData.documentData?.fileSize || 250000,
      uploadDate: userData.documentData?.uploadDate || new Date().toISOString(),
      status: 'completed',
      paymentDate: new Date().toISOString(),
      transactionId: userData.transactionDetails?.transactionId || 
                    '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    };
    
    // Store in mock database
    mockPayslips.push(payslipData);
    
    console.log('[DEMO] Payslip saved successfully after payment:', payslipData.id);
    return payslipData.id;
  } catch (error) {
    console.error('[DEMO] Error in mock savePayslipAfterPayment:', error);
    throw new Error('Demo error: Failed to save payslip data');
  }
};