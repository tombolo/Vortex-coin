'use client';
import { useState, useEffect } from 'react';
import { Task, TaskQuestion } from '@/data/tasks';
import { FaClock, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

interface TaskWorkerProps {
  task: Task;
  onComplete: (answers: Record<string, string>, timeSpent: number) => void;
  onCancel: () => void;
}

export default function TaskWorker({ task, onComplete, onCancel }: TaskWorkerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(task.timeLimit);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const currentQuestion = task.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / task.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === task.questions.length - 1;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Warning when time is low
  useEffect(() => {
    if (timeRemaining <= 60 && timeRemaining > 0) {
      setShowWarning(true);
    }
  }, [timeRemaining]);

  const handleTimeout = () => {
    alert('Time is up! Task will be submitted with current answers.');
    onComplete(answers, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (!answer || answer === '') return false;
    
    // Check minimum length for text answers
    if (currentQuestion.type === 'text' && currentQuestion.minLength) {
      return answer.length >= currentQuestion.minLength;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      alert('Please answer the current question before proceeding.');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unanswered = task.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    onComplete(answers, timeSpent);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header with Timer */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl border-2 border-blue-700 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-extrabold mb-1">{task.title}</h2>
              <p className="text-blue-100 text-sm">{task.category} • {task.difficulty}</p>
            </div>
            
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${
              timeRemaining <= 60 
                ? 'bg-red-500/30 border-red-300 animate-pulse' 
                : 'bg-white/20 border-white/30'
            }`}>
              <FaClock className={`text-2xl ${timeRemaining <= 60 ? 'text-red-200' : 'text-white'}`} />
              <div>
                <p className="text-xs text-blue-100">Time Remaining</p>
                <p className={`text-2xl font-extrabold ${timeRemaining <= 60 ? 'text-red-100' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">Question {currentQuestionIndex + 1} of {task.questions.length}</span>
              <span className="text-sm text-blue-100 font-bold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-green-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {showWarning && timeRemaining <= 60 && (
            <div className="flex items-center gap-2 bg-red-500/20 border-2 border-red-300 rounded-xl px-4 py-2">
              <FaExclamationTriangle className="text-red-200" />
              <p className="text-sm font-bold text-red-100">Less than 1 minute remaining!</p>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-slate-200 mb-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-full text-sm font-bold">
              Question {currentQuestionIndex + 1}
            </span>
            {currentQuestion.type === 'multiple-choice' && currentQuestion.correctAnswer && (
              <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border-2 border-amber-300">
                Quality Check
              </span>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-relaxed whitespace-pre-line">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Image for image classification */}
        {currentQuestion.type === 'image-classification' && currentQuestion.imageUrl && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
            <Image 
              src={currentQuestion.imageUrl} 
              alt="Task Image" 
              width={400} 
              height={300} 
              className="mx-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.type === 'text' ? (
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your detailed answer here..."
                className="w-full p-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 min-h-[140px] font-medium"
                required
              />
              {currentQuestion.minLength && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Minimum {currentQuestion.minLength} characters required
                  </p>
                  <p className={`text-xs font-bold ${
                    (answers[currentQuestion.id] || '').length >= currentQuestion.minLength 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`}>
                    {(answers[currentQuestion.id] || '').length} / {currentQuestion.minLength}
                  </p>
                </div>
              )}
            </div>
          ) : (
            currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-xl text-left font-semibold transition-all duration-300 border-2 ${
                  answers[currentQuestion.id] === option
                    ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white border-blue-700 shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === option
                      ? 'border-white bg-white'
                      : 'border-slate-400'
                  }`}>
                    {answers[currentQuestion.id] === option && (
                      <FaCheckCircle className="text-blue-900 text-sm" />
                    )}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all duration-300 border-2 border-slate-300"
        >
          Cancel Task
        </button>

        <div className="flex items-center gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
            >
              <FaArrowLeft />
              Previous
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-900 to-cyan-700 hover:from-blue-950 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed border-2 border-slate-400'
            }`}
          >
            <span>{isLastQuestion ? 'Submit Task' : 'Next Question'}</span>
            {!isLastQuestion && <FaArrowRight />}
          </button>
        </div>
      </div>

      {/* Requirements Reminder */}
      <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
        <p className="text-sm font-bold text-amber-900 mb-2">⚠️ Important Reminders:</p>
        <ul className="text-xs text-amber-800 space-y-1">
          <li>• Answer all questions honestly and carefully</li>
          <li>• Quality threshold: {task.qualityThreshold}% accuracy required</li>
          <li>• Incomplete or low-quality submissions may not be paid</li>
        </ul>
      </div>
    </div>
  );
}

