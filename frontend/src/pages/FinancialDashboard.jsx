import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Loader2,
  Calendar,
  Briefcase
} from 'lucide-react';
import { financialAPI } from '../services/api';

const FinancialDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalWriterFees: 0,
    totalReferrals: 0,
    netProfit: 0
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await financialAPI.getRecords();
      if (response.data.success) {
        const data = response.data.data;
        setRecords(data);
        
        // Aggregate data
        const revenue = data
          .filter(r => r.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0);
        
        const expenses = data
          .filter(r => r.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0);

        const writerFees = data
          .filter(r => r.category === 'writer-payment')
          .reduce((acc, curr) => acc + curr.amount, 0);

        const referrals = data
          .filter(r => r.category === 'referral-payment')
          .reduce((acc, curr) => acc + curr.amount, 0);
        
        setSummary({
          totalRevenue: revenue,
          totalExpenses: expenses,
          totalWriterFees: writerFees,
          totalReferrals: referrals,
          netProfit: revenue - expenses
        });
      }
    } catch (err) {
      console.error('Error fetching financial records:', err);
      setError('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-cream-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₦${summary.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
      trend: '+12%', // Mock trend
      trendColor: 'text-green-600'
    },
    {
      title: 'Writer Fees',
      value: `₦${(summary.totalWriterFees || 0).toLocaleString()}`,
      icon: Briefcase,
      color: 'text-primary-800',
      bgColor: 'bg-cream-200',
      trend: '+5%', // Mock trend
      trendColor: 'text-red-600'
    },
    {
      title: 'Referral Fees',
      value: `₦${(summary.totalReferrals || 0).toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-primary-900',
      bgColor: 'bg-cream-300',
      trend: '+2%', // Mock trend
      trendColor: 'text-orange-600'
    },
    {
      title: 'Net Profit',
      value: `₦${summary.netProfit.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary-950',
      bgColor: 'bg-cream-400',
      trend: '+18%', // Mock trend
      trendColor: 'text-green-600'
    }
  ];

  return (
    <div className="p-6 bg-cream-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Financial Dashboard</h1>
          <p className="text-primary-700 mt-2">Overview of revenue, expenses, and profitability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2 bg-white border-cream-200">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="btn flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card border-cream-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-bold ${stat.trendColor} flex items-center gap-1`}>
                  {stat.trendColor === 'text-green-600' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-primary-500">{stat.title}</p>
                <p className="text-3xl font-bold text-primary-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-100 flex items-center justify-between bg-cream-50/50">
          <h3 className="text-lg font-bold text-primary-900">Recent Transactions</h3>
          <button className="text-primary-700 hover:text-primary-900 text-sm font-bold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream-50 border-b border-cream-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${record.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-primary-50 text-primary-700'}`}>
                          {record.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-primary-900">{record.description}</p>
                          <p className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">{record.category.replace('-', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-primary-700 font-medium">
                        <Briefcase className="h-4 w-4 text-primary-400" />
                        {record.project?.title || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary-600 flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4" />
                        {new Date(record.transactionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-primary-700'}`}>
                        {record.type === 'income' ? '+' : '-'}₦{record.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-cream-100 text-primary-800'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-primary-500 font-medium">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
