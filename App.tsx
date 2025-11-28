
import React, { useState, useCallback, useEffect } from 'react';
import { QuizSettings, Question, AppState, QuizMode, QuizResult } from './types';
import { generateQuizQuestions } from './services/geminiService';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import Loader from './components/ui/Loader';
import { OAB_SUBJECTS_WITH_TOPICS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('oabQuizHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (appState !== 'active' || quizSettings?.quizMode !== 'simulation' || timeLeft === null) {
      return;
    }

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(t => (t !== null ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [appState, quizSettings, timeLeft]);

  const handleStartQuiz = useCallback(async (settings: QuizSettings) => {
    setAppState('loading');
    setError(null);
    setQuizSettings(settings);
    try {
      const generatedQuestions = await generateQuizQuestions(settings.subject, settings.topics, settings.numberOfQuestions);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(-1));
      setCurrentQuestionIndex(0);
      if (settings.quizMode === 'simulation') {
        setTimeLeft(generatedQuestions.length * 180); // 3 minutes per question
      } else {
        setTimeLeft(null);
      }
      setAppState('active');
    } catch (err) {
      console.error(err);
      setError('Falha ao gerar o quiz. Por favor, verifique sua conexão ou tente novamente mais tarde.');
      setAppState('setup');
    }
  }, []);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleFinishQuiz = () => {
    if (!quizSettings) return;

    const correctAnswers = userAnswers.filter((answer, index) => answer !== -1 && answer === questions[index].correctAnswerIndex).length;
    const newResult: QuizResult = {
      id: new Date().toISOString(),
      date: new Date().toLocaleString('pt-BR'),
      score: (correctAnswers / questions.length) * 100,
      correctAnswers,
      totalQuestions: questions.length,
      subject: quizSettings.subject,
      topics: quizSettings.topics,
    };

    const updatedHistory = [...history, newResult];
    setHistory(updatedHistory);
    localStorage.setItem('oabQuizHistory', JSON.stringify(updatedHistory));
    
    setAppState('finished');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };
  
  const handleRestart = () => {
    setAppState('setup');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setError(null);
    setQuizSettings(null);
    setTimeLeft(null);
  };
  
  const handleViewHistory = () => setAppState('history');
  const handleBackToSetup = () => setAppState('setup');
  
  const handleClearHistory = () => {
    if (window.confirm("Você tem certeza que deseja apagar todo o seu histórico? Essa ação não pode ser desfeita.")) {
      setHistory([]);
      localStorage.removeItem('oabQuizHistory');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'setup':
        return <StartScreen subjectsWithTopics={OAB_SUBJECTS_WITH_TOPICS} onStartQuiz={handleStartQuiz} onViewHistory={handleViewHistory} error={error} />;
      case 'history':
        return <HistoryScreen history={history} onBack={handleBackToSetup} onClear={handleClearHistory} />;
      case 'loading':
        return <div className="flex flex-col items-center justify-center h-screen">
                 <Loader />
                 <p className="text-xl mt-4 text-gray-600 dark:text-gray-300">Gerando seu quiz personalizado...</p>
               </div>;
      case 'active':
        return <QuizScreen
                 question={questions[currentQuestionIndex]}
                 questionNumber={currentQuestionIndex + 1}
                 totalQuestions={questions.length}
                 userAnswer={userAnswers[currentQuestionIndex]}
                 onAnswer={handleAnswer}
                 onNext={handleNextQuestion}
                 quizMode={quizSettings?.quizMode || 'practice'}
                 timeLeft={timeLeft}
               />;
      case 'finished':
        return <ResultsScreen
                 questions={questions}
                 userAnswers={userAnswers}
                 onRestart={handleRestart}
                 subject={quizSettings?.subject || ''}
                 topics={quizSettings?.topics || []}
               />;
      default:
        return <div>Estado inválido</div>;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      {renderContent()}
    </main>
  );
};

export default App;
