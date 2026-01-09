
import { Question, Dimension } from '../types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'proc_1',
    dimension: 'processing',
    text: 'When learning something new, do you prefer to:',
    options: {
      A: 'Jump in and experiment, learn by doing and trial-and-error',
      B: 'Reflect first, read docs, and think through it carefully before trying',
      C: 'Use a mix of both approaches depending on the topic'
    }
  },
  {
    id: 'proc_2',
    dimension: 'processing',
    text: 'In group discussions, you tend to:',
    options: {
      A: 'Talk through ideas to organize your thoughts and learn from others',
      B: 'Listen carefully, then think about it before sharing your viewpoint',
      C: 'Adapt based on the group dynamics'
    }
  },
  {
    id: 'proc_3',
    dimension: 'processing',
    text: 'If stuck on a coding problem, you would:',
    options: {
      A: 'Start coding different solutions quickly to see what works',
      B: 'Analyze the problem deeply, review examples, and plan carefully',
      C: 'Do a mix of analysis and quick prototyping'
    }
  },
  {
    id: 'perc_1',
    dimension: 'perception',
    text: 'Which appeals to you more when learning concepts:',
    options: {
      A: 'Concrete examples, real-world applications, and actual facts',
      B: 'Abstract theories, patterns, and relationships between concepts',
      C: 'A balance of both practical examples and theory'
    }
  },
  {
    id: 'perc_2',
    dimension: 'perception',
    text: 'You are more comfortable with:',
    options: {
      A: 'Following a proven, established method step-by-step',
      B: 'Exploring novel approaches and seeing how far you can push ideas',
      C: 'Depends on whether the problem is familiar or new'
    }
  },
  {
    id: 'perc_3',
    dimension: 'perception',
    text: 'When reading technical documentation, you prefer:',
    options: {
      A: 'Specific scenarios, sample inputs/outputs, worked examples',
      B: 'General principles, conceptual overviews, underlying logic',
      C: 'Both sections work equally well for you'
    }
  },
  {
    id: 'input_1',
    dimension: 'input',
    text: 'To understand a complex algorithm, you prefer:',
    options: {
      A: 'Flowcharts, diagrams, visualizations, or animated walkthroughs',
      B: 'Written explanation, pseudocode, or verbal instruction',
      C: 'Either format works for you'
    }
  },
  {
    id: 'input_2',
    dimension: 'input',
    text: 'In a lecture or tutorial, you find it most useful to have:',
    options: {
      A: 'Slides with lots of visuals, color-coded examples, illustrations',
      B: 'Well-structured notes and detailed verbal explanations',
      C: 'A mix of both visual and textual elements'
    }
  },
  {
    id: 'input_3',
    dimension: 'input',
    text: 'When solving a problem on paper, you tend to:',
    options: {
      A: 'Draw sketches, diagrams, or visual representations',
      B: 'Write out your reasoning step-by-step in words',
      C: 'Use both drawings and written notes'
    }
  },
  {
    id: 'under_1',
    dimension: 'understanding',
    text: 'When tackling a new project, you prefer to:',
    options: {
      A: 'Build piece by piece in order, each step building on the last',
      B: 'Understand the big picture first, then fill in details',
      C: 'Mix: outline the structure but iterate on details'
    }
  },
  {
    id: 'under_2',
    dimension: 'understanding',
    text: 'In a textbook or course, you prefer chapters that:',
    options: {
      A: 'Progress logically, with each chapter a prerequisite for the next',
      B: 'Can be read in any order; each provides a standalone overview',
      C: 'Have clear prerequisites but also offer big-picture summaries'
    }
  },
  {
    id: 'under_3',
    dimension: 'understanding',
    text: 'You learn best when you know:',
    options: {
      A: 'Exactly what you need to learn and in what sequence',
      B: 'The end goal and how all parts connect',
      C: 'Some goals and some flexibility in the path'
    }
  }
];

export interface ProfileDef {
  label: string;
  description: string;
  recommendations: string[];
}

export const LEARNING_PROFILES: Record<string, ProfileDef> = {
  'ASVS': {
    label: 'Hands-On Structured Learner',
    description: 'You learn best through concrete examples, step-by-step guidance, and hands-on projects.',
    recommendations: [
      'Use guided coding projects with clear milestones',
      'Create visual flowcharts for each step of algorithms',
      'Work through concrete examples before generalizing to theory',
      'Build incrementally: start simple, add complexity step-by-step'
    ]
  },
  'ASVG': {
    label: 'Big-Picture Active Learner',
    description: 'You like hands-on experimentation but need to understand how everything connects globally.',
    recommendations: [
      'Start with a conceptual overview showing connections',
      'Use mind maps to visualize relationships between parts',
      'Experiment with projects that explore interconnected concepts',
      'Use simulations showing system-wide behavior'
    ]
  },
  'AIVS': {
    label: 'Visual Discovery Student',
    description: 'You thrive on finding patterns through visual experimentation and structured tasks.',
    recommendations: [
      'Use diagrams to map out theoretical patterns',
      'Explore novel connections through visual prototyping',
      'Study theoretical foundations methodically via visual aids',
      'Work on projects that reveal hidden data relationships'
    ]
  },
  'AIVG': {
    label: 'Theory-Driven Holistic Learner',
    description: 'You excel at seeing global patterns and systemic connections through visual maps.',
    recommendations: [
      'Study the broader landscape of concepts first',
      'Use systems thinking diagrams to map concept relationships',
      'Experiment with novel extensions of core ideas',
      'Work on cross-domain projects revealing universal patterns'
    ]
  },
  'RSVS': {
    label: 'Methodical Pragmatist',
    description: 'You prefer thorough analysis of concrete facts presented sequentially before acting.',
    recommendations: [
      'Study concrete code samples with detailed comments',
      'Use structured tutorials that build understanding logically',
      'Review and analyze code carefully before implementing',
      'Use interactive debuggers to trace execution flow'
    ]
  },
  'RSVG': {
    label: 'Reflective Holistic Pragmatist',
    description: 'You need time to understand concrete details and how they fit into the bigger picture.',
    recommendations: [
      'Start with context and big-picture overviews',
      'Study system architecture and component interactions',
      'Create mental models of concept relationships',
      'Review real-world implementations for context'
    ]
  },
  'RIVS': {
    label: 'Theoretical Analyst',
    description: 'You excel at understanding abstract patterns and theories presented sequentially.',
    recommendations: [
      'Study theoretical frameworks in depth systematically',
      'Use formal definitions and mathematical proofs',
      'Create concept maps showing theory generalization',
      'Understand "why" things work before applying them'
    ]
  },
  'RIVG': {
    label: 'Conceptual Philosopher',
    description: 'You seek deep understanding of how abstract concepts interconnect across domains.',
    recommendations: [
      'Study theoretical relationships and global principles',
      'Explore how abstract principles apply across domains',
      'Read resources examining universal patterns',
      'Take time for deep reflection on global interconnections'
    ]
  },
  // Default fallbacks for remaining permutations
  'ASBS': { label: 'Structured Verbal Learner', description: 'You prefer step-by-step text instructions.', recommendations: ['Detailed text docs', 'Sequential logs'] },
  'ASBG': { label: 'Holistic Verbal Learner', description: 'You like reading about the big picture.', recommendations: ['Full whitepapers', 'System overviews'] },
  'AIBS': { label: 'Pattern-Based Text Learner', description: 'You find patterns in written theory.', recommendations: ['Technical journals', 'Textbook sequences'] },
  'AIBG': { label: 'Systemic Verbal Thinker', description: 'You connect verbal concepts globally.', recommendations: ['Cross-domain articles', 'Holistic debate'] },
  'RSBS': { label: 'Reflective Sequential Text Learner', description: 'You analyze text steps deeply.', recommendations: ['Case studies', 'Long-form tutorials'] },
  'RSBG': { label: 'Reflective Global Text Learner', description: 'You analyze systems through reading.', recommendations: ['Abstract summaries', 'Holistic reviews'] },
  'RIBS': { label: 'Analytical Theory Reader', description: 'You analyze theory sequentially.', recommendations: ['Proof reading', 'Logical papers'] },
  'RIBG': { label: 'Holistic Theory Analyst', description: 'You analyze global theory deeply.', recommendations: ['Universal frameworks', 'Reflective systems reading'] },
};
