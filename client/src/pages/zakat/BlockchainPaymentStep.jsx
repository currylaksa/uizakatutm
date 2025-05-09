import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const BlockchainPaymentStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const initialDepositAmount = userData.zakatAmount > 0 ? userData.zakatAmount : 0;
  const [depositAmount, setDepositAmount] = useState(initialDepositAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  // Change rmToEthRate to a fixed, smaller number for easier understanding (1 RM = 1.5 ETH)
  const rmToEthRate = 1.5; 
  const [ethAmount, setEthAmount] = useState(depositAmount * rmToEthRate);
  const { 
    currentAccount, 
    connectWallet, 
    sendTransaction, 
    isLoading, 
    handleChange,
    getZakatTransactions
  } = useContext(TransactionContext);
  
  // New state for demo mode
  const [isMockWalletConnected, setIsMockWalletConnected] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  useEffect(() => {
     const amount = Number(depositAmount) || 0;
     // Allow for extremely small amounts
     if (amount < 0.000001) {
         setError('Please enter a positive amount.');
     } else {
         setError('');
     }
     // Apply consistent formatting for the displayed ETH amount 
     setEthAmount(parseFloat((amount * rmToEthRate).toFixed(6)));
  }, [depositAmount, rmToEthRate]);

   useEffect(() => {
     const newInitialAmount = userData.zakatAmount > 0 ? userData.zakatAmount : 0;
     setDepositAmount(newInitialAmount);
   }, [userData.zakatAmount]);

   useEffect(() => {
    handleChange({ target: { value: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F" }}, 'addressTo');
    handleChange({ target: { value: ethAmount.toString() }}, 'amount');
    handleChange({ target: { value: 'ZAKAT' }}, 'keyword');
    handleChange({ target: { value: `Zakat payment for categories: ${userData.selectedCategories.map(c => c.name).join(', ')}` }}, 'message');
   }, [ethAmount, userData.selectedCategories]);

  const handleDepositChange = (e) => {
    const value = e.target.value;
    // Calculate ETH value directly here to ensure consistency
    const ethValue = (Number(value) * rmToEthRate).toFixed(6);
    
    // Pass the ETH value directly as a string to avoid precision issues
    handleChange({ target: { value: ethValue }}, 'amount');
    
    // Update local state for the RM value
    setDepositAmount(value === '' ? '' : Number(value));
  };

  const connectMockWallet = async () => {
    setIsProcessing(true);
    setDemoMessage('Connecting to demo wallet...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await connectWallet();
    setIsMockWalletConnected(true);
    setDemoMessage('Demo wallet connected!');
    setIsProcessing(false);
  };

  const processPayment = async () => {
    const finalDepositAmount = Number(depositAmount) || 0;

    if (finalDepositAmount < 0.000001) {
      setError('Please enter a valid amount to donate.');
      return;
    }
    
    try {
      setError('');
      setIsProcessing(true);

      if (!currentAccount && !isMockWalletConnected) {
        await connectMockWallet();
        return;
      }

      // DEMO MODE: For RM 1, we should send exactly 1.5 ETH
      const ethValue = (finalDepositAmount * rmToEthRate).toFixed(6);
      console.log('RM Amount:', finalDepositAmount);
      console.log('Conversion rate:', rmToEthRate);
      console.log('ETH Amount (calculated):', ethValue);

      // Set form data for transaction
      handleChange({ target: { value: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F" }}, 'addressTo');
      handleChange({ target: { value: ethValue }}, 'amount');
      handleChange({ target: { value: 'ZAKAT' }}, 'keyword');
      handleChange({ target: { value: `Zakat payment for categories: ${userData.selectedCategories.map(c => c.name).join(', ')}` }}, 'message');

      // Show processing message
      setDemoMessage('Processing payment...');
      
      // Execute transaction
      await sendTransaction();
      
      // Create a mock transaction hash
      const mockTransactionHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      setDemoMessage('Payment successful! Recording transaction details...');
      
      // Create transaction details object
      const transactionDetails = {
        transactionId: mockTransactionHash,
        amount: finalDepositAmount,
        ethAmount: ethValue,
        rmToEthRate: rmToEthRate,
        timestamp: new Date().toISOString(),
        status: 'Confirmed',
        categories: userData.selectedCategories.map(c => c.name).join(', '),
        walletAddress: currentAccount || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
      };

      // Update user data with transaction details
      updateUserData({ transactionDetails });
      
      setDemoMessage('Transaction completed successfully!');
      
      // Force refresh of Zakat transactions in the mock context
      await getZakatTransactions();
      
      // Move to next step
      nextStep();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Transaction failed. Please try again.');
      setDemoMessage('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Step 5: Payment Process</h2>
      
      {/* Demo mode indicator */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700 text-sm font-medium">
          <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs mr-2">DEMO MODE</span>
          This is a demonstration version showing how the payment process would work.
        </p>
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-5">
        <h3 className="text-lg font-medium text-gray-800">Confirm Donation Amount</h3>

        {initialDepositAmount > 0 && (
             <p className="text-sm text-gray-600">
                 Your calculated Zakat amount is: <span className="font-semibold text-green-700">RM {initialDepositAmount.toFixed(2)}</span>
                 <span className="ml-2 text-blue-600 text-xs">(You can donate as little as RM 0.01 or less)</span>
             </p>
         )}

        <div>
          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Enter donation amount (RM):
          </label>
          <input
            type="number"
            id="depositAmount"
            value={depositAmount}
            onChange={handleDepositChange}
            min="0.000001" 
            step="any"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter amount (e.g., 0.01)"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "deposit-error" : undefined}
          />
          {error && <p id="deposit-error" className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        {/* Conversion Info */}
        <div className="p-3 bg-gray-50 rounded border border-gray-100">
          <p className="text-sm text-gray-600">Equivalent amount in Ethereum (ETH):</p>
          <p className="text-lg font-semibold text-indigo-700">{ethAmount.toFixed(8)} ETH</p>
          <p className="text-xs text-gray-500">(Rate: 1 RM ≈ {rmToEthRate.toPrecision(2)} ETH - illustrative rate)</p>
        </div>

         {/* Payment Method (Simplified) */}
         <div>
             <h4 className="text-sm font-medium text-gray-700 mb-2">Payment via Blockchain</h4>
             <div className="flex items-center p-3 border border-green-200 bg-green-50 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm text-green-800">
                  {currentAccount || isMockWalletConnected ? 
                    `Connected: ${currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Demo Wallet"}` : 
                    "Payment will be processed securely (Demo Mode)"}
                </p>
             </div>
         </div>
      </div>

      {/* Demo message */}
      {demoMessage && (
        <div className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded">
          {isProcessing && (
            <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <p className="text-sm text-blue-700">{demoMessage}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={isProcessing || isLoading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={processPayment}
          disabled={isProcessing || isLoading || !!error || (Number(depositAmount) < 0.000001)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing || isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            !currentAccount && !isMockWalletConnected ? 'Connect Demo Wallet' : 'Complete Payment'
          )}
        </button>
      </div>
       <p className="text-xs text-gray-500 text-center mt-4">
        This is a demonstration of the payment process for presentation purposes.
       </p>
    </div>
  );
};

export default BlockchainPaymentStep;
