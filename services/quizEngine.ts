
import { AdaptiveQuiz, AdaptiveQuizQuestion, BloomLevel, AssessmentResult, QuizAttempt } from '../types';

// Static Pool of Adaptive Questions
const QUESTION_POOL: Record<string, AdaptiveQuizQuestion[]> = {
  kmeans: [
    { id: 'km-1', bloom_level: 'L1', learning_style_tags: ['Verbal', 'Sequential'], question_text: 'What is the primary function of "centroids" in K-Means?', options: ['To measure noise', 'To represent the center of a cluster', 'To reduce dimensions', 'To predict future labels'], correct_answer: 'To represent the center of a cluster', explanation: 'Centroids are the mean position of all points assigned to a specific group.' },
    { id: 'km-2', bloom_level: 'L2', learning_style_tags: ['Visual', 'Sensing'], question_text: 'How does the "Elbow Method" signify an optimal K?', options: ['When inertia increases sharply', 'When the curve becomes linear after a sharp drop', 'When the number of clusters equals the sample size', 'When all points belong to one cluster'], correct_answer: 'When the curve becomes linear after a sharp drop', explanation: 'The "elbow" represents the point where adding more clusters no longer significantly improves the compactness of the groups.' },
    { id: 'km-3', bloom_level: 'L3', learning_style_tags: ['Active', 'Sensing'], question_text: 'You have a dataset of customer spending. After 10 iterations, the centroids stop moving. What has happened?', options: ['The algorithm crashed', 'It has reached convergence', 'It is overfitting', 'The learning rate is too low'], correct_answer: 'It has reached convergence', explanation: 'Convergence in K-Means is reached when point assignments and centroids stabilize.' },
    { id: 'km-4', bloom_level: 'L4', learning_style_tags: ['Reflective', 'Global'], question_text: 'Why might K-Means fail to find natural clusters in a "crescent moon" shaped dataset?', options: ['Because K is too small', 'Because it assumes spherical cluster shapes', 'Because the data is too large', 'Because it only works on integers'], correct_answer: 'Because it assumes spherical cluster shapes', explanation: 'K-Means uses Euclidean distance, which inherently favors circular/spherical groupings around a mean.' }
  ],
  pca: [
    { id: 'pca-1', bloom_level: 'L1', learning_style_tags: ['Verbal'], question_text: 'In PCA, what do "Principal Components" represent?', options: ['The original data features', 'The direction of maximum variance', 'The number of rows', 'Data outliers'], correct_answer: 'The direction of maximum variance', explanation: 'PCs are new, orthogonal axes that capture the most spread in the data.' },
    { id: 'pca-2', bloom_level: 'L2', learning_style_tags: ['Visual', 'Intuitive'], question_text: 'Why is it critical to center data (mean=0) before running PCA?', options: ['To save memory', 'To ensure the first component passes through the data centroid', 'To remove all negative numbers', 'To normalize labels'], correct_answer: 'To ensure the first component passes through the data centroid', explanation: 'Without centering, the covariance matrix calculation would be biased by the distance from the origin.' }
  ],
  apriori: [
    { id: 'ap-1', bloom_level: 'L1', learning_style_tags: ['Sequential'], question_text: 'What does "Support" measure in association rules?', options: ['The probability of a rule being true', 'The frequency of an itemset in the database', 'The strength of an association', 'The number of unique items'], correct_answer: 'The frequency of an itemset in the database', explanation: 'Support is simply (transactions with itemset) / (total transactions).' },
    { id: 'ap-2', bloom_level: 'L3', learning_style_tags: ['Active', 'Sensing'], question_text: 'If {Bread, Milk} is infrequent, what does the Apriori Principle say about {Bread, Milk, Butter}?', options: ['It must be frequent', 'It must be infrequent', 'It has 50% support', 'It is a strong rule'], correct_answer: 'It must be infrequent', explanation: 'Downward Closure: No superset of an infrequent itemset can be frequent.' }
  ]
};

export const generateAdaptiveQuiz = (
  topicId: string,
  profile: AssessmentResult,
  targetBloom: BloomLevel = 'L2'
): AdaptiveQuiz => {
  const pool = QUESTION_POOL[topicId] || QUESTION_POOL.kmeans;
  
  // Filter by Bloom Level (allow +/- 1 level)
  const bloomWeights = { 'L1': 1, 'L2': 2, 'L3': 3, 'L4': 4, 'L5': 5, 'L6': 6 };
  const targetWeight = bloomWeights[targetBloom];
  
  let selected = pool.filter(q => {
    const qWeight = bloomWeights[q.bloom_level];
    return Math.abs(qWeight - targetWeight) <= 1;
  });

  // If we don't have enough, just take from the whole pool
  if (selected.length < 3) selected = [...pool];

  // Preference for Learning Style tags
  const code = profile.profileCode; // e.g. "ASVS"
  const preferences = [
    code.includes('A') ? 'Active' : 'Reflective',
    code.includes('S') ? 'Sensing' : 'Intuitive',
    code.includes('V') ? 'Visual' : 'Verbal',
    code.includes('S') ? 'Sequential' : 'Global'
  ];

  selected.sort((a, b) => {
    const aMatch = a.learning_style_tags.filter(t => preferences.includes(t)).length;
    const bMatch = b.learning_style_tags.filter(t => preferences.includes(t)).length;
    return bMatch - aMatch;
  });

  return {
    quiz_id: `ADAP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    topic: topicId.toUpperCase(),
    target_bloom: targetBloom,
    questions: selected.slice(0, 5),
    dr_fox_intro: `Greetings! I've curated this ${targetBloom} assessment for your ${profile.profileLabel} profile. Let's see how your neural links are forming.`
  };
};

export const getDrFoxFeedback = (score: number, total: number): string => {
  const pct = (score / total) * 100;
  if (pct >= 90) return "Exceptional mastery! Your intuition for these patterns is becoming formidable.";
  if (pct >= 70) return "Solid understanding. A few concepts need a second pass, but you're on the right track.";
  if (pct >= 50) return "You've grasped the basics, but the complex logic still eludes you. Let's revisit the lab!";
  return "It seems we hit a few roadblocks. Don't worry—failures are just data points for learning.";
};
