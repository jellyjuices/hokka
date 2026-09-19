export type TaxBracket = {
  upTo: number | null;
  rate: number;
};

export type IncomeTaxRates = {
  taxYear: number;
  federalBrackets: TaxBracket[];
  federalBasicPersonalAmount: number;
  federalLowestRate: number;
  ontarioBrackets: TaxBracket[];
  ontarioBasicPersonalAmount: number;
  ontarioLowestRate: number;
  ontarioSurtaxThresholds: TaxBracket[];
  cppSelfEmployedRate: number;
  cppBasicExemption: number;
  cppMaxPensionableEarnings: number;
};

export const INCOME_TAX_RATES: IncomeTaxRates = {
  taxYear: 2025,
  federalBrackets: [
    { upTo: 57375, rate: 0.145 },
    { upTo: 114750, rate: 0.205 },
    { upTo: 177882, rate: 0.26 },
    { upTo: 253414, rate: 0.29 },
    { upTo: null, rate: 0.33 },
  ],
  federalBasicPersonalAmount: 16129,
  federalLowestRate: 0.145,
  ontarioBrackets: [
    { upTo: 52886, rate: 0.0505 },
    { upTo: 105775, rate: 0.0915 },
    { upTo: 150000, rate: 0.1116 },
    { upTo: 220000, rate: 0.1216 },
    { upTo: null, rate: 0.1316 },
  ],
  ontarioBasicPersonalAmount: 12747,
  ontarioLowestRate: 0.0505,
  ontarioSurtaxThresholds: [
    { upTo: 5710, rate: 0 },
    { upTo: 7307, rate: 0.2 },
    { upTo: null, rate: 0.56 },
  ],
  cppSelfEmployedRate: 0.119,
  cppBasicExemption: 3500,
  cppMaxPensionableEarnings: 71300,
};
