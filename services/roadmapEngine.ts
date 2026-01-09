
import { AssessmentResult, LabMode, PracticeType } from '../types';

export type ModuleStatus = 'LOCKED' | 'READY' | 'IN_PROGRESS' | 'COMPLETED';

export interface RoadmapModule {
  id: string;
  title: string;
  bloom_level: string;
  learning_focus: string[];
  content_types: string[];
  estimated_time_minutes: number;
  status: ModuleStatus;
  description: string;
  dr_fox_insight: string;
}

export interface Roadmap {
  curation_id: string;
  mentor_message: string;
  roadmap_theme: string;
  modules: RoadmapModule[];
}

// Static Database of Learning Units mapped to Bloom's Levels
const CONTENT_POOL = {
  kmeans: [
    { id: 'km-l1', title: 'The Clustering Instinct', bloom: 'L1', types: ['Explanation', 'Analogy'], time: 5, desc: 'Defining the core intuition of grouping by proximity.' },
    { id: 'km-l2', title: 'Centroid Mechanics', bloom: 'L2', types: ['Diagram', 'Visual Map'], time: 10, desc: 'Understanding how means move and stabilize.' },
    { id: 'km-l3', title: 'The Elbow Strategy', bloom: 'L3', types: ['Activity', 'Graph Analysis'], time: 15, desc: 'Applying WCSS to find the optimal K.' },
    { id: 'km-l4', title: 'Implementation Sandbox', bloom: 'L4', types: ['Code', 'Lab'], time: 20, desc: 'Building a robust K-Means pipeline from scratch.' },
  ],
  pca: [
    { id: 'pca-l1', title: 'Dimensions & Shadows', bloom: 'L1', types: ['Explanation', 'Analogy'], time: 5, desc: 'The concept of projected variance.' },
    { id: 'pca-l2', title: 'Eigen-Intuition', bloom: 'L2', types: ['Visual', 'Text'], time: 12, desc: 'Decoding Eigenvalues and Eigenvectors without the heavy math.' },
    { id: 'pca-l3', title: 'Variance Retention', bloom: 'L3', types: ['Activity', 'Scree Plot'], time: 15, desc: 'Calculating how much data we can afford to lose.' },
    { id: 'pca-l4', title: 'Feature Extraction Lab', bloom: 'L4', types: ['Code', 'Interactive'], time: 25, desc: 'Reducing 50 features to 3 principal components.' },
  ],
  apriori: [
    { id: 'ap-l1', title: 'Market Basket Logic', bloom: 'L1', types: ['Case Study', 'Explanation'], time: 8, desc: 'Introduction to co-occurrence patterns.' },
    { id: 'ap-l2', title: 'The Support/Confidence Core', bloom: 'L2', types: ['Formula Breakdown', 'Sensing'], time: 10, desc: 'Quantifying the strength of an association.' },
    { id: 'ap-l3', title: 'Pruning & Itemsets', bloom: 'L3', types: ['Logic Puzzle', 'Sequential'], time: 15, desc: 'Using the Downward Closure property to save compute.' },
    { id: 'ap-l4', title: 'Recommendation Engine', bloom: 'L4', types: ['Code', 'Project'], time: 30, desc: 'Deploying a rule mining system on real retail data.' },
  ]
};

const FOX_QUOTES = [
  "You're building strong intuition here. The path ahead is clear.",
  "Every lantern lit is a neural pathway strengthened.",
  "Don't just code it, feel the pattern in the data.",
  "Curiosity is your greatest asset in this forest.",
  "You're closer to mastery than you think."
];

export const generateRoadmap = (
  topicId: 'kmeans' | 'pca' | 'apriori' | 'all',
  profile: AssessmentResult
): Roadmap => {
  const code = profile.profileCode;
  const isSequential = code.includes('S');
  const isVisual = code.includes('V');
  const isReflective = code.includes('R');

  let selectedUnits: any[] = [];
  if (topicId === 'all') {
    selectedUnits = [...CONTENT_POOL.kmeans, ...CONTENT_POOL.pca, ...CONTENT_POOL.apriori];
  } else {
    selectedUnits = [...CONTENT_POOL[topicId]];
  }

  // Sort based on Sequential vs Global
  if (isSequential) {
    selectedUnits.sort((a, b) => a.bloom.localeCompare(b.bloom));
  } else {
    // Global learners get L4/Big Picture units earlier or scattered
    selectedUnits.sort(() => Math.random() - 0.5);
  }

  const modules: RoadmapModule[] = selectedUnits.map((unit, idx) => {
    // Adapt content types based on profile
    const adaptedTypes = [...unit.types];
    if (isVisual && !adaptedTypes.includes('Visual')) adaptedTypes.push('Visual Simulation');
    if (!isReflective && !adaptedTypes.includes('Lab')) adaptedTypes.push('Quick Lab');

    return {
      id: unit.id,
      title: unit.title,
      bloom_level: unit.bloom,
      learning_focus: [isVisual ? 'Visual' : 'Verbal', isReflective ? 'Reflective' : 'Active'],
      content_types: adaptedTypes,
      estimated_time_minutes: unit.time,
      status: idx === 0 ? 'READY' : 'LOCKED',
      description: unit.desc,
      dr_fox_insight: FOX_QUOTES[Math.floor(Math.random() * FOX_QUOTES.length)]
    };
  });

  return {
    curation_id: `CUR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    mentor_message: `Welcome back! I've architected a journey specifically for your ${profile.profileLabel} profile. Let's head toward the Den of Knowledge.`,
    roadmap_theme: "Fox Journey to the Den",
    modules
  };
};

export const updateRoadmapProgress = (roadmap: Roadmap, completedId: string): Roadmap => {
  const newModules = roadmap.modules.map((m, idx) => {
    if (m.id === completedId) return { ...m, status: 'COMPLETED' as const };
    
    // Unlock the next module if it was locked
    const prevModule = roadmap.modules[idx - 1];
    if (prevModule && prevModule.id === completedId && m.status === 'LOCKED') {
      return { ...m, status: 'READY' as const };
    }
    return m;
  });

  return { ...roadmap, modules: newModules };
};
