
import { Subject } from './types';

export const COLORS = {
  primary: '#FF7E06',
  secondary: '#FFB100',
  white: '#FFFFFF',
  black: '#000000',
};

export const MASCOT_IMAGE = "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=1000";

export const SUBJECTS: Subject[] = [
  {
    id: 'daa',
    name: 'Design & Analysis of Algorithms',
    credits: 4,
    icon: 'Binary',
    modules: [
      { id: 'daa-m1', name: 'Module 1: Introduction to Algorithms', order: 1 },
      { id: 'daa-m2', name: 'Module 2: Sorting and Searching', order: 2 },
      { id: 'daa-m3', name: 'Module 3: Dynamic Programming', order: 3 },
      { id: 'daa-m4', name: 'Module 4: Greedy Algorithms', order: 4 },
      { id: 'daa-m5', name: 'Module 5: NP-Hard Problems', order: 5 },
    ]
  },
  {
    id: 'aiml',
    name: 'Artificial Intelligence & Machine Learning',
    credits: 3,
    icon: 'Cpu',
    modules: [
      { id: 'aiml-m1', name: 'Module 1: Introduction to AIML', order: 1 },
      { id: 'aiml-m2', name: 'Module 2: Supervised Learning: Regression Models', order: 2 },
      { id: 'aiml-m3', name: 'Module 3: Supervised Learning: Classification Models', order: 3 },
      { id: 'aiml-m4', name: 'Module 4: Unsupervised Learning', order: 4, topics: [] },
      { id: 'aiml-m5', name: 'Module 5: Deep Learning', order: 5 },
    ]
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    credits: 3,
    icon: 'Network',
    modules: []
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    credits: 3,
    icon: 'Radio',
    modules: []
  },
  {
    id: 'calc',
    name: 'Calculus',
    credits: 2,
    icon: 'Calculator',
    modules: []
  }
];

export const AIML_MODULE_4_TOPICS = [
  {
    id: 'kmeans',
    name: 'K-Means Algorithm',
    overview: 'K-Means is a popular unsupervised learning algorithm used for clustering. It partitions data points into K clusters based on their proximity to the cluster centroids.',
    materials: [
      { id: 'km-guide', title: 'K-Means Complete Guide.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1QCiwly3jNltKzbFK4EGK8CgORZmhAAFl/view?usp=drive_link' },
      { id: 'km-qbank', title: 'K-Means Question Bank.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1wvUpoB3o7WlCWj-YoOBZMBk3pK1Cm1XR/view?usp=drive_link' },
      { id: 'km-coding', title: 'K-Means Coding Handout.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1M925syxnblhavYWCt0hI2hrVInrzwCE4/view?usp=drive_link' }
    ],
    videoUrl: 'https://www.youtube.com/embed/4b5d3muPQmA',
    labVideoUrl: 'https://www.youtube.com/embed/EItlUEPCIzM',
    videos: [
      { id: 'km-b1', level: 'Beginner', title: 'K-Means Clustering Explained', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA', duration: '8:30' },
      { id: 'km-b2', level: 'Beginner', title: 'Machine Learning Tutorial: K-Means', url: 'https://www.youtube.com/watch?v=YEwt6BJROug', duration: '24:33' },
      { id: 'km-b3', level: 'Beginner', title: 'K-Means Clustering Algorithm Basics', url: 'https://www.youtube.com/watch?v=5FpsGnkbEpM', duration: '7:50' },
      { id: 'km-b4', level: 'Beginner', title: 'Intuitive K-Means Guide', url: 'https://www.youtube.com/watch?v=_aWzGGNrcic', duration: '7:35' },
      { id: 'km-i1', level: 'Intermediate', title: 'Selecting K: The Elbow Method', url: 'https://www.youtube.com/watch?v=hBHoEbZohI0', duration: '14:58' },
      { id: 'km-i2', level: 'Intermediate', title: 'Implementation of K-Means', url: 'https://www.youtube.com/watch?v=iNlZ3IU5Ffw', duration: '19:20' },
      { id: 'km-i3', level: 'Intermediate', title: 'K-Means Python Walkthrough', url: 'https://www.youtube.com/watch?v=EItlUEPCIzM', duration: '~20 min' },
      { id: 'km-i4', level: 'Intermediate', title: 'Advanced Clustering Logic', url: 'https://www.youtube.com/watch?v=lX-3nGHDhQg', duration: '~25 min' },
      { id: 'km-e1', level: 'Expert', title: 'Convergence Proofs in Clustering', url: 'https://www.youtube.com/watch?v=6UF5Ysk_2gk', duration: '~20 min' },
      { id: 'km-e2', level: 'Expert', title: 'Optimization & K-Means++', url: 'https://www.youtube.com/watch?v=5w5iUbTlpMQ', duration: '~25 min' },
      { id: 'km-e3', level: 'Expert', title: 'K-Means Mastery Playlist', url: 'https://www.youtube.com/playlist?list=PLKnIA16_RmvbA_hYXlRgdCg9bn8ZQK2z9', duration: 'Playlist' },
      { id: 'km-e4', level: 'Expert', title: 'Mathematical Foundations of K-Means', url: 'https://www.youtube.com/watch?v=xur7VHA2rn8', duration: '~15 min' }
    ],
    quiz: [],
    questionBank: {
      mcqs: [
        {
          id: 'km_mcq_1',
          question: 'What is the primary objective of K-Means clustering?',
          options: ['Minimize variance between clusters', 'Minimize within-cluster sum of squares', 'Maximize distance between data points', 'Reduce dimensionality'],
          correctAnswer: 1,
          solution: 'K-Means aims to minimize the Inertia (WCSS).'
        },
        {
          id: 'km_mcq_2',
          question: 'Which initialization method prevents poor cluster formation?',
          options: ['Random', 'K-Means++', 'Linear', 'Gaussian'],
          correctAnswer: 1,
          solution: 'K-Means++ spreads out centroids during initialization.'
        }
      ],
      fillBlanks: [
        { id: 'km_fb_1', question: 'The _____ is the mean position of all points in a cluster.', answer: 'centroid' },
        { id: 'km_fb_2', question: 'The _____ method helps in finding the optimal value of K.', answer: 'Elbow' }
      ],
      matchFollowing: [
        { id: 'km_mf_1', term: 'K', definition: 'Number of clusters' },
        { id: 'km_mf_2', term: 'Euclidean', definition: 'Straight-line distance' }
      ],
      trueFalse: [
        { id: 'km_tf_1', question: 'K-Means is a supervised learning algorithm.', answer: false, explanation: 'It is unsupervised because it works on unlabeled data.' }
      ],
      shortAnswers: [
        { id: 'km_sa_1', question: 'What is Inertia?', answer: 'The sum of squared distances of samples to their closest cluster center.' }
      ],
      longAnswers: [
        { id: 'km_la_1', question: 'Explain the 5-step K-Means algorithm.', answer: '1. Select K. 2. Initialize centroids. 3. Assign points. 4. Recompute centroids. 5. Repeat until convergence.' }
      ],
      numerical: [
        { id: 'km_num_1', question: 'Calculate centroid for points (1,1) and (3,3).', solution: '((1+3)/2, (1+3)/2) = (2,2)' }
      ],
      scenarios: [
        { id: 'km_sc_1', title: 'Market Segmentation', context: 'Grouping users by spend.', tasks: ['Define K', 'Normalize data'], solution: 'StandardScaler should be used first.' }
      ]
    }
  },
  {
    id: 'pca',
    name: 'Principal Component Analysis (PCA)',
    overview: 'PCA is a dimensionality reduction technique that transforms large sets of variables into smaller ones that still contain most of the information in the original set.',
    materials: [
      { id: 'pca-guide', title: 'PCA Complete Guide.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/17wIsWMlgbCWWMGXS_AltTjTGiokg4ahm/view?usp=drive_link' },
      { id: 'pca-qbank', title: 'PCA Question Bank.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1n6V7fRMvku32gYZdfHA-O1Wkn_LW0z8m/view?usp=drive_link' },
      { id: 'pca-coding', title: 'PCA Coding Handout.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1-Pk_T2AwCXWKBqshSgbZJLEflZqbdgW3/view?usp=drive_link' }
    ],
    videoUrl: 'https://www.youtube.com/embed/FgakZw6K1QQ',
    labVideoUrl: 'https://www.youtube.com/embed/8ql0S4pS-pQ',
    videos: [
      { id: 'pca-b1', level: 'Beginner', title: 'StatQuest: PCA Step-by-Step', url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ', duration: '21:52' },
      { id: 'pca-b2', level: 'Beginner', title: 'PCA Simplified for Beginners | Scaler', url: 'https://www.youtube.com/watch?v=BsJJXQ10ayM', duration: '15:00' },
      { id: 'pca-b3', level: 'Beginner', title: 'Principal Component Analysis (PCA) Intro', url: 'https://www.youtube.com/watch?v=FD4DeN81ODY', duration: '1:30' },
      { id: 'pca-b4', level: 'Beginner', title: 'PCA Explained: Simplify Complex Data', url: 'https://www.youtube.com/watch?v=ZgyY3JuGQY8', duration: '10:00' },
      { id: 'pca-b5', level: 'Beginner', title: 'PCA with Statistics Globe', url: 'https://www.youtube.com/watch?v=SyeM88joPAA', duration: '10:00' },
      { id: 'pca-i1', level: 'Intermediate', title: 'PCA – Steve Brunton', url: 'https://www.youtube.com/watch?v=fkf4IBRSeEc', duration: '20:00' },
      { id: 'pca-i2', level: 'Intermediate', title: 'Lec-46: PCA Explained | Machine Learning', url: 'https://www.youtube.com/watch?v=Dv-Kk7PDEas', duration: '25:00' },
      { id: 'pca-i3', level: 'Intermediate', title: 'PCA: Part 1 | Step by Step', url: 'https://www.youtube.com/watch?v=gnFh__0Rw70', duration: '15:00' },
      { id: 'pca-i4', level: 'Intermediate', title: 'Lec-30 PCA – NPTEL IIT Kharagpur', url: 'https://www.youtube.com/watch?v=hkCT-6KJAK0', duration: '50:00' },
      { id: 'pca-i5', level: 'Intermediate', title: 'PCA (The Math) : Concepts', url: 'https://www.youtube.com/watch?v=dhK8nbtii6I', duration: '15:00' },
      { id: 'pca-e1', level: 'Expert', title: 'PCA – MIT 18.650 (Part 1)', url: 'https://www.youtube.com/watch?v=WW3ZJHPwvyg', duration: '50:00' },
      { id: 'pca-e2', level: 'Expert', title: 'PCA – MIT 18.650 (Part 2)', url: 'https://www.youtube.com/watch?v=a1ZCeFpeW0o', duration: '50:00' },
      { id: 'pca-e3', level: 'Expert', title: '08b ML: Principal Component Analysis', url: 'https://www.youtube.com/watch?v=-to3JXiane9Y', duration: '60:00' },
      { id: 'pca-e4', level: 'Expert', title: 'PCA from Scratch', url: 'https://www.youtube.com/watch?v=y9zS7Xm0iEU', duration: '20:00' },
      { id: 'pca-e5', level: 'Expert', title: 'Advanced PCA', url: 'https://www.youtube.com/watch?v=fxheSA7aQw4', duration: '45:00' }
    ],
    quiz: [],
    questionBank: {
      mcqs: [
        { id: 'pca_mcq_1', question: 'What does PCA stand for?', options: ['Primary Component Assessment', 'Principal Component Analysis', 'Pattern Correlation Algorithm', 'Predictive Classification Approach'], correctAnswer: 1, solution: 'PCA is the acronym for Principal Component Analysis.' },
        { id: 'pca_mcq_2', question: 'What is the primary goal of PCA?', options: ['Predict target variables', 'Increase features', 'Reduce dimensionality while preserving variance', 'Clustering points'], correctAnswer: 2, solution: 'PCA transforms data into fewer dimensions while keeping maximum variance.' },
        { id: 'pca_mcq_3', question: 'Why must data be centered before PCA?', options: ['To make values positive', 'To ensure the first component passes through origin', 'To remove outliers', 'To handle categories'], correctAnswer: 1, solution: 'Centering ensures the covariance matrix is computed correctly and the first PC passes through the centroid.' },
        { id: 'pca_mcq_4', question: 'What does an eigenvalue represent in PCA context?', options: ['Direction of the PC', 'Amount of variance captured', 'Correlation between variables', 'Number of samples'], correctAnswer: 1, solution: 'Eigenvalues quantify how much variance each principal component captures.' },
        { id: 'pca_mcq_5', question: 'What does "orthogonal" mean for PCs?', options: ['Parallel', 'Perpendicular (90°)', 'Equal length', 'Same direction'], correctAnswer: 1, solution: 'Orthogonal means at right angles, ensuring components capture independent patterns.' }
      ],
      fillBlanks: [
        { id: 'pca_fb_1', question: 'A _____ plot shows eigenvalues vs component number to help choose K.', answer: 'scree' },
        { id: 'pca_fb_2', question: 'Principal components are _____ to each other, capturing independent patterns.', answer: 'orthogonal' },
        { id: 'pca_fb_3', question: 'Before PCA, data should be _____ (mean = 0).', answer: 'centered' },
        { id: 'pca_fb_4', question: 'PCA creates new features as linear _____ of original features.', answer: 'combinations' }
      ],
      matchFollowing: [
        { id: 'pca_mf_1', term: 'Eigenvalue', definition: 'Amount of variance captured' },
        { id: 'pca_mf_2', term: 'Eigenvector', definition: 'Direction vector of PC' },
        { id: 'pca_mf_3', term: 'Scree Plot', definition: 'Graph used for component selection' },
        { id: 'pca_mf_4', term: 'Loadings', definition: 'Correlations between features and PCs' }
      ],
      trueFalse: [
        { id: 'pca_tf_1', question: 'PCA requires data to be centered (mean=0) before application.', answer: true, explanation: 'Centering is a mandatory step for accurate covariance calculation.' },
        { id: 'pca_tf_2', question: 'PCA is a feature selection technique.', answer: false, explanation: 'PCA is feature extraction; it creates new features as linear combinations.' },
        { id: 'pca_tf_3', question: 'Kernel PCA can capture nonlinear patterns.', answer: true, explanation: 'Kernel PCA handles non-linearity using kernel functions.' }
      ],
      shortAnswers: [
        { id: 'pca_sa_1', question: 'What is the "Curse of Dimensionality"?', answer: 'The phenomenon where high-dimensional data becomes sparse and computational complexity increases exponentially.' },
        { id: 'pca_sa_2', question: 'Why is standardization important before PCA?', answer: 'It ensures features with larger scales do not dominate the variance calculation.' }
      ],
      longAnswers: [
        { id: 'pca_la_1', question: 'Compare PCA and LDA.', answer: 'PCA is unsupervised and maximizes variance. LDA is supervised and maximizes class separability.' },
        { id: 'pca_la_2', question: 'Describe the complete PCA pipeline.', answer: '1. Handle missing values. 2. Center/Scale data. 3. Compute Covariance Matrix. 4. Eigen Decomposition. 5. Select K. 6. Transform data.' }
      ],
      numerical: [
        { id: 'pca_num_1', question: 'If PC1 explains 70% and PC2 explains 20%, what is the total explained variance?', solution: '70% + 20% = 90%' },
        { id: 'pca_num_2', question: 'With 100 samples and 30 features, what is the max number of meaningful PCs?', solution: 'min(n-1, p) = min(99, 30) = 30.' }
      ],
      scenarios: [
        { id: 'pca_sc_1', title: 'Image Compression', context: 'Reducing pixel dimensions.', tasks: ['Apply PCA', 'Reconstruct image'], solution: 'PCA is effective because adjacent pixels are highly correlated.' }
      ]
    }
  },
  {
    id: 'apriori',
    name: 'Apriori Algorithm',
    overview: 'Apriori is used for frequent itemset mining and association rule learning over transactional databases.',
    materials: [
      { id: 'ap-guide', title: 'Apriori Complete Guide.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/1CknDNQUlZbSL1gCvKnZ7zUvNey3_JcCS/view?usp=drive_link' },
      { id: 'ap-qbank', title: 'Apriori Question Bank.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/15EYuISHtTRWOChOw0bawKulrtbluCMSq/view?usp=drive_link' },
      { id: 'ap-coding', title: 'Apriori Coding Handout.pdf', type: 'pdf', isDownloaded: false, url: 'https://drive.google.com/file/d/17r-tcn_PQeYeyYLhe7gjv3yblNUTtNYj/view?usp=drive_link' }
    ],
    videoUrl: 'https://www.youtube.com/embed/WGlMlS_Yydk',
    labVideoUrl: 'https://www.youtube.com/embed/guVvtZ7ZClw',
    videos: [
      { id: 'ap-b1', level: 'Beginner', title: 'Apriori Algorithm Tutorial | Edureka', url: 'https://www.youtube.com/watch?v=e6bq7cSjMIg', duration: '20:00' },
      { id: 'ap-b2', level: 'Beginner', title: 'Apriori (Associated Learning) - Fun & Easy', url: 'https://www.youtube.com/watch?v=WGlMlS_Yydk', duration: '11:27' },
      { id: 'ap-b3', level: 'Beginner', title: 'Apriori Explained | Edureka', url: 'https://www.youtube.com/watch?v=guVvtZ7ZClw', duration: '15:00' },
      { id: 'ap-b4', level: 'Beginner', title: 'Apriori Algorithm (Numerical Example)', url: 'https://www.youtube.com/watch?v=hBJ21-fR_xA', duration: '20:00' },
      { id: 'ap-b5', level: 'Beginner', title: 'Association Rule Mining | Simplilearn', url: 'https://www.youtube.com/watch?v=wryiEKQ0XhQ', duration: '26:35' },
      { id: 'ap-i1', level: 'Intermediate', title: 'Lecture 5 Apriori algorithm', url: 'https://www.youtube.com/watch?v=hEQkqpmtx-Y', duration: '30:00' },
      { id: 'ap-i2', level: 'Intermediate', title: 'L42: ARM | Gate Smashers', url: 'https://www.youtube.com/watch?v=GMa69BgMWC4', duration: '25:00' },
      { id: 'ap-i3', level: 'Intermediate', title: 'Lec-18: Apriori in Data Mining', url: 'https://www.youtube.com/watch?v=o_hnNBM0jtk', duration: '12:58' },
      { id: 'ap-i4', level: 'Intermediate', title: 'ARM | Edureka Rewind', url: 'https://www.youtube.com/watch?v=4RYmoBQK-HQ', duration: '20:00' },
      { id: 'ap-i5', level: 'Intermediate', title: 'Tutorial For Beginners | DS Rewind - 2', url: 'https://www.youtube.com/watch?v=4Za_38fqmXo', duration: '20:00' },
      { id: 'ap-e1', level: 'Expert', title: 'The Apriori Algorithm (Imperial College)', url: 'https://www.youtube.com/watch?v=Hk1zFOMLTrw', duration: '15:00' },
      { id: 'ap-e2', level: 'Expert', title: 'Suggestion of Products Via Apriori', url: 'https://www.youtube.com/watch?v=_lvaSO_BrDA', duration: '20:00' },
      { id: 'ap-e3', level: 'Expert', title: 'Apriori Algorithm Advanced Playlist', url: 'https://www.youtube.com/playlist?list=PLwygfZkjOfgntuQpbvauPGKfigZCzCBTN', duration: 'Varies' }
    ],
    quiz: [],
    questionBank: {
      mcqs: [
        { id: 'ap_mcq_1', question: 'What is the primary use of Apriori?', options: ['Classification', 'Association Rule Mining', 'Regression', 'Clustering'], correctAnswer: 1, solution: 'It finds relationships between items in transaction data.' },
        { id: 'ap_mcq_2', question: 'What does "Support" measure?', options: ['Rule accuracy', 'Frequency of itemset', 'Probability of consequent', 'Interestingness'], correctAnswer: 1, solution: 'Support counts how often a group of items appears together.' },
        { id: 'ap_mcq_3', question: 'Which principle reduces search space?', options: ['Overfitting', 'Apriori Principle', 'Greedy', 'Divide and Conquer'], correctAnswer: 1, solution: 'The Downward Closure property: infrequent itemsets have infrequent supersets.' },
        { id: 'ap_mcq_4', question: 'If itemset {A,B} support is 2%, what is true for {A,B,C}?', options: ['Support < 2%', 'Support at most 2%', 'Support exactly 2%', 'Support > 2%'], correctAnswer: 1, solution: 'Apriori principle: supersets cannot have higher support than subsets.' },
        { id: 'ap_mcq_5', question: 'What is the purpose of the "join step"?', options: ['Calculate confidence', 'Prune itemsets', 'Merge (k-1)-itemsets to create k-itemsets', 'Remove outliers'], correctAnswer: 2, solution: 'Combining frequent smaller itemsets to create potential larger candidates.' }
      ],
      fillBlanks: [
        { id: 'ap_fb_1', question: 'The Apriori algorithm was proposed by _____ and Srikant in 1994.', answer: 'Agrawal' },
        { id: 'ap_fb_2', question: 'Confidence(X->Y) = Support(X U Y) / Support(____).', answer: 'X' },
        { id: 'ap_fb_3', question: 'The _____ property states all subsets of a frequent itemset must be frequent.', answer: 'Apriori' }
      ],
      matchFollowing: [
        { id: 'ap_mf_1', term: 'Lift', definition: 'Measures strength vs independence' },
        { id: 'ap_mf_2', term: 'Confidence', definition: 'Likelihood of Y given X' },
        { id: 'ap_mf_3', term: 'Support', definition: 'Frequency of occurrence' },
        { id: 'ap_mf_4', term: 'Itemset', definition: 'Collection of one or more items' }
      ],
      trueFalse: [
        { id: 'ap_tf_1', question: 'Apriori requires only one database scan.', answer: false, explanation: 'It requires multiple scans, once for each itemset size.' },
        { id: 'ap_tf_2', question: 'If an itemset is infrequent, all its supersets are also infrequent.', answer: true, explanation: 'This is the core Apriori Principle used for pruning.' },
        { id: 'ap_tf_3', question: 'Lift > 1 indicates positive association.', answer: true, explanation: 'Lift > 1 means the items appear together more than random chance.' }
      ],
      shortAnswers: [
        { id: 'ap_sa_1', question: 'Define Market Basket Analysis.', answer: 'A modeling technique based on the theory that if you buy a group of items, you are more likely to buy another group.' },
        { id: 'ap_sa_2', question: 'What is the "rare item problem"?', answer: 'Important rules involving rare items being missed due to uniform high support thresholds.' }
      ],
      longAnswers: [
        { id: 'ap_la_1', question: 'Describe the Join and Prune steps.', answer: 'Join combines frequent itemsets to form larger candidates. Prune removes candidates whose subsets are infrequent.' },
        { id: 'ap_la_2', question: 'Compare Apriori and FP-Growth.', answer: 'Apriori uses candidate generation and multiple scans. FP-Growth compresses data into a tree and avoids candidates.' }
      ],
      numerical: [
        { id: 'ap_num_1', question: 'Total: 1000, Support(Milk,Diaper)=150, Support(Milk)=300. Find Confidence.', solution: '150 / 300 = 50%' },
        { id: 'ap_num_2', question: 'Sup({B,M})=0.25, Sup(B)=0.4, Sup(M)=0.5. Find Lift.', solution: '0.25 / (0.4 * 0.5) = 1.25.' }
      ],
      scenarios: [
        { id: 'ap_sc_1', title: 'Retail Upselling', context: 'Arranging products.', tasks: ['Calculate Lift', 'Strategic Placement'], solution: 'Place items with Lift > 1 near each other.' }
      ]
    }
  }
];
