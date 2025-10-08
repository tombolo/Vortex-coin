'use client';
import { useState, useEffect } from 'react';
import { OutlierTask, Project } from '@/data/projects';
import { FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface OutlierTaskWorkerProps {
  task: OutlierTask;
  project: Project;
  onComplete: (answers: Record<string, any>, timeSpent: number) => void;
  onCancel: () => void;
  taskNumber: number;
  totalTasksCompleted: number;
}

export default function OutlierTaskWorker({ task, project, onComplete, onCancel, taskNumber, totalTasksCompleted }: OutlierTaskWorkerProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (stepId: string, value: string, responseId?: string) => {
    if (responseId) {
      setAnswers(prev => ({
        ...prev,
        [stepId]: {
          ...prev[stepId],
          [responseId]: value
        }
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [stepId]: value
      }));
    }
  };

  const canSubmit = () => {
    // Check if all required steps are completed
    return task.evaluationSteps.every(step => {
      if (step.type === 'rating') {
        return answers[step.id]?.A && answers[step.id]?.B;
      } else if (step.type === 'text') {
        return answers[step.id] && answers[step.id].length >= 50;
      } else {
        return answers[step.id];
      }
    });
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      alert('Please complete all evaluation criteria before submitting.');
      return;
    }
    onComplete(answers, timeSpent);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-lg text-xs font-bold">
                Task {taskNumber}
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
                Total: {totalTasksCompleted}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold border border-purple-300">
                {task.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
            <p className="text-xs text-slate-600 font-medium">{project.client}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-600">Time</p>
              <p className="text-2xl font-bold text-blue-900">{formatTime(timeSpent)}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300">
              <FaClock className="text-2xl text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 mb-5">
        <h3 className="font-bold text-amber-900 mb-2 text-sm">📋 Instructions:</h3>
        <ol className="space-y-1 text-xs text-amber-900">
          <li className="flex gap-2"><span className="font-bold">1.</span><span>Read the prompt and both responses carefully</span></li>
          <li className="flex gap-2"><span className="font-bold">2.</span><span>Rate each response on multiple criteria</span></li>
          <li className="flex gap-2"><span className="font-bold">3.</span><span>Select your overall preference</span></li>
          <li className="flex gap-2"><span className="font-bold">4.</span><span>Provide detailed written explanation</span></li>
        </ol>
      </div>

      {/* Prompt */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-200 mb-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-900 text-white rounded text-xs">User Prompt</span>
        </h3>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
          <p className="text-sm text-slate-900 leading-relaxed font-medium">{task.prompt}</p>
        </div>
      </div>

      {/* Responses Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Response A */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Response A</h3>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-800 leading-relaxed">{task.responseA.response}</p>
          </div>
        </div>

        {/* Response B */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Response B</h3>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
            <p className="text-xs text-slate-800 leading-relaxed">{task.responseB.response}</p>
          </div>
        </div>
      </div>

      {/* Evaluation Steps */}
      <div className="space-y-3 mb-4">
        {task.evaluationSteps.map((step, index) => (
          <div key={step.id} className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              {index + 1}. {step.question}
            </h4>

            {step.type === 'rating' && (
              <div className="grid grid-cols-1 gap-3">
                {/* Rating for Response A */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Response A:</p>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {step.options?.map((option) => (
                      <button
                        key={`A-${option}`}
                        onClick={() => handleAnswer(step.id, option, 'A')}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          answers[step.id]?.A === option
                            ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white shadow-md scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-100 border border-slate-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating for Response B */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">Response B:</p>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {step.options?.map((option) => (
                      <button
                        key={`B-${option}`}
                        onClick={() => handleAnswer(step.id, option, 'B')}
                        className={`p-1.5 sm:p-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                          answers[step.id]?.B === option
                            ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white shadow-md scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-100 border border-slate-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step.type === 'yes-no' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {step.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(step.id, option)}
                    className={`p-2.5 rounded-lg text-xs font-bold transition-all duration-300 border-2 ${
                      answers[step.id] === option
                        ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white border-blue-700 shadow-md scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 gap-2">
                {step.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(step.id, option)}
                    className={`p-3 rounded-xl text-left text-sm font-semibold transition-all duration-300 border-2 ${
                      answers[step.id] === option
                        ? 'bg-gradient-to-r from-blue-900 to-cyan-700 text-white border-blue-700 shadow-lg'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[step.id] === option ? 'border-white bg-white' : 'border-slate-400'
                      }`}>
                        {answers[step.id] === option && <FaCheckCircle className="text-blue-900 text-xs" />}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step.type === 'text' && (
              <div>
                <textarea
                  value={answers[step.id] || ''}
                  onChange={(e) => handleAnswer(step.id, e.target.value)}
                  placeholder="Provide detailed reasoning comparing both responses. Mention specific strengths, weaknesses, accuracy issues, clarity differences, etc."
                  className="w-full p-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 min-h-[120px] text-sm font-medium text-slate-900 leading-relaxed"
                  required
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500 font-medium">Minimum 50 characters required</p>
                  <p className={`text-xs font-bold ${
                    (answers[step.id] || '').length >= 50 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {(answers[step.id] || '').length} / 50
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all duration-300 border-2 border-slate-300"
        >
          Cancel & Exit
        </button>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={`px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
            canSubmit()
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-emerald-500'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed border-2 border-slate-400'
          }`}
        >
          <FaCheckCircle />
          Submit Task (+${project.payPerTask.toFixed(2)})
        </button>
      </div>

      {/* Requirements */}
      <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <FaExclamationTriangle className="text-purple-700 text-sm mt-0.5" />
          <div>
            <p className="text-xs font-bold text-purple-900 mb-1">Quality Standards:</p>
            <ul className="text-[10px] text-purple-800 space-y-0.5">
              <li>• Rate all criteria for both responses</li>
              <li>• Provide honest, unbiased evaluations</li>
              <li>• Written explanation must be detailed (50+ chars)</li>
              <li>• Threshold: {project.qualityThreshold}% accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}