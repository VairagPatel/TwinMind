import { motion } from 'framer-motion';
import { Suggestion } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick: () => void;
  isSelected?: boolean;
}

const typeColors: Record<string, string> = {
  'Question to Ask': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'Talking Point': 'bg-green-500/20 text-green-400 border-green-500/50',
  'Fact Check': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'Clarification': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  'Answer': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
};

const SuggestionCard = ({ suggestion, onClick, isSelected }: SuggestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-dark-bg rounded-lg p-4 cursor-pointer transition-all border ${
        isSelected
          ? 'border-accent-primary shadow-lg shadow-accent-primary/20'
          : 'border-dark-border hover:border-dark-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${typeColors[suggestion.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'}`}>
          {suggestion.type}
        </span>
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      <h3 className="font-semibold mb-2 line-clamp-1">{suggestion.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{suggestion.preview}</p>
      
      <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
        <span>→</span>
        <span>Click to expand</span>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
