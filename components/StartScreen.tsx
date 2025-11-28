
import React, { useState, useMemo } from 'react';
import { QuizSettings, QuizMode } from '../types';
import { SubjectWithTopics } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';

interface StartScreenProps {
  subjectsWithTopics: SubjectWithTopics[];
  onStartQuiz: (settings: QuizSettings) => void;
  onViewHistory: () => void;
  error: string | null;
}

const StartScreen: React.FC<StartScreenProps> = ({ subjectsWithTopics, onStartQuiz, onViewHistory, error }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5);
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    setSelectedTopics([]); // Reset topics when subject changes
  };
  
  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };
  
  const currentTopics = useMemo(() => {
    return subjectsWithTopics.find(s => s.subject === selectedSubject)?.topics || [];
  }, [selectedSubject, subjectsWithTopics]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject && selectedTopics.length > 0) {
      onStartQuiz({ subject: selectedSubject, topics: selectedTopics, numberOfQuestions, quizMode });
    }
  };

  return (
    <Card>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">OAB Quiz AI</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Prepare-se para o exame da Ordem com questões geradas por IA.</p>
      </div>
      
      {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="subject-select" className="block text-md font-medium text-gray-700 dark:text-gray-200">
            1. Selecione a Matéria
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="" disabled>Escolha uma matéria</option>
            {subjectsWithTopics.map(item => (
              <option key={item.subject} value={item.subject}>{item.subject}</option>
            ))}
          </select>
        </div>

        {selectedSubject && (
          <div>
            <label className="block text-md font-medium text-gray-700 dark:text-gray-200">
              2. Selecione os Temas
            </label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-2 rounded-md border border-gray-300 dark:border-gray-600">
              {currentTopics.map(topic => (
                <div key={topic} className="flex items-center">
                  <input
                    id={topic}
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => handleTopicToggle(topic)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={topic} className="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                    {topic}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="num-questions" className="block text-md font-medium text-gray-700 dark:text-gray-200">
            Número de Questões: <span className="font-bold text-indigo-600 dark:text-indigo-400">{numberOfQuestions}</span>
          </label>
          <input
            id="num-questions"
            type="range"
            min="1"
            max="20"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>

        <div>
          <label className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
            Modo de Quiz
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => setQuizMode('practice')}
              className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${quizMode === 'practice' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}
              role="radio"
              aria-checked={quizMode === 'practice'}
              tabIndex={0}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Prática</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Feedback instantâneo após cada questão.</p>
            </div>
            <div
              onClick={() => setQuizMode('simulation')}
              className={`cursor-pointer rounded-lg border p-4 text-center transition-all ${quizMode === 'simulation' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}
              role="radio"
              aria-checked={quizMode === 'simulation'}
              tabIndex={0}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Simulado</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Com tempo e resultado apenas no final.</p>
            </div>
          </div>
        </div>
        
        <Button type="submit" disabled={selectedTopics.length === 0}>
          Iniciar Quiz
        </Button>
        <button 
          type="button" 
          onClick={onViewHistory}
          className="w-full mt-4 px-6 py-2 text-md font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          Ver Histórico de Progresso
        </button>
      </form>
    </Card>
  );
};

export default StartScreen;
