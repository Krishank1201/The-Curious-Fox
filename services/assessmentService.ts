
import { Dimension, AssessmentResult } from '../types';
import { ASSESSMENT_QUESTIONS, LEARNING_PROFILES } from '../constants/assessmentData';

export function calculateStaticScores(answers: Record<string, 'A' | 'B' | 'C'>): Record<Dimension, number> {
  const scores: Record<Dimension, number[]> = {
    processing: [],
    perception: [],
    input: [],
    understanding: []
  };

  for (const q of ASSESSMENT_QUESTIONS) {
    const ans = answers[q.id];
    let val = 0;
    if (ans === 'A') val = 5;
    else if (ans === 'B') val = -5;
    else if (ans === 'C') val = 0;
    scores[q.dimension].push(val);
  }

  return {
    processing: scores.processing.reduce((a, b) => a + b, 0) / 3,
    perception: scores.perception.reduce((a, b) => a + b, 0) / 3,
    input: scores.input.reduce((a, b) => a + b, 0) / 3,
    understanding: scores.understanding.reduce((a, b) => a + b, 0) / 3,
  };
}

export function getProfileFromScores(scores: Record<Dimension, number>): AssessmentResult {
  const code = [
    scores.processing >= 0 ? 'A' : 'R',
    scores.perception >= 0 ? 'S' : 'I',
    scores.input >= 0 ? 'V' : 'B',
    scores.understanding >= 0 ? 'S' : 'G',
  ].join('');

  const profile = LEARNING_PROFILES[code] || {
    label: 'Balanced Learner',
    description: 'You have a versatile approach to learning.',
    recommendations: ['Explore multiple formats', 'Adapt to the specific topic at hand']
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'static',
    scores,
    profileCode: code,
    profileLabel: profile.label,
    profileDescription: profile.description,
    recommendations: profile.recommendations,
    contextInsights: [],
    timestamp: Date.now()
  };
}

export const DR_FOX_PROMPT = `
You are Dr. Fox, an expert learning style assessment specialist.
Conduct a conversational assessment across 4 dimensions:
1. Processing: Active (doing) vs Reflective (thinking)
2. Perception: Sensing (facts) vs Intuitive (patterns)
3. Input: Visual (pictures) vs Verbal (words)
4. Understanding: Sequential (steps) vs Global (big picture)

Goals:
- Natural conversation (8-12 turns).
- Cover all dimensions.
- NOTICE contradictions.
- Stay concise and helpful.

Once you have enough info, end with a JSON block:
{
  "isComplete": true,
  "assessment": {
    "scores": { "processing": 2.5, "perception": -1.8, "input": 3.2, "understanding": 0.5 },
    "profileCode": "ASVS",
    "contextInsights": ["Point 1", "Point 2"]
  }
}

Scores range -5 to +5.
Processing: -5=Reflective, +5=Active
Perception: -5=Intuitive, +5=Sensing
Input: -5=Verbal, +5=Visual
Understanding: -5=Global, +5=Sequential
`;
