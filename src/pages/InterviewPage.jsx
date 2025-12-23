import React, { useState } from 'react';
import { interviewQuestions } from '../data/topics';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPage = () => {
  const [openId, setOpenId] = useState(null);

  // Calculate progress or just show list
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Top {interviewQuestions.length} Interview Questions</h1>
        <p>Master these concepts to crack your JS interview.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {interviewQuestions.map((q) => {
          const isOpen = openId === q.id;
          return (
            <motion.div 
              key={q.id} 
              style={{ marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: isOpen ? 'var(--bg-hover)' : 'var(--bg-tertiary)', transition: 'background 0.2s' }}
              initial={false}
            >
              <button 
                onClick={() => setOpenId(isOpen ? null : q.id)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '1.25rem', 
                  background: 'none', 
                  border: 'none', 
                  color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: isOpen ? 600 : 500,
                  fontSize: '1.1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{q.id.toString().padStart(2, '0')}</span>
                  {q.question}
                </div>
                {isOpen ? <ChevronUp size={20} color="var(--accent)" /> : <ChevronDown size={20} />}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 1.5rem 1.5rem 3.5rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                      {q.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InterviewPage;
