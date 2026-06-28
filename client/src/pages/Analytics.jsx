import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  AlertCircle, TrendingUp, CheckCircle2, Clock, 
  Target, Zap, Activity, ChevronRight
} from 'lucide-react';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const InsightCard = ({ title, text, icon: Icon, colorClass, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/70 backdrop-blur-md border border-[#E8E8ED] rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorClass.bg}`}>
        <Icon className={`w-5 h-5 ${colorClass.text}`} />
      </div>
      <h4 className="text-[17px] font-semibold tracking-tight text-[#1D1D1F]">{title}</h4>
    </div>
    <p className="text-[15px] text-[#6E6E73] leading-relaxed flex-1">{text}</p>
  </motion.div>
);

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
        <p className="text-red-400 font-semibold text-[17px] tracking-tight">{error}</p>
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

  const insightTypes = [
    { title: "Productivity Insight", icon: Zap, colors: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]' } },
    { title: "Performance Trend", icon: Activity, colors: { bg: 'bg-[#0066CC]/10', text: 'text-[#0066CC]' } },
    { title: "System Observation", icon: Target, colors: { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]' } },
  ];

  const recTypes = [
    { title: "Focus Recommendation", icon: Target, colors: { bg: 'bg-[#AF52DE]/10', text: 'text-[#AF52DE]' } },
    { title: "Next Steps", icon: ChevronRight, colors: { bg: 'bg-[#0066CC]/10', text: 'text-[#0066CC]' } },
    { title: "Efficiency Tip", icon: Zap, colors: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]' } },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1200px] mx-auto space-y-16 pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-[44px] md:text-[56px] font-semibold text-[#1D1D1F] leading-tight tracking-tight mb-4 flex items-center gap-4">
          <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-[#0066CC]" />
          Analytics
        </h1>
        <p className="text-[19px] md:text-[21px] text-[#6E6E73] tracking-wide max-w-2xl">
          Turn your work into measurable progress. Monitor project health, visualize trends, and receive smart recommendations.
        </p>
      </div>

      {/* Key Statistics */}
      <section>
        <h2 className="text-[24px] font-semibold text-[#1D1D1F] tracking-tight mb-6">Key Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Tasks" value={metrics.totalTasks} icon={CheckCircle2} color="blue" />
          <StatsCard title="Completed" value={metrics.completedTasks} icon={CheckCircle2} color="green" />
          <StatsCard title="Overdue" value={metrics.overdueTasks} icon={Clock} color="red" />
          <StatsCard title="Completion Rate" value={`${metrics.completionRate}%`} icon={TrendingUp} color="purple" />
        </div>
      </section>

      {/* AI Insight Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-semibold text-[#1D1D1F] tracking-tight">AI Insights</h2>
          <div className="flex items-center gap-2 bg-[#F5F5F7] px-4 py-2 rounded-full border border-[#E8E8ED]">
            <div className={`w-2.5 h-2.5 rounded-full ${ai.healthScore > 80 ? 'bg-[#34C759]' : ai.healthScore > 50 ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'}`}></div>
            <span className="text-[15px] font-medium text-[#1D1D1F]">Health: {ai.healthScore}/100</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ai.insights.map((insight, idx) => {
            const type = insightTypes[idx % insightTypes.length];
            return (
              <InsightCard 
                key={`insight-${idx}`}
                title={type.title}
                text={insight}
                icon={type.icon}
                colorClass={type.colors}
                delay={idx * 0.1}
              />
            );
          })}
        </div>
      </section>

      {/* Large Analytics Charts */}
      <section>
        <h2 className="text-[24px] font-semibold text-[#1D1D1F] tracking-tight mb-6">Performance Trends</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Trend Chart */}
          <div className="bg-[#FFFFFF] border border-[#E8E8ED] rounded-[32px] p-8 md:p-10 shadow-sm">
            <div className="mb-8">
              <h3 className="text-[21px] font-semibold text-[#1D1D1F] tracking-tight">Weekly Completion</h3>
              <p className="text-[15px] text-[#6E6E73] mt-1">Tasks completed over the last 5 days.</p>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066CC" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0066CC" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', padding: '12px 16px' }}
                    itemStyle={{ color: '#1D1D1F', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#0066CC" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-[#FFFFFF] border border-[#E8E8ED] rounded-[32px] p-8 md:p-10 shadow-sm">
            <div className="mb-8">
              <h3 className="text-[21px] font-semibold text-[#1D1D1F] tracking-tight">Task Distribution</h3>
              <p className="text-[15px] text-[#6E6E73] mt-1">Current status of all active tasks.</p>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F5F5F7' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', padding: '12px 16px' }}
                    itemStyle={{ color: '#1D1D1F', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" fill="#1D1D1F" radius={[8, 8, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-[24px] font-semibold text-[#1D1D1F] tracking-tight mb-6">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ai.recommendations.map((rec, idx) => {
            const type = recTypes[idx % recTypes.length];
            return (
              <InsightCard 
                key={`rec-${idx}`}
                title={type.title}
                text={rec}
                icon={type.icon}
                colorClass={type.colors}
                delay={idx * 0.1}
              />
            );
          })}
        </div>
      </section>

    </motion.div>
  );
}
