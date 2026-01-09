
import { LabMode, PracticeType } from "../types";

// Extracted Data from PDF 1: K-Means
const KMEANS_DATA = {
  learn: [
    {
      step_title: "Basic Scikit-Learn K-Means",
      dr_fox_message: "Scikit-learn is the standard for rapid prototyping. We initialize the KMeans object with our desired number of clusters and call fit_predict.",
      code_block: {
        skeleton_code: `from sklearn.cluster import KMeans\n\n# Initialize model\nmodel = KMeans(n_clusters=3, random_state=42)\n\n# Fit and predict labels\nlabels = model.fit_predict(X)\n\n# Access cluster centers\ncentroids = model.cluster_centers_`,
        explanation: [
          "Import the KMeans module from sklearn's cluster collection.",
          "n_clusters determines our 'K' value.",
          "fit_predict both trains the model and assigns points to clusters.",
          "The underscore in cluster_centers_ denotes an attribute learned during fitting."
        ]
      }
    },
    {
      step_title: "Optimization with K-Means++",
      dr_fox_message: "Standard random initialization can lead to poor local optima. K-Means++ spreads out the initial centroids for better convergence.",
      code_block: {
        skeleton_code: `from sklearn.cluster import KMeans\n\n# Use k-means++ initialization\nkmeans = KMeans(n_clusters=4, init='k-means++')\nlabels = kmeans.fit_predict(X)`,
        explanation: [
          "The 'init' parameter defaults to 'k-means++' in modern versions.",
          "This method improves speed and accuracy compared to purely random selection."
        ]
      }
    },
    {
      step_title: "Finding K: The Elbow Method",
      dr_fox_message: "We use 'Inertia' (Within-Cluster Sum of Squares) to find the 'Elbow' point where adding more clusters yields diminishing returns.",
      code_block: {
        skeleton_code: `wcss = []\nfor k in range(1, 11):\n    kmeans = KMeans(n_clusters=k, random_state=0)\n    kmeans.fit(X)\n    wcss.append(kmeans.inertia_)\n\n# Plotting would follow here`,
        explanation: [
          "Iterate through a range of potential K values.",
          "inertia_ is the sum of squared distances to the nearest cluster center.",
          "We look for the point where the rate of decrease shifts sharply."
        ]
      }
    }
  ],
  practice: [
    {
      step_title: "Implement the KMeans Pipeline",
      dr_fox_message: "Fill in the blanks to complete the standard clustering pipeline.",
      code_block: {
        instructions: "Replace the underscores with the correct class names or parameters.",
        skeleton_code: `from sklearn.cluster import ______\n\nmodel = ______(n_clusters=3, random_state=42)\nlabels = model.fit_______(X)\nprint(f"Centroids: {model.cluster_centers_}")`,
        validation: ["KMeans", "KMeans", "predict"]
      }
    }
  ]
};

// Extracted Data from PDF 2: Apriori
const APRIORI_DATA = {
  learn: [
    {
      step_title: "Transaction Encoding",
      dr_fox_message: "Apriori requires a one-hot encoded matrix. The TransactionEncoder transforms a list of itemsets into a boolean DataFrame.",
      code_block: {
        skeleton_code: `from mlxtend.preprocessing import TransactionEncoder\nimport pandas as pd\n\nte = TransactionEncoder()\nX = te.fit_transform(transactions)\ndf = pd.DataFrame(X, columns=te.columns_)`,
        explanation: [
          "TransactionEncoder maps items to columns.",
          "fit_transform converts the raw list into a sparse array.",
          "columns_ provides the original item labels for our DataFrame."
        ]
      }
    },
    {
      step_title: "Mining Rules & Metrics",
      dr_fox_message: "We first find frequent itemsets with 'apriori', then generate directed rules with 'association_rules' using confidence as our metric.",
      code_block: {
        skeleton_code: `from mlxtend.frequent_patterns import apriori, association_rules\n\n# Find items appearing in at least 30% of baskets\nfreq = apriori(df, min_support=0.3, use_colnames=True)\n\n# Generate rules with at least 70% reliability\nrules = association_rules(freq, metric="confidence", min_threshold=0.7)`,
        explanation: [
          "min_support filters out rare items.",
          "use_colnames preserves item names instead of indices.",
          "association_rules calculates lift, leverage, and conviction automatically."
        ]
      }
    }
  ],
  practice: [
    {
      step_title: "Association Rule Filter",
      dr_fox_message: "Setup the mining parameters to find strong associations.",
      code_block: {
        instructions: "Set the support threshold to 0.2 and confidence to 0.8.",
        skeleton_code: `freq = apriori(df, min_support=______, use_colnames=True)\nrules = association_rules(freq, metric="______", min_threshold=______)`,
        validation: ["0.2", "confidence", "0.8"]
      }
    }
  ]
};

// Extracted Data from PDF 3: PCA
const PCA_DATA = {
  learn: [
    {
      step_title: "PCA From Scratch (NumPy)",
      dr_fox_message: "The core of PCA is the Eigendecomposition of the Covariance matrix. We center the data, find the covariance, and extract eigenvalues.",
      code_block: {
        skeleton_code: `import numpy as np\n\n# Center the data\nX_meaned = X - np.mean(X, axis=0)\n\n# Compute Covariance\ncov = np.cov(X_meaned, rowvar=False)\n\n# Eigen Decomposition\neig_vals, eig_vecs = np.linalg.eig(cov)`,
        explanation: [
          "Centering ensures PCA captures variance around the origin.",
          "rowvar=False means columns are our features.",
          "Eigenvectors represent the directions of maximum variance."
        ]
      }
    },
    {
      step_title: "Scikit-Learn Projection",
      dr_fox_message: "In practice, we use sklearn's PCA for its robust solvers and easy transformation methods.",
      code_block: {
        skeleton_code: `from sklearn.decomposition import PCA\n\n# Reduce to 2 Principal Components\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X)\n\nprint(f"Explained Variance: {pca.explained_variance_ratio_}")`,
        explanation: [
          "n_components is the target dimensionality.",
          "fit_transform performs the projection.",
          "explained_variance_ratio_ tells us how much 'info' we kept."
        ]
      }
    }
  ],
  practice: [
    {
      step_title: "Dimensionality Reduction task",
      dr_fox_message: "Setup PCA to retain exactly 2 components.",
      code_block: {
        instructions: "Initialize PCA and call the transformation method.",
        skeleton_code: `from sklearn.decomposition import ______\n\npca = ______(n_components=2)\nX_reduced = pca.______ (X)`,
        validation: ["PCA", "PCA", "fit_transform"]
      }
    }
  ]
};

const STATIC_REGISTRY: Record<string, any> = {
  kmeans: KMEANS_DATA,
  apriori: APRIORI_DATA,
  pca: PCA_DATA
};

export class DrFoxService {
  async getLearnStep(algorithm: string, stepIndex: number): Promise<any> {
    const steps = STATIC_REGISTRY[algorithm]?.learn || [];
    return steps[stepIndex] || steps[0];
  }

  async getPracticeInitial(algorithm: string, type: PracticeType, stepIndex: number): Promise<any> {
    const practiceSet = STATIC_REGISTRY[algorithm]?.practice || [];
    const base = practiceSet[stepIndex] || practiceSet[0];
    
    if (type === 'independent') {
      return {
        ...base,
        code_block: {
          ...base.code_block,
          skeleton_code: "# Implement the full logic for this step below\n"
        }
      };
    }
    return base;
  }

  async submitPractice(algorithm: string, type: PracticeType, stepIndex: number, userCode: string): Promise<any> {
    const practiceSet = STATIC_REGISTRY[algorithm]?.practice || [];
    const current = practiceSet[stepIndex] || practiceSet[0];
    const validation = current.code_block.validation || [];
    
    // Static accuracy check: Ensure code contains the expected keywords from validation
    const missing = validation.filter((v: string) => !userCode.includes(v));
    const is_correct = missing.length === 0;

    return {
      is_correct,
      issues: is_correct ? [] : [{ message: "The implementation is missing some required patterns or parameters." , hint: `Make sure you use: ${missing[0]}`}],
      dr_fox_message: is_correct 
        ? "Excellent intuition! The pattern matches exactly." 
        : "Not quite. Check the specific method calls or thresholds required for this algorithm."
    };
  }

  async submitTest(algorithm: string, userFullCode: string): Promise<any> {
    const keywords: Record<string, string[]> = {
      kmeans: ['KMeans', 'fit_predict', 'sklearn'],
      pca: ['PCA', 'fit_transform', 'decomposition'],
      apriori: ['apriori', 'association_rules', 'mlxtend']
    };

    const target = keywords[algorithm] || [];
    const missing = target.filter(k => !userFullCode.includes(k));
    const is_fully_correct = missing.length === 0;

    return {
      is_fully_correct,
      strengths: is_fully_correct ? ["Correct Library Usage", "Proper Pipeline Logic"] : [],
      improvements: !is_fully_correct ? [`Ensure you import and use: ${missing.join(', ')}`] : [],
      dr_fox_message: is_fully_correct 
        ? `I've audited your ${algorithm.toUpperCase()} pipeline. It's production-ready.` 
        : "I found some missing segments in your implementation."
    };
  }
}

export const drFox = new DrFoxService();
