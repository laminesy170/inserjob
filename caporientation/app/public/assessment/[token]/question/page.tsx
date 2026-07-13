'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Question {
  id: string;
  dimension: string;
  text: string;
  scale: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
}

interface Questionnaire {
  questionnaire: {
    dimensions: Array<{
      id: string;
      title: string;
      questions: Question[];
    }>;
  };
}

export default function QuestionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = params.token as string;
  const sessionId = searchParams.get('session') as string;

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const allQuestions = questionnaire?.questionnaire.dimensions.flatMap((d) => d.questions) || [];
  const currentQuestion = allQuestions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / allQuestions.length) * 100);

  // Auto-save on answer change
  useEffect(() => {
    if (!currentQuestion || answers[currentQuestion.id] === undefined) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await fetch(`/api/public/assessment/${token}/answers`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionId: currentQuestion.id,
            rawValue: answers[currentQuestion.id],
          }),
        });
      } catch (err) {
        console.error('Failed to save answer:', err);
      } finally {
        setSaving(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [currentQuestion, answers, token, sessionId]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/public/assessment/${token}/questionnaire`);
        if (!res.ok) throw new Error('Failed to load questionnaire');
        const data = await res.json();
        setQuestionnaire(data.questionnaire);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/public/assessment/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) throw new Error('Failed to submit assessment');
      const data = await res.json();
      router.push(`/public/results/${data.resultId || sessionId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !questionnaire || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error || 'Error'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLastQuestion = currentIndex === allQuestions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentIndex + 1} / {allQuestions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-4">
              <span className="text-sm font-semibold text-primary-600">
                {questionnaire.questionnaire.dimensions.find((d) =>
                  d.questions.some((q) => q.id === currentQuestion.id)
                )?.title}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{currentQuestion.text}</h2>
          </CardHeader>

          <CardContent className="space-y-8">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {/* Scale */}
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{currentQuestion.scale.minLabel}</span>
                <span>{currentQuestion.scale.maxLabel}</span>
              </div>

              <div className="flex gap-2">
                {Array.from({ length: currentQuestion.scale.max - currentQuestion.scale.min + 1 }).map((_, i) => {
                  const value = currentQuestion.scale.min + i;
                  const isSelected = answers[currentQuestion.id] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={`flex-1 py-3 rounded font-semibold transition ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>

              {saving && <p className="text-sm text-gray-500 text-center">Sauvegarde...</p>}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1"
                variant="secondary"
              >
                Précédente
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isAnswered || saving}
                  className="flex-1"
                >
                  {saving ? 'Envoi...' : 'Terminer'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="flex-1"
                >
                  Suivante
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
