export interface EarningRecord {
  year: number;
  amount: number;
  isProjected?: boolean;
}

export interface PiaBreakdown {
  portion90: number;
  portion32: number;
  portion15: number;
  bendPoint1: number;
  bendPoint2: number;
}

export interface CalculationResult {
  birthYear: number;
  retireYear: number;
  indexingYear: number;
  aime: number;
  pia: number;
  benefit: number;
  fra: number; // Full Retirement Age in years (decimal)
  startAge: number; // Age when benefits start
  indexedEarnings: { year: number; raw: number; indexed: number; factor: number; usedInTop35: boolean }[];
  piaBreakdown: PiaBreakdown;
}

export interface UserInputs {
  birthMonth: number;
  birthYear: number;
  projectedSalary: number;
  benefitStartMonth: number;
  benefitStartYear: number;
}