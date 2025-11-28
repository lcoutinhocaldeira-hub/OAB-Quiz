import React, { useState, useEffect } from 'react';
import { Question, QuizMode } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: number;
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  quizMode: QuizMode;
  timeLeft: number | null;
}

const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const QuizScreen: React.FC<QuizScreenProps> = ({ question, questionNumber, totalQuestions, userAnswer, onAnswer, onNext, quizMode, timeLeft }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeOnQuestion, setTimeOnQuestion] = useState(0);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeOnQuestion(0);
  }, [question]);

  useEffect(() => {
    if (quizMode !== 'simulation' || timeLeft === null || timeLeft <= 0) {
      return;
    }
    const timerId = setInterval(() => {
      setTimeOnQuestion(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [quizMode, question, timeLeft]);

  const handleSelectAnswer = (index: number) => {
    if (quizMode === 'practice') {
        if (isAnswered) return;
        setSelectedAnswer(index);
    } else {
        onAnswer(index);
    }
  };

  const handleSubmitPractice = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setIsAnswered(true);
    }
  };
  
  const getOptionClass = (index: number) => {
    if (quizMode === 'simulation') {
      return userAnswer === index 
        ? 'ring-2 ring-indigo-500 bg-indigo-100 dark:bg-indigo-900' 
        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
    }

    if (!isAnswered) {
      return selectedAnswer === index 
        ? 'ring-2 ring-indigo-500 bg-indigo-100 dark:bg-indigo-900' 
        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
    }
    if (index === question.correctAnswerIndex) {
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 ring-2 ring-green-500';
    }
    if (index === selectedAnswer) {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 ring-2 ring-red-500';
    }
    return 'bg-white dark:bg-gray-700 opacity-70';
  };

  return (
    <Card className="max-w-4xl w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Questão {questionNumber}</h2>
            {quizMode === 'simulation' && (
              <div className="flex space-x-1" title={`Tempo na questão: ${timeOnQuestion}s`}>
                <div className={`w-4 h-2 rounded-full transition-colors duration-300 ${timeOnQuestion >= 1 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className={`w-4 h-2 rounded-full transition-colors duration-300 ${timeOnQuestion > 60 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className={`w-4 h-2 rounded-full transition-colors duration-300 ${timeOnQuestion > 120 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              </div>
            )}
          </div>
          {quizMode === 'simulation' && timeLeft !== null && (
            <div className={`text-lg font-mono font-semibold px-3 py-1 rounded-md ${timeLeft <= 60 ? 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900/50' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{questionNumber} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}></div>
        </div>
      </div>

      <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 mb-6">{question.question}</p>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            disabled={quizMode === 'practice' && isAnswered}
            className={`w-full text-left p-4 rounded-lg border dark:border-gray-600 transition-all duration-200 ${getOptionClass(index)}`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
      
      {quizMode === 'practice' && isAnswered && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-bold text-gray-800 dark:text-white mb-2">Explicação:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{question.explanation}</p>
        </div>
      )}

      <div className="mt-8 text-right">
        {quizMode === 'practice' ? (
          isAnswered ? (
            <Button onClick={onNext}>
              {questionNumber === totalQuestions ? 'Finalizar Quiz' : 'Próxima Questão'}
            </Button>
          ) : (
            <Button onClick={handleSubmitPractice} disabled={selectedAnswer === null}>
              Confirmar Resposta
            </Button>
          )
        ) : (
          <Button onClick={onNext} disabled={userAnswer === -1}>
            {questionNumber === totalQuestions ? 'Finalizar Quiz' : 'Próxima Questão'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuizScreen;