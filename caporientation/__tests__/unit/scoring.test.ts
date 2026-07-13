import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '@/lib/scoring/engine';
import { scoringRulesV1 } from '@/lib/scoring/rules';
import type { QuestionnaireSchema } from '@/db/types';

const mockQuestionnaire: QuestionnaireSchema = {
  schemaVersion: '1.0.0',
  questionnaire: {
    id: 'test-questionnaire',
    version: '1.0.0',
    status: 'published',
    title: 'Test Questionnaire',
    description: 'For testing',
    language: 'fr',
    estimatedDurationMinutes: 10,
    scale: {
      min: 1,
      max: 5,
      labels: {
        '1': 'Pas du tout vrai',
        '2': 'Plutôt faux',
        '3': 'Partiellement vrai',
        '4': 'Plutôt vrai',
        '5': 'Tout à fait vrai',
      },
    },
    dimensions: [
      {
        id: 'self_awareness',
        label: 'Connaissance de soi',
        weight: 1,
        description: 'Test dimension',
        questions: [
          { id: 'Q1', text: 'Question 1', reverse: false, weight: 1 },
          { id: 'Q2', text: 'Question 2', reverse: true, weight: 1 },
        ],
      },
    ],
  },
};

describe('ScoringEngine', () => {
  it('should validate all questions are answered', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    const validation = engine.validateAnswers([
      { questionId: 'Q1', rawValue: 3 },
    ]);

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  it('should reject out of range values', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    const validation = engine.validateAnswers([
      { questionId: 'Q1', rawValue: 6 },
      { questionId: 'Q2', rawValue: 3 },
    ]);

    expect(validation.valid).toBe(false);
  });

  it('should handle reversed questions correctly', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    // For reversed question: value 1 becomes 5, value 5 becomes 1
    // Q1 (normal): answer 5 -> effective 5
    // Q2 (reversed): answer 1 -> effective 5
    // Raw score = (5 * 1) + (5 * 1) = 10
    // Min = (1 * 1) + (1 * 1) = 2
    // Max = (5 * 1) + (5 * 1) = 10
    // Normalized = ((10 - 2) / (10 - 2)) * 100 = 100

    const result = engine.score([
      { questionId: 'Q1', rawValue: 5 },
      { questionId: 'Q2', rawValue: 1 },
    ]);

    expect(result.dimensions[0].normalizedScore).toBe(100);
  });

  it('should calculate correct level for different scores', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    // Test minimum score (should be 0, level TO_STRENGTHEN)
    const minResult = engine.score([
      { questionId: 'Q1', rawValue: 1 },
      { questionId: 'Q2', rawValue: 5 }, // reversed: becomes 1
    ]);

    expect(minResult.dimensions[0].normalizedScore).toBe(0);
    expect(minResult.dimensions[0].level).toBe('TO_STRENGTHEN');

    // Test middle score (should be 50, level IN_DEVELOPMENT)
    const midResult = engine.score([
      { questionId: 'Q1', rawValue: 3 },
      { questionId: 'Q2', rawValue: 3 },
    ]);

    expect(midResult.dimensions[0].normalizedScore).toBe(50);
    expect(midResult.dimensions[0].level).toBe('IN_DEVELOPMENT');
  });

  it('should clamp score between 0 and 100', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    const result = engine.score([
      { questionId: 'Q1', rawValue: 5 },
      { questionId: 'Q2', rawValue: 5 }, // reversed: becomes 1
    ]);

    expect(result.dimensions[0].normalizedScore).toBeGreaterThanOrEqual(0);
    expect(result.dimensions[0].normalizedScore).toBeLessThanOrEqual(100);
  });

  it('should throw error on invalid answers', () => {
    const engine = new ScoringEngine(
      mockQuestionnaire,
      scoringRulesV1
    );

    expect(() => {
      engine.score([{ questionId: 'Q1', rawValue: 1 }]);
    }).toThrow();
  });
});
