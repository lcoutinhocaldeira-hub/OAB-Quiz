
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Question } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: number[];
  onRestart: () => void;
  subject: string;
  topics: string[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart, subject, topics }) => {
  const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswerIndex).length;
  const incorrectAnswers = questions.length - correctAnswers;
  const score = (correctAnswers / questions.length) * 100;

  const data = [
    { name: 'Corretas', value: correctAnswers },
    { name: 'Incorretas', value: incorrectAnswers },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const getOptionClass = (question: Question, answerIndex: number, userAnswerIndex: number) => {
    const isCorrect = answerIndex === question.correctAnswerIndex;
    const isUserChoice = answerIndex === userAnswerIndex;

    if (isCorrect) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/50';
    }
    if (isUserChoice && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-900/50';
    }
    return 'border-gray-300 dark:border-gray-600';
  };

  return (
    <Card className="max-w-4xl w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Resultado do Quiz</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Você acertou <span className="font-bold text-green-500">{correctAnswers}</span> de <span className="font-bold">{questions.length}</span> questões.
        </p>
      </div>

      <div className="my-4 text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p className="text-md font-semibold text-gray-700 dark:text-gray-200">{subject}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {topics.map(topic => (
            <span key={topic} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full dark:bg-indigo-900 dark:text-indigo-300">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full h-64 my-8">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">Revisão das Questões</h3>
        {questions.map((q, index) => (
          <div key={index} className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{index + 1}. {q.question}</p>
            <div className="space-y-2 text-sm">
                {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className={`p-2 border-l-4 rounded ${getOptionClass(q, optIndex, userAnswers[index])}`}>
                        {opt}
                    </div>
                ))}
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Explicação:</span> {q.explanation}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={onRestart}>Tentar Novamente</Button>
      </div>
    </Card>
  );
};

export default ResultsScreen;
