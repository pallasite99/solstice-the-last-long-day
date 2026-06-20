export interface ResourceState {
  energy: number; // 0 - 100
  water: number;  // 0 - 100
  population: number; // 0 - 100
  knowledge: number; // 0 - 100
  timeLimit: number; // 24.0 hours down to 0.0
}

export interface HemisphereState {
  dayShare: number; // 0% - 100% (Day Side allocation vs Night Side allocation, sum is 100)
  dayTemp: number; // calculated heat index
  nightTemp: number; // calculated cryo index
  solarEfficiency: number;
  cryoStability: number;
}

export interface PuzzleState {
  cipherText: string;
  solution: string;
  currentInput: string;
  isSolved: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
}

export interface Dilemma {
  title: string;
  description: string;
  options: {
    A: {
      text: string;
      impact: {
        energy: number;
        water: number;
        population: number;
        knowledge: number;
        timeLimit?: number;
      };
    };
    B: {
      text: string;
      impact: {
        energy: number;
        water: number;
        population: number;
        knowledge: number;
        timeLimit?: number;
      };
    };
  };
}

export interface HistoricalDataPoint {
  time: string;
  population: number;
  energyEfficiency: number;
}

