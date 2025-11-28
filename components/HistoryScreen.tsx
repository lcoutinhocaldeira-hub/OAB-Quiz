
import React from 'react';
import { QuizResult } from '../types';
import Card from './ui/Card';

interface HistoryScreenProps {
  history: QuizResult[];
  onBack: () => void;
  onClear: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack, onClear }) => {
  return (
    <Card className="max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-600">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Histórico de Progresso</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          &larr; Voltar
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Você ainda não completou nenhum quiz. Seu progresso aparecerá aqui.
        </p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {history.slice().reverse().map((result) => (
            <div key={result.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{result.date}</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100 mt-1">{result.subject}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.topics.map(topic => (
                    <span key={topic} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full dark:bg-gray-600 dark:text-gray-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className={`text-2xl font-bold ${result.score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                  {result.score.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result.correctAnswers} / {result.totalQuestions} corretas
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
         <div className="mt-6 text-center">
            <button
                onClick={onClear}
                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
                Limpar Histórico
            </button>
         </div>
      )}
    </Card>
  );
};

export default HistoryScreen;
