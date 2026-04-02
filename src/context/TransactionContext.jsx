import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchTransactions = async (filterParams = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/transactions', { params: { ...filters, ...filterParams } });
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchSummary = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/transactions/summary');
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTransaction = async (transaction) => {
    const { data } = await api.post('/transactions', transaction);
    setTransactions([data, ...transactions]);
    fetchSummary();
    return data;
  };

  const updateTransaction = async (id, updates) => {
    const { data } = await api.put(`/transactions/${id}`, updates);
    setTransactions(transactions.map((t) => (t._id === id ? data : t)));
    fetchSummary();
    return data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(transactions.filter((t) => t._id !== id));
    fetchSummary();
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchSummary();
    }
  }, [user]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        filters,
        setFilters,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
