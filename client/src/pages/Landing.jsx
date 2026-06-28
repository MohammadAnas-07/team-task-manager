import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckSquare, Flag, Clock, Activity, RefreshCcw, Shield, 
  ChevronRight, ArrowRight, BrainCircuit, TrendingUp, BarChart3, Target, Sparkles
} from 'lucide-react';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-[#0066CC] selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="/logo.svg" alt="TaskFlow Logo" className="h-8 w-auto" />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-[15px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Features</a>
              <a href="#about" className="text-[15px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">About</a>
              <a href="#pricing" className="text-[15px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-[15px] font-medium text-[#1D1D1F] hover:text-[#0066CC] transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center px-4 py-2 text-[15px] font-medium text-white bg-[#1D1D1F] hover:bg-[#000000] rounded-full transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1D1D1F] text-sm font-medium mb-8 border border-black/5">
              <span className="flex h-2 w-2 rounded-full bg-[#0066CC]"></span>
              TaskFlow is here
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-[72px] font-semibold tracking-tight leading-[1.05] mb-6">
              Organize work. <br className="hidden sm:block" />
              <span className="text-[#6E6E73]">Without the chaos.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-[18px] md:text-[21px] text-[#6E6E73] mb-10 max-w-2xl mx-auto leading-relaxed">
              The minimalist project management tool designed for teams who value clarity, speed, and beautiful design.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-medium text-white bg-[#0066CC] hover:bg-[#005bb5] rounded-full transition-colors">
                Start for free
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors">
                Log in to account
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-28 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFFFFF] z-10 bottom-0 h-1/3" />
          <motion.div 
            animate={{ y: [-5, 5, -5] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative rounded-[24px] md:rounded-[32px] overflow-hidden border border-black/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-white"
          >
            <img src="/dashboard.png" alt="TaskFlow Dashboard Interface" className="w-full h-auto block" />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[14px] font-medium text-[#6E6E73] uppercase tracking-widest mb-8">Trusted by modern teams</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[17px] font-semibold text-[#1D1D1F]">
            <span>Developers</span>
            <span>Designers</span>
            <span>Freelancers</span>
            <span>Startups</span>
            <span>Agencies</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight leading-tight mb-6">Everything you need. <br/> Nothing you don't.</h2>
            <p className="text-[19px] text-[#6E6E73]">Powerful features wrapped in an elegant, distraction-free interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: CheckSquare, title: "Task Management", desc: "Organize, assign, and track tasks with absolute precision." },
              { icon: Flag, title: "Priority Levels", desc: "Know exactly what needs your attention right now." },
              { icon: Clock, title: "Deadlines", desc: "Never miss a due date with intuitive scheduling." },
              { icon: Activity, title: "Progress Tracking", desc: "Visualize your team's velocity and project health." },
              { icon: RefreshCcw, title: "Real-time Updates", desc: "Changes sync instantly across all your devices." },
              { icon: Shield, title: "Secure Authentication", desc: "Enterprise-grade security for your peace of mind." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#FFFFFF] p-8 rounded-[24px] border border-black/[0.04] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#1D1D1F]" />
                </div>
                <h3 className="text-[21px] font-semibold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-[17px] text-[#6E6E73] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Split */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.1] mb-6">Designed for <br/> deep work.</h2>
              <p className="text-[19px] text-[#6E6E73] mb-8 leading-relaxed">
                We stripped away the clutter so you can focus on what actually matters. Fast, reliable, and beautiful by default.
              </p>
              <ul className="space-y-4">
                {['Lightning fast performance', 'Intuitive keyboard shortcuts', 'Minimalist, calm interface', 'Seamless collaboration'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[17px] font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                      <CheckSquare className="w-3.5 h-3.5 text-[#0066CC]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square md:aspect-[4/3] flex items-center justify-center p-8"
              style={{ perspective: '1200px' }}
            >
               <motion.div
                 animate={{ y: [-8, 8, -8] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                 className="relative w-[110%] rounded-[24px] overflow-hidden border border-white/60 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] bg-white/40 backdrop-blur-xl"
                 style={{ transform: 'rotateY(-12deg) rotateX(4deg) translateZ(0)' }}
               >
                 <img src="/dashboard.png" alt="Dashboard Feature Preview" className="w-full h-auto block rounded-[24px]" />
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Productivity Analytics Showcase */}
      <section className="py-24 md:py-32 bg-[#FFFFFF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text & Features */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1D1D1F] text-sm font-medium mb-8 border border-black/5">
                <Sparkles className="w-4 h-4 text-[#0066CC]" />
                AI Powered Analytics
              </div>
              <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight leading-[1.1] mb-6">
                Turn work into <br/> measurable progress.
              </h2>
              <p className="text-[19px] text-[#6E6E73] mb-10 leading-relaxed">
                Track productivity, monitor project health, visualize completion trends, and receive AI-powered recommendations that help your team work smarter every day.
              </p>
              
              <div className="grid gap-6 mb-12">
                {[
                  { icon: Target, title: 'AI Productivity Score', desc: 'Measure overall productivity using intelligent project analysis.' },
                  { icon: Sparkles, title: 'Smart Recommendations', desc: 'Receive actionable AI suggestions based on project activity and task completion.' },
                  { icon: Activity, title: 'Project Health Monitoring', desc: 'Quickly identify bottlenecks, overdue tasks, and project risks.' },
                  { icon: BarChart3, title: 'Beautiful Visual Reports', desc: 'Interactive charts and real-time metrics help you understand progress at a glance.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#F5F5F7] group-hover:bg-[#E8E8ED] transition-colors flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#1D1D1F]" />
                    </div>
                    <div>
                      <h4 className="text-[17px] font-semibold tracking-tight mb-1">{item.title}</h4>
                      <p className="text-[15px] text-[#6E6E73] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Small Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 pt-8 border-t border-[#F5F5F7]">
                {[
                  { val: '99.9%', label: 'System Reliability' },
                  { val: 'Real-Time', label: 'Analytics' },
                  { val: 'AI Powered', label: 'Insights' },
                  { val: '100%', label: 'Private Data' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-[19px] font-semibold tracking-tight text-[#1D1D1F]">{stat.val}</div>
                    <div className="text-[13px] font-medium text-[#6E6E73] mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-medium text-white bg-[#0066CC] hover:bg-[#005bb5] rounded-full transition-colors">
                  Get Started
                </Link>
                <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors">
                  View Dashboard
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Dashboard Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:h-[800px] flex items-center justify-center lg:justify-end"
            >
               <motion.div
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="relative w-full max-w-2xl rounded-[24px] overflow-hidden border border-[#E8E8ED] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] bg-[#F5F5F7]"
               >
                 {/* Browser Header */}
                 <div className="h-12 border-b border-[#E8E8ED] bg-[#FFFFFF] flex items-center px-4 gap-2">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                   </div>
                   <div className="flex-1 flex justify-center">
                     <div className="h-6 w-48 bg-[#F5F5F7] rounded-md"></div>
                   </div>
                 </div>
                 
                 {/* Mock Analytics Content */}
                 <div className="p-6 md:p-8 space-y-6">
                   <div className="flex items-center gap-3 mb-8">
                     <TrendingUp className="w-8 h-8 text-[#0066CC]" />
                     <div>
                       <h3 className="text-[24px] font-semibold tracking-tight leading-none">Analytics</h3>
                       <p className="text-[13px] text-[#6E6E73] mt-1">AI-powered insights</p>
                     </div>
                   </div>

                   {/* Mock AI Glass Panel */}
                   <div className="relative rounded-[20px] bg-white/70 backdrop-blur-md border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                       <BrainCircuit className="w-32 h-32" />
                     </div>
                     <div className="flex flex-col md:flex-row gap-6 relative z-10">
                       <div className="md:w-1/3 md:border-b md:border-b-0 md:border-r border-[#E8E8ED] pb-4 md:pb-0 pr-0 md:pr-4">
                         <p className="text-[13px] font-medium text-[#6E6E73] mb-2">Project Health</p>
                         <div className="flex items-end gap-2">
                           <span className="text-[48px] font-semibold leading-none tracking-tight">92</span>
                           <span className="text-[17px] text-[#A1A1A6] mb-2">/100</span>
                         </div>
                         <div className="w-full h-2 bg-[#F5F5F7] rounded-full mt-4 overflow-hidden">
                           <div className="h-full w-[92%] bg-[#27C93F] rounded-full"></div>
                         </div>
                       </div>
                       <div className="md:w-2/3">
                         <div className="flex items-center gap-2 mb-4">
                           <Sparkles className="w-4 h-4 text-[#0066CC]" />
                           <span className="text-[15px] font-semibold">AI Insights</span>
                         </div>
                         <div className="space-y-3">
                           <div className="h-4 w-full bg-[#F5F5F7] rounded-md"></div>
                           <div className="h-4 w-5/6 bg-[#F5F5F7] rounded-md"></div>
                           <div className="h-4 w-4/6 bg-[#F5F5F7] rounded-md"></div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Mock Stat Cards Grid */}
                   <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Completed Tasks', val: '1,248' },
                       { label: 'Overdue', val: '3' },
                     ].map((stat, i) => (
                       <div key={i} className="bg-white rounded-[16px] p-5 border border-[#E8E8ED] shadow-sm">
                         <p className="text-[13px] font-medium text-[#6E6E73] mb-2">{stat.label}</p>
                         <div className="text-[28px] font-semibold tracking-tight">{stat.val}</div>
                       </div>
                     ))}
                   </div>
                   
                   {/* Mock Chart Area */}
                   <div className="bg-white rounded-[16px] p-5 border border-[#E8E8ED] shadow-sm">
                     <p className="text-[13px] font-medium text-[#6E6E73] mb-4">Completion Trend</p>
                     <div className="flex items-end justify-between h-24 gap-2">
                       {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                         <div key={i} className="w-full bg-[#0066CC] rounded-t-md opacity-20 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                       ))}
                     </div>
                   </div>

                 </div>
               </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-[#1D1D1F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="text-[56px] md:text-[72px] font-semibold tracking-tighter mb-2">10K+</div>
              <div className="text-[17px] text-[#A1A1A6] font-medium tracking-wide uppercase">Tasks Managed</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="text-[56px] md:text-[72px] font-semibold tracking-tighter mb-2">99.9%</div>
              <div className="text-[17px] text-[#A1A1A6] font-medium tracking-wide uppercase">Uptime</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="text-[56px] md:text-[72px] font-semibold tracking-tighter mb-2">24/7</div>
              <div className="text-[17px] text-[#A1A1A6] font-medium tracking-wide uppercase">Availability</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight leading-tight mb-6">Simple, transparent pricing.</h2>
            <p className="text-[19px] text-[#6E6E73]">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-10 rounded-[32px] border border-black/[0.04] shadow-sm flex flex-col"
            >
              <h3 className="text-[24px] font-semibold tracking-tight mb-2">Basic</h3>
              <p className="text-[#6E6E73] mb-6">Perfect for individuals getting started.</p>
              <div className="mb-8">
                <span className="text-[48px] font-semibold tracking-tighter">$0</span>
                <span className="text-[#6E6E73] text-[17px]">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Up to 3 projects', 'Basic task management', '7-day activity history', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[17px]">
                    <CheckSquare className="w-5 h-5 text-[#1D1D1F]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full inline-flex items-center justify-center px-6 py-3.5 text-[17px] font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors">
                Get Started
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1D1D1F] text-white p-10 rounded-[32px] border border-white/10 shadow-lg flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066CC] blur-[80px] opacity-20 rounded-full"></div>
              <h3 className="text-[24px] font-semibold tracking-tight mb-2">Pro</h3>
              <p className="text-[#A1A1A6] mb-6">For teams that need more power and security.</p>
              <div className="mb-8">
                <span className="text-[48px] font-semibold tracking-tighter">$12</span>
                <span className="text-[#A1A1A6] text-[17px]">/user/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Unlimited projects', 'Advanced analytics', 'Unlimited history', 'Priority 24/7 support', 'Custom workflows'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[17px]">
                    <CheckSquare className="w-5 h-5 text-[#0066CC]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full inline-flex items-center justify-center px-6 py-3.5 text-[17px] font-medium text-white bg-[#0066CC] hover:bg-[#005bb5] rounded-full transition-colors">
                Start Free Trial
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F7] to-white -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/60 backdrop-blur-[20px] rounded-[32px] p-12 md:p-20 border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <h2 className="text-4xl md:text-[56px] font-semibold tracking-tight mb-6">Ready to get organized?</h2>
            <p className="text-[19px] text-[#6E6E73] mb-10 max-w-xl mx-auto">
              Join thousands of teams who have already discovered a better way to work.
            </p>
            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 text-[17px] font-medium text-white bg-[#0066CC] hover:bg-[#005bb5] rounded-full transition-all duration-200 gap-2">
              Start Managing Tasks
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F5F5F7] py-12 md:py-16 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <img src="/logo.svg" alt="TaskFlow" className="h-8 w-auto mb-6 opacity-80" />
              <p className="text-[15px] text-[#6E6E73] max-w-xs leading-relaxed">
                A premium task management experience designed to bring clarity and focus to your team's workflow.
              </p>
            </div>
            
            <div>
              <h4 className="text-[13px] font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Features</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Integrations</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[13px] font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">About Us</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Careers</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Blog</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#F5F5F7] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-[#A1A1A6]">
              &copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#A1A1A6] hover:text-[#1D1D1F] transition-colors">Twitter</a>
              <a href="#" className="text-[#A1A1A6] hover:text-[#1D1D1F] transition-colors">GitHub</a>
              <a href="#" className="text-[#A1A1A6] hover:text-[#1D1D1F] transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
