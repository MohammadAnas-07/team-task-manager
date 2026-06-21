import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { BrainCircuit, AlertCircle, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics/insights');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-400 font-semibold text-[17px] tracking-[-0.374px]">{error}</p>
      </div>
    );
  }

  const { metrics, ai } = data;

  // Mocking weekly trend data as the backend doesn't explicitly return time-series for now
  const weeklyTrend = [
    { name: 'Mon', completed: Math.round(metrics.completedTasks * 0.1) },
    { name: 'Tue', completed: Math.round(metrics.completedTasks * 0.15) },
    { name: 'Wed', completed: Math.round(metrics.completedTasks * 0.25) },
    { name: 'Thu', completed: Math.round(metrics.completedTasks * 0.2) },
    { name: 'Fri', completed: Math.round(metrics.completedTasks * 0.3) },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1068px] mx-auto space-y-8 pb-12"
    >
      <div className="mb-8 mt-4">
        <h1 className="text-[40px] font-semibold text-theme-text leading-tight tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-theme-primary" />
          Productivity Analytics
        </h1>
        <p className="text-[21px] text-theme-text-secondary mt-2 tracking-[0.231px]">
          AI-powered insights and project health metrics.
        </p>
      </div>

      {/* AI Insights Section */}
      <div className="bg-theme-primary text-white rounded-[24px] p-8 shadow-product relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/20 pb-6 lg:pb-0 pr-0 lg:pr-6">
            <h3 className="text-[17px] font-medium text-white/80 mb-2">Project Health Score</h3>
            <div className="flex items-end gap-3">
              <span className="text-[64px] font-semibold leading-none">{ai.healthScore}</span>
              <span className="text-[24px] text-white/60 mb-2">/100</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(0, Math.min(100, ai.healthScore))}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-[17px] font-medium text-white/80 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              AI Insights
            </h3>
            <ul className="space-y-3">
              {ai.insights.map((insight, idx) => (
                <li key={idx} className="text-[16px] leading-relaxed flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Tasks"
          value={metrics.totalTasks}
          icon={CheckCircle2}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={metrics.completedTasks}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          title="Overdue"
          value={metrics.overdueTasks}
          icon={Clock}
          color="red"
        />
        <StatsCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 pt-4">
        {/* Recommendations */}
        <div className="bg-white border border-theme-border rounded-[24px] p-8 shadow-sm">
          <h3 className="text-[21px] font-semibold text-theme-text tracking-[-0.374px] mb-6">AI Recommendations</h3>
          <div className="space-y-4">
            {ai.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-theme-secondary rounded-[14px]">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold">{idx + 1}</span>
                </div>
                <p className="text-[15px] text-theme-text pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white border border-theme-border rounded-[24px] p-8 shadow-sm">
          <h3 className="text-[21px] font-semibold text-theme-text tracking-[-0.374px] mb-6">Task Status Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#111111" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Sparkles = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);
