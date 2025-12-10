

import { AWI_DATA, BEND_POINTS_HISTORY, COLA_HISTORY } from '../constants';
import { EarningRecord, UserInputs, CalculationResult } from '../types';

export const calculateBenefit = (
  earnings: EarningRecord[],
  inputs: UserInputs
): CalculationResult => {
  const { birthYear, birthMonth, benefitStartYear, benefitStartMonth, projectedSalary } = inputs;
  
  // 1. Determine Full Retirement Age (FRA)
  // Simplified logic: Born 1960 or later -> 67. 
  let fra = 67;
  if (birthYear <= 1937) fra = 65;
  else if (birthYear <= 1954) fra = 66;
  else if (birthYear <= 1959) fra = 66 + (birthYear - 1954) * (2/12);
  
  // 2. Determine Indexing Year (Year turning 60)
  const indexingYear = birthYear + 60;
  
  // 3. Fill in Future Earnings until Benefit Start Year (or reasonable cutoff)
  // We project up to the year before benefit starts.
  const allEarnings: EarningRecord[] = [...earnings];
  const lastRecordedYear = earnings.length > 0 ? Math.max(...earnings.map(e => e.year)) : birthYear + 18;
  const endYear = benefitStartYear - 1; 

  for (let y = lastRecordedYear + 1; y <= endYear; y++) {
    allEarnings.push({ year: y, amount: projectedSalary, isProjected: true });
  }

  // 4. Index Earnings
  // For calculation, we generally use the AWI from 2 years prior to the year of eligibility (age 62).
  // Eligibility Year = Birth Year + 62.
  // Indexing Year (for AWI selection) = Eligibility Year - 2 = Birth Year + 60.
  const awiAtIndexing = AWI_DATA[indexingYear] || AWI_DATA[2022] || 63761.65; 
  
  const indexedEarnings = allEarnings.map(record => {
    // Earnings at age 60 or later are not indexed (Factor = 1.0)
    if (record.year >= indexingYear) {
      return { ...record, indexed: record.amount, factor: 1.0, raw: record.amount, usedInTop35: false };
    }

    const awiYear = AWI_DATA[record.year];
    if (!awiYear) {
      // Fallback if historical data missing
      return { ...record, indexed: record.amount, factor: 1.0, raw: record.amount, usedInTop35: false };
    }

    const factor = awiAtIndexing / awiYear;
    return { 
      ...record, 
      raw: record.amount,
      indexed: record.amount * factor, 
      factor, 
      usedInTop35: false 
    };
  });

  // 5. Determine Top 35 Years
  // Sort by indexed amount descending
  const sorted = [...indexedEarnings].sort((a, b) => b.indexed - a.indexed);
  const top35 = sorted.slice(0, 35);
  
  // Mark used years
  const top35Years = new Set(top35.map(x => x.year));
  const finalEarnings = indexedEarnings.map(e => ({
    ...e,
    usedInTop35: top35Years.has(e.year)
  })).sort((a, b) => a.year - b.year);

  const sumTop35 = top35.reduce((acc, curr) => acc + curr.indexed, 0);

  // 6. Calculate AIME
  // AIME is always rounded down to the next lower dollar
  const aime = Math.floor(sumTop35 / (35 * 12));

  // 7. Calculate PIA (Base PIA at Age 62)
  // Use Bend Points for the year of eligibility (Age 62)
  const eligibilityYear = birthYear + 62;
  
  // Use specific year from history or fallback to latest known (2025)
  // If eligibility is in the future beyond our data, we use the latest available as a projection
  const bendPoints = BEND_POINTS_HISTORY[eligibilityYear] || BEND_POINTS_HISTORY[2025];
  
  const b1 = bendPoints.first;
  const b2 = bendPoints.second;

  let basePia = 0;
  let portion90 = 0;
  let portion32 = 0;
  let portion15 = 0;

  if (aime <= b1) {
    portion90 = 0.9 * aime;
  } else if (aime <= b2) {
    portion90 = 0.9 * b1;
    portion32 = 0.32 * (aime - b1);
  } else {
    portion90 = 0.9 * b1;
    portion32 = 0.32 * (b2 - b1);
    portion15 = 0.15 * (aime - b2);
  }
  
  basePia = portion90 + portion32 + portion15;
  // Base PIA rounded down to next lower dime
  basePia = Math.floor(basePia * 10) / 10;

  // 7b. Apply COLA adjustments
  // COLAs apply starting from the eligibility year. 
  // e.g. If Eligible in 2021, the 2021 COLA (paid in 2022) is applied.
  // We apply known COLAs up to the current year to get "Current Year Dollars".
  
  let currentPia = basePia;
  const currentYear = new Date().getFullYear();
  // We iterate from eligibility year up to current year (or just before benefit start if earlier, but prompt implies 'current year dollars')
  // Note: COLA_HISTORY[y] is the COLA effective Dec of year y.
  
  const stopYear = currentYear; 

  for (let y = eligibilityYear; y < stopYear; y++) {
    const cola = COLA_HISTORY[y];
    if (cola !== undefined) {
      currentPia = currentPia * (1 + (cola / 100));
      // Round to next lower dime after each COLA
      currentPia = Math.floor(currentPia * 10) / 10;
    }
  }

  // 8. Adjust for Early/Delayed Retirement
  // Calculate total months difference from FRA
  const fraMonthTotal = (birthYear * 12 + birthMonth) + (fra * 12);
  const startMonthTotal = (benefitStartYear * 12 + benefitStartMonth);
  const monthDiff = startMonthTotal - fraMonthTotal; // Negative = Early, Positive = Delayed

  let multiplier = 1.0;
  
  if (monthDiff < 0) {
    // Reduction
    const monthsEarly = Math.abs(monthDiff);
    if (monthsEarly <= 36) {
      multiplier = 1 - (monthsEarly * (5/900)); // 5/9 of 1%
    } else {
      multiplier = 1 - (36 * (5/900)) - ((monthsEarly - 36) * (5/1200));
    }
  } else if (monthDiff > 0) {
    // Delayed Credits (Simplified 8% per year / 2/3 of 1% per month)
    // Capped at age 70
    const monthsDelayed = Math.min(monthDiff, (70 * 12) - (fra * 12)); 
    multiplier = 1 + (monthsDelayed * (8/1200));
  }

  const benefit = Math.floor(currentPia * multiplier);
  const startAge = (benefitStartYear - birthYear) + ((benefitStartMonth - birthMonth) / 12);

  return {
    birthYear,
    retireYear: benefitStartYear,
    indexingYear,
    aime,
    pia: currentPia, // Adjusted PIA with COLAs
    benefit,
    fra,
    startAge,
    indexedEarnings: finalEarnings,
    piaBreakdown: {
      portion90,
      portion32,
      portion15,
      bendPoint1: b1,
      bendPoint2: b2
    }
  };
};
