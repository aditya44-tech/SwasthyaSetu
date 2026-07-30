'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  align: 'left' | 'right';
  delay: number;
}

export default function FeatureCard({ icon: Icon, title, description, align, delay }: FeatureCardProps) {
  const isLeft = align === 'left';
  const x = isLeft ? -50 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.5 }}
      className={`flex items-start gap-4 ${isLeft ? 'md:text-right' : ''} ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-[#E5E5EA] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#0071E3]" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">{title}</h3>
        <p className="text-[#1D1D1F]/60 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}