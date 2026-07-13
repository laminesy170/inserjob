/* eslint-disable @typescript-eslint/no-explicit-any */
import type { QuestionnaireSchema, ScoringRules } from '@/db/types';

export interface Answer {
  questionId: string;
  rawValue: number;
}

export interface DimensionResult {
  dimensionId: string;
  dimensionLabel: string;
  rawScore: number;
  normalizedScore: number;
  level: string;
  summary: string;
  strengths: string[];
  developmentAreas: string[];
  recommendedActions: string[];
}

export interface ScoringResult {
  overallScore: number;
  dimensions: DimensionResult[];
  timestamp: string;
  version: string;
}

export interface AnswerWithWeight {
  questionId: string;
  value: number;
  weight: number;
  reversed: boolean;
  effectiveValue: number;
}

export class ScoringEngine {
  private questionnaireSchema: QuestionnaireSchema;
  private rules: ScoringRules;

  constructor(questionnaire: QuestionnaireSchema, rules: ScoringRules) {
    this.questionnaireSchema = questionnaire;
    this.rules = rules;
  }

  get questionnaire() {
    return this.questionnaireSchema.questionnaire;
  }

  validateAnswers(answers: Answer[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check all questions are answered
    const answeredQuestionIds = new Set(answers.map((a) => a.questionId));
    const requiredQuestions = this.getAllQuestionIds();

    for (const qId of requiredQuestions) {
      if (!answeredQuestionIds.has(qId)) {
        errors.push(`Question ${qId} missing`);
      }
    }

    // Validate answer values
    for (const answer of answers) {
      if (!this.isValidQuestion(answer.questionId)) {
        errors.push(`Unknown question: ${answer.questionId}`);
      }

      if (
        answer.rawValue < this.questionnaire.scale.min ||
        answer.rawValue > this.questionnaire.scale.max
      ) {
        errors.push(
          `Question ${answer.questionId}: value ${answer.rawValue} out of range`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  score(answers: Answer[]): ScoringResult {
    const validation = this.validateAnswers(answers);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const answerMap = new Map(answers.map((a) => [a.questionId, a.rawValue]));
    const dimensions: DimensionResult[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const dimension of this.questionnaire.dimensions) {
      const dimensionAnswers = this.getAnswersForDimension(
        dimension.id,
        answerMap
      );
      const scored = this.scoreDimension(dimension, dimensionAnswers);

      dimensions.push(scored);
      totalWeightedScore += scored.normalizedScore * dimension.weight;
      totalWeight += dimension.weight;
    }

    const overallScore = Math.round(totalWeightedScore / totalWeight);

    return {
      overallScore,
      dimensions,
      timestamp: new Date().toISOString(),
      version: this.rules.version,
    };
  }

  private getAnswersForDimension(
    dimensionId: string,
    answerMap: Map<string, number>
  ): AnswerWithWeight[] {
    const dimension = this.questionnaire.dimensions.find(
      (d: any) => d.id === dimensionId
    );

    if (!dimension) return [];

    return dimension.questions.map((question: any) => {
      const rawValue = answerMap.get(question.id)!;
      const effectiveValue = question.reverse ? 6 - rawValue : rawValue;

      return {
        questionId: question.id,
        value: rawValue,
        weight: question.weight || 1,
        reversed: question.reverse || false,
        effectiveValue,
      };
    });
  }

  private scoreDimension(
    dimension: any,
    answers: AnswerWithWeight[]
  ): DimensionResult {
    // Calculate raw score
    const rawScore = answers.reduce(
      (sum, a) => sum + a.effectiveValue * a.weight,
      0
    );

    // Calculate min and max theoretical scores
    const minScore = answers.reduce((sum, a) => sum + 1 * a.weight, 0);
    const maxScore = answers.reduce(
      (sum, a) => sum + this.questionnaire.scale.max * a.weight,
      0
    );

    // Normalize to 0-100
    const normalizedScore = Math.round(
      ((rawScore - minScore) / (maxScore - minScore)) * 100
    );

    // Clamp to 0-100
    const clampedScore = Math.max(0, Math.min(100, normalizedScore));

    // Get level
    const level = this.getLevel(clampedScore);

    // Get interpretation
    const interpretation = this.getInterpretation(dimension.id, level);

    return {
      dimensionId: dimension.id,
      dimensionLabel: dimension.label,
      rawScore,
      normalizedScore: clampedScore,
      level,
      summary: interpretation.summary,
      strengths: interpretation.strengths,
      developmentAreas: interpretation.developmentAreas,
      recommendedActions: interpretation.recommendedActions,
    };
  }

  private getLevel(score: number): string {
    if (score <= 39) return 'TO_STRENGTHEN';
    if (score <= 59) return 'IN_DEVELOPMENT';
    if (score <= 79) return 'OPERATIONAL';
    return 'AUTONOMOUS';
  }

  private getInterpretation(
    dimensionId: string,
    level: string
  ): {
    summary: string;
    strengths: string[];
    developmentAreas: string[];
    recommendedActions: string[];
  } {
    const rule = this.rules.interpretations[dimensionId]?.[level];

    return rule || {
      summary: 'Résultat à explorer',
      strengths: [],
      developmentAreas: [],
      recommendedActions: [],
    };
  }

  private isValidQuestion(questionId: string): boolean {
    return this.getAllQuestionIds().has(questionId);
  }

  private getAllQuestionIds(): Set<string> {
    const ids = new Set<string>();
    for (const dimension of this.questionnaire.dimensions) {
      for (const question of dimension.questions) {
        ids.add(question.id);
      }
    }
    return ids;
  }
}
