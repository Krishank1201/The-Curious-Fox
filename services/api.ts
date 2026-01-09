
export interface KMeansResult {
  vizdata: {
    points: number[][];
    labels: number[];
    centers: number[][];
    nclusters: number;
    niterations: number;
  };
  metrics: {
    inertia: number;
    silhouette_score: number;
    nclusters: number;
    niterations: number;
  };
  time: number;
}

export interface AprioriResult {
  status: string;
  dataset: string;
  transactionsCount: number;
  vizdata: {
    rules: Array<{
      id: string;
      antecedent: string;
      consequent: string;
      support: number;
      confidence: number;
      lift: number;
      strength: 'strong' | 'medium' | 'weak';
    }>;
    items: Array<{
      name: string;
      count: number;
      color: string;
      emoji: string;
    }>;
    pairs: Array<{
      items: [string, string];
      count: number;
      support: number;
    }>;
  };
  metrics: {
    nrules: number;
    avgsupport: number;
    avgconfidence: number;
    avglift: number;
    maxlift: number;
    frequentitems: number;
  };
  time: number;
}

export interface PCAResult {
  points: number[][];
  components: number[][]; // Principal components (eigenvectors)
  explained_variance: number[];
  cumulative_variance: number[];
  projections: {
    pc1: number[];
    pc2: number[];
    pc12: number[][];
  };
  time: number;
}

const generate3DBlobs = (n: number, k: number) => {
  const points: number[][] = [];
  const centers: number[][] = [];
  for (let i = 0; i < k; i++) {
    centers.push([
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ]);
  }
  
  for (let i = 0; i < n; i++) {
    const center = centers[Math.floor(Math.random() * k)];
    points.push([
      center[0] + (Math.random() - 0.5) * 4,
      center[1] + (Math.random() - 0.5) * 4,
      center[2] + (Math.random() - 0.5) * 4
    ]);
  }
  return points;
};

export const runKMeans = async (params: { dataset: string; k: number; maxiter: number }): Promise<KMeansResult> => {
  const startTime = performance.now();
  await new Promise(resolve => setTimeout(resolve, 600));

  const n_samples = params.dataset === 'iris' ? 150 : 300;
  const data = generate3DBlobs(n_samples, params.k);
  
  let centroids = data.slice(0, params.k).map(p => [...p]);
  let labels = new Array(data.length).fill(0);
  let iterations = 0;

  for (let iter = 0; iter < params.maxiter; iter++) {
    iterations++;
    let changed = false;
    
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity;
      let bestK = 0;
      for (let j = 0; j < params.k; j++) {
        const dist = Math.sqrt(
          Math.pow(data[i][0] - centroids[j][0], 2) + 
          Math.pow(data[i][1] - centroids[j][1], 2) +
          Math.pow(data[i][2] - centroids[j][2], 2)
        );
        if (dist < minDist) {
          minDist = dist;
          bestK = j;
        }
      }
      if (labels[i] !== bestK) {
        labels[i] = bestK;
        changed = true;
      }
    }
    if (!changed) break;

    const newCentroids = Array.from({ length: params.k }, () => [0, 0, 0]);
    const counts = new Array(params.k).fill(0);
    for (let i = 0; i < data.length; i++) {
      const cluster = labels[i];
      counts[cluster]++;
      newCentroids[cluster][0] += data[i][0];
      newCentroids[cluster][1] += data[i][1];
      newCentroids[cluster][2] += data[i][2];
    }
    centroids = newCentroids.map((sum, j) => sum.map(s => s / (counts[j] || 1)));
  }

  const inertia = data.reduce((sum, p, i) => {
    const c = centroids[labels[i]];
    return sum + Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2) + Math.pow(p[2] - c[2], 2);
  }, 0);

  const silhouette = 0.3 + Math.random() * 0.5;

  return {
    vizdata: {
      points: data,
      labels,
      centers: centroids,
      nclusters: params.k,
      niterations: iterations
    },
    metrics: {
      inertia,
      silhouette_score: silhouette,
      nclusters: params.k,
      niterations: iterations
    },
    time: (performance.now() - startTime) / 1000
  };
};

export const runApriori = async (params: { dataset: string; support: number; confidence: number }): Promise<AprioriResult> => {
  const startTime = performance.now();
  await new Promise(resolve => setTimeout(resolve, 800));

  const itemsMap: Record<string, { items: any[], transCount: number }> = {
    grocery: {
      transCount: 150,
      items: [
        { name: 'Bread', count: 90, color: '#FF9966', emoji: '🍞' },
        { name: 'Milk', count: 85, color: '#66B2FF', emoji: '🥛' },
        { name: 'Butter', count: 65, color: '#FFD700', emoji: '🧈' },
        { name: 'Eggs', count: 75, color: '#F0E68C', emoji: '🥚' },
        { name: 'Jam', count: 35, color: '#DC143C', emoji: '🍓' },
        { name: 'Tea', count: 50, color: '#228B22', emoji: '🍵' },
        { name: 'Coffee', count: 45, color: '#8B4513', emoji: '☕' }
      ]
    },
    ecommerce: {
      transCount: 100,
      items: [
        { name: 'Laptop', count: 40, color: '#708090', emoji: '💻' },
        { name: 'Mouse', count: 70, color: '#FF4500', emoji: '🖱️' },
        { name: 'Monitor', count: 30, color: '#4169E1', emoji: '🖥️' },
        { name: 'Keyboard', count: 65, color: '#2F4F4F', emoji: '⌨️' },
        { name: 'Headset', count: 55, color: '#BA55D3', emoji: '🎧' }
      ]
    },
    bookstore: {
      transCount: 120,
      items: [
        { name: 'Fiction', count: 180, color: '#9370DB', emoji: '📚' },
        { name: 'Non-Fiction', count: 120, color: '#3CB371', emoji: '📖' },
        { name: 'Manga', count: 140, color: '#FF69B4', emoji: '🍥' },
        { name: 'History', count: 60, color: '#A0522D', emoji: '📜' }
      ]
    }
  };

  const selectedData = itemsMap[params.dataset] || itemsMap.grocery;
  const selectedItems = selectedData.items;
  const transCount = selectedData.transCount;
  
  // Generate Pairs
  const pairs = [];
  for (let i = 0; i < selectedItems.length; i++) {
    for (let j = i + 1; j < selectedItems.length; j++) {
      const count = Math.floor(Math.random() * Math.min(selectedItems[i].count, selectedItems[j].count) * 0.8);
      pairs.push({
        items: [selectedItems[i].name, selectedItems[j].name] as [string, string],
        count,
        support: count / transCount
      });
    }
  }

  // Generate Rules
  const rules = [];
  pairs.forEach(pair => {
    const itemA = selectedItems.find(it => it.name === pair.items[0])!;
    const itemB = selectedItems.find(it => it.name === pair.items[1])!;
    
    // A -> B
    const confAB = pair.count / itemA.count;
    if (confAB >= 0.1) {
      rules.push({
        id: `r-${pair.items[0]}-${pair.items[1]}`,
        antecedent: pair.items[0],
        consequent: pair.items[1],
        support: pair.support,
        confidence: confAB,
        lift: confAB / (itemB.count / transCount),
        strength: (confAB > 0.75 ? 'strong' : confAB > 0.45 ? 'medium' : 'weak') as any
      });
    }

    // B -> A
    const confBA = pair.count / itemB.count;
    if (confBA >= 0.1) {
      rules.push({
        id: `r-${pair.items[1]}-${pair.items[0]}`,
        antecedent: pair.items[1],
        consequent: pair.items[0],
        support: pair.support,
        confidence: confBA,
        lift: confBA / (itemA.count / transCount),
        strength: (confBA > 0.75 ? 'strong' : confBA > 0.45 ? 'medium' : 'weak') as any
      });
    }
  });

  const filteredRules = rules.filter(r => r.support >= params.support && r.confidence >= params.confidence);

  return {
    status: 'success',
    dataset: params.dataset,
    transactionsCount: transCount,
    vizdata: {
      rules: filteredRules,
      items: selectedItems,
      pairs: pairs.filter(p => p.support >= params.support)
    },
    metrics: {
      nrules: filteredRules.length,
      avgsupport: filteredRules.length ? filteredRules.reduce((acc, r) => acc + r.support, 0) / filteredRules.length : 0,
      avgconfidence: filteredRules.length ? filteredRules.reduce((acc, r) => acc + r.confidence, 0) / filteredRules.length : 0,
      avglift: filteredRules.length ? filteredRules.reduce((acc, r) => acc + r.lift, 0) / filteredRules.length : 0,
      maxlift: filteredRules.length ? Math.max(...filteredRules.map(r => r.lift)) : 0,
      frequentitems: selectedItems.filter(it => it.count / transCount >= params.support).length
    },
    time: (performance.now() - startTime) / 1000
  };
};

export const runPCA = async (params: { dataset: string }): Promise<PCAResult> => {
  const startTime = performance.now();
  await new Promise(resolve => setTimeout(resolve, 800));

  // Generate an elongated 3D cloud
  const n = 200;
  const points: number[][] = [];
  for (let i = 0; i < n; i++) {
    // Principal direction (PC1)
    const x = (Math.random() - 0.5) * 15;
    // PC2
    const y = (Math.random() - 0.5) * 5;
    // PC3 (Least variance)
    const z = (Math.random() - 0.5) * 2;
    
    // Rotate slightly so it's not aligned to axes initially
    const angle = Math.PI / 6;
    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
    
    points.push([rotatedX, rotatedY, z]);
  }

  // Mock PCA components
  const components = [
    [Math.cos(Math.PI/6), Math.sin(Math.PI/6), 0],   // PC1
    [-Math.sin(Math.PI/6), Math.cos(Math.PI/6), 0],  // PC2
    [0, 0, 1]                                        // PC3
  ];

  const explained_variance = [0.72, 0.21, 0.07];
  const cumulative_variance = [0.72, 0.93, 1.0];

  return {
    points,
    components,
    explained_variance,
    cumulative_variance,
    projections: {
      pc1: points.map(p => p[0] * components[0][0] + p[1] * components[0][1] + p[2] * components[0][2]),
      pc2: points.map(p => p[0] * components[1][0] + p[1] * components[1][1] + p[2] * components[1][2]),
      pc12: points.map(p => [
        p[0] * components[0][0] + p[1] * components[0][1] + p[2] * components[0][2],
        p[0] * components[1][0] + p[1] * components[1][1] + p[2] * components[1][2]
      ])
    },
    time: (performance.now() - startTime) / 1000
  };
};
