import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Perfect for small teams getting started.',
    features: [
      'Up to 3 projects',
      'Basic task management',
      'Community support',
      '7-day activity history'
    ],
    buttonText: 'Current Plan',
    buttonClass: 'bg-theme-secondary text-theme-text font-medium',
    popular: false
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '$12',
    period: '/user/month',
    description: 'Advanced features for growing teams.',
    features: [
      'Unlimited projects',
      'AI Meeting Assistant',
      'Advanced Team Analytics',
      'Unlimited activity history',
      'Priority email support'
    ],
    buttonText: 'Upgrade to Pro',
    buttonClass: 'bg-[#111111] text-white hover:bg-black font-medium shadow-md',
    popular: true
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: '',
    description: 'Custom solutions for large organizations.',
    features: [
      'SSO & Advanced Security',
      'Custom integrations',
      'Dedicated success manager',
      'Custom AI models',
      '24/7 phone support'
    ],
    buttonText: 'Contact Sales',
    buttonClass: 'bg-white border border-theme-border hover:bg-theme-secondary text-theme-text font-medium',
    popular: false
  }
];

export default function Subscription() {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'

  const handleUpgrade = (planName) => {
    toast(`Upgrading to ${planName} is coming soon!`, { icon: '🚀' });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-[40px] font-bold text-theme-text tracking-tight mb-4 leading-tight">
          Pricing that scales with you
        </h1>
        <p className="text-[18px] text-theme-text-secondary">
          Choose the right plan for your team. Upgrade anytime as you grow.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-[14px] ${billing === 'monthly' ? 'text-theme-text font-medium' : 'text-theme-text-secondary'}`}>Monthly</span>
          <button 
            onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 bg-theme-secondary rounded-full relative border border-theme-border focus:outline-none"
          >
            <motion.div 
              className="w-4 h-4 bg-theme-text rounded-full absolute top-[3px]"
              animate={{ left: billing === 'yearly' ? '26px' : '4px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-[14px] ${billing === 'yearly' ? 'text-theme-text font-medium' : 'text-theme-text-secondary'}`}>
            Yearly <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 font-medium">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-white rounded-[24px] p-8 border ${
              plan.popular ? 'border-theme-primary shadow-2xl scale-[1.02]' : 'border-theme-border shadow-product'
            } flex flex-col`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-theme-primary text-white px-4 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase">
                Most Popular
              </div>
            )}
            
            <div className="w-12 h-12 bg-theme-secondary rounded-[14px] flex items-center justify-center mb-6">
              <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-theme-primary' : 'text-theme-text'}`} />
            </div>

            <h3 className="text-[20px] font-semibold text-theme-text mb-2">{plan.name}</h3>
            <p className="text-[14px] text-theme-text-secondary mb-6 min-h-[40px]">{plan.description}</p>

            <div className="mb-8">
              <span className="text-[40px] font-bold text-theme-text tracking-tight">
                {billing === 'yearly' && plan.price !== 'Custom' && plan.price !== '$0' ? `$${(parseInt(plan.price.slice(1)) * 0.8).toFixed(2)}` : plan.price}
              </span>
              <span className="text-[14px] text-theme-text-secondary font-medium ml-1">{plan.period}</span>
            </div>

            <button 
              onClick={() => handleUpgrade(plan.name)}
              className={`w-full py-3 rounded-[12px] transition-transform active:scale-[0.98] mb-8 ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>

            <div className="space-y-4 flex-1">
              {plan.features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-theme-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-theme-text" />
                  </div>
                  <span className="text-[14px] text-theme-text">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
