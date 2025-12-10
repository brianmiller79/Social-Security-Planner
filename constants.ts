

// Simplified Average Wage Index Data (Historical)
// Source: SSA.gov (Sample data for functionality)
export const AWI_DATA: Record<number, number> = {
  1960: 4007.12, 1961: 4086.76, 1962: 4291.40, 1963: 4396.64, 1964: 4576.32,
  1965: 4658.72, 1966: 4938.36, 1967: 5213.44, 1968: 5571.76, 1969: 5893.76,
  1970: 6186.24, 1971: 6497.08, 1972: 7133.80, 1973: 7580.16, 1974: 8030.76,
  1975: 8630.92, 1976: 9226.48, 1977: 9779.44, 1978: 10556.03, 1979: 11479.46,
  1980: 12513.46, 1981: 13773.10, 1982: 14531.34, 1983: 15239.24, 1984: 16135.07,
  1985: 16822.51, 1986: 17321.82, 1987: 18426.51, 1988: 19334.04, 1989: 20099.55,
  1990: 21027.98, 1991: 21811.60, 1992: 22935.42, 1993: 23132.67, 1994: 23753.53,
  1995: 24705.66, 1996: 25913.90, 1997: 27426.00, 1998: 28861.44, 1999: 30469.84,
  2000: 32154.82, 2001: 32921.92, 2002: 33252.09, 2003: 34064.95, 2004: 35648.55,
  2005: 36952.94, 2006: 38651.41, 2007: 40405.48, 2008: 41334.97, 2009: 40711.61,
  2010: 41673.83, 2011: 42979.61, 2012: 44321.67, 2013: 44888.16, 2014: 46481.52,
  2015: 48098.63, 2016: 48642.15, 2017: 50321.89, 2018: 52145.80, 2019: 54099.99,
  2020: 55628.60, 2021: 60575.07, 2022: 63761.65, 2023: 66621.80,
  // Projecting minimal growth for 2024+ for demo purposes if not available
  2024: 68620.00, 2025: 70678.00 
};

// Historical Bend Points by Eligibility Year (Year turning 62)
// Source: https://www.ssa.gov/oact/cola/bendpoints.html
export const BEND_POINTS_HISTORY: Record<number, { first: number; second: number }> = {
  2015: { first: 826, second: 4980 },
  2016: { first: 856, second: 5157 },
  2017: { first: 885, second: 5336 },
  2018: { first: 895, second: 5397 },
  2019: { first: 926, second: 5583 },
  2020: { first: 960, second: 5785 },
  2021: { first: 996, second: 6002 },
  2022: { first: 1024, second: 6172 },
  2023: { first: 1115, second: 6721 },
  2024: { first: 1174, second: 7078 },
  2025: { first: 1226, second: 7391 },
};

// Historical COLA Percentages by Year (applied to benefits paid in following year)
// Source: https://www.ssa.gov/oact/cola/colaseries.html
export const COLA_HISTORY: Record<number, number> = {
  2015: 0.0,
  2016: 0.3,
  2017: 2.0,
  2018: 2.8,
  2019: 1.6,
  2020: 1.3,
  2021: 5.9,
  2022: 8.7,
  2023: 3.2,
  2024: 2.5
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Sample CSV content for the user to try
export const SAMPLE_CSV = `Year,Earnings
1990,15000
1991,16500
1992,18000
1993,19500
1994,21000
1995,22500
1996,24000
1997,25500
1998,27000
1999,28500
2000,30000
2001,31500
2002,33000
2003,34500
2004,36000
2005,37500
2006,39000
2007,40500
2008,42000
2009,43500
2010,45000
2011,46500
2012,48000
2013,49500
2014,51000
2015,52500
2016,54000
2017,55500
2018,57000
2019,58500
2020,60000
2021,62000
2022,64000
2023,66000`;
