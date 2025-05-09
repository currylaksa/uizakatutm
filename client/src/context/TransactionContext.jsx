import React, { useEffect, useState, createContext } from "react";

export const TransactionContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || 0
  );
  const [transactions, setTransactions] = useState([]);
  const [zakatTransactions, setZakatTransactions] = useState([]);

  // Mock wallet address
  const mockWalletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  
  // Mock transaction data
  const mockTransactions = [
    {
      id: "0x1234...abcd",
      url: "https://sepolia.etherscan.io/tx/0x1234abcd",
      message: "Zakat Payment",
      timestamp: "2025-05-01T12:30:45Z",
      addressFrom: mockWalletAddress,
      addressTo: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F",
      amount: "0.05 ETH",
      keyword: "ZAKAT"
    },
    {
      id: "0x5678...efgh",
      url: "https://sepolia.etherscan.io/tx/0x5678efgh",
      message: "Donation",
      timestamp: "2025-04-15T16:22:30Z",
      addressFrom: mockWalletAddress,
      addressTo: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F",
      amount: "0.02 ETH",
      keyword: "DONATION"
    }
  ];

  // Mock zakat transactions
  const mockZakatTransactions = [
    {
      addressTo: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F",
      addressFrom: mockWalletAddress,
      timestamp: "2025-05-08 14:22:30",
      message: "Zakat payment for categories: Income, Savings",
      amount: "0.075",
      keyword: "ZAKAT",
      transactionHash: "0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx"
    },
    {
      addressTo: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F",
      addressFrom: mockWalletAddress,
      timestamp: "2025-04-20 09:15:45",
      message: "Zakat payment for categories: Business",
      amount: "0.12",
      keyword: "ZAKAT",
      transactionHash: "0x9876uvwx5432qrst1098mnop7654ijkl3210efgh"
    }
  ];

  useEffect(() => {
    // Initialize mock data
    setTransactions(mockTransactions);
    setZakatTransactions(mockZakatTransactions);
    localStorage.setItem("transactionCount", 2);
    setTransactionCount(2);
  }, []);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentAccount(mockWalletAddress);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setCurrentAccount("");
  };
  
  const checkIfWalletIsConnect = async () => {
    try {
      // For demo purposes, always return as not connected initially
      setCurrentAccount("");
      return "";
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const getAllTransactions = async () => {
    try {
      return mockTransactions;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const getZakatTransactions = async () => {
    try {
      return mockZakatTransactions;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const sendTransaction = async () => {
    try {
      setIsLoading(true);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock transaction hash
      const mockTxHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const { addressTo, amount, keyword, message } = formData;
      
      // Create a new transaction record
      const newTransaction = {
        id: mockTxHash,
        url: `https://sepolia.etherscan.io/tx/${mockTxHash}`,
        message,
        timestamp: new Date().toLocaleString(),
        addressFrom: currentAccount || mockWalletAddress,
        addressTo,
        amount: `${amount} ETH`,
        keyword
      };
      
      // Create a new zakat transaction if the keyword is ZAKAT
      if (keyword === 'ZAKAT') {
        const newZakatTx = {
          addressTo,
          addressFrom: currentAccount || mockWalletAddress,
          timestamp: new Date().toLocaleString(),
          message,
          amount,
          keyword,
          transactionHash: mockTxHash
        };
        
        setZakatTransactions([newZakatTx, ...zakatTransactions]);
      }
      
      // Add the new transaction to the mock transactions
      setTransactions([newTransaction, ...transactions]);
      setTransactionCount(prevCount => Number(prevCount) + 1);
      localStorage.setItem("transactionCount", Number(transactionCount) + 1);
      
      setIsLoading(false);
      
      return {
        success: true,
        hash: mockTxHash
      };
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return {
        success: false,
        error: "Transaction failed"
      };
    }
  };

  const fundLoan = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loan funding
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock transaction hash
      const mockTxHash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Create a new transaction record
      const loanTransaction = {
        id: mockTxHash,
        url: `https://sepolia.etherscan.io/tx/${mockTxHash}`,
        message: "Loan Funding",
        timestamp: new Date().toLocaleString(),
        addressFrom: currentAccount || mockWalletAddress,
        addressTo: "0xB8c4D7cB00d84BB172E219CB6F271D90F96d2C4F",
        amount: "0.5 ETH",
        keyword: "loan"
      };
      
      // Add the new transaction to the mock transactions
      setTransactions([loanTransaction, ...transactions]);
      setTransactionCount(prevCount => Number(prevCount) + 1);
      localStorage.setItem("transactionCount", Number(transactionCount) + 1);
      
      setIsLoading(false);
      
      return {
        success: true,
        hash: mockTxHash
      };
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return {
        success: false,
        error: "Loan funding failed"
      };
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        disconnectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        fundLoan,
        zakatTransactions,
        getZakatTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
