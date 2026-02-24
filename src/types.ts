
export type Division =
  | 'Sales'
  | 'Business Development & Marketing'
  | 'Technical Support'
  | 'Technical Service'
  | 'Finance Accounting & Tax'
  | 'Supply Chain & Pricing'
  | 'Warehouse'
  | 'Tender'
  | 'Human Resources & General Affair'
  | 'Project Operation'
  | 'Sales Service';

export interface KPIData {
  division: Division;
  progress: number; // 0-100
  target: number;
  actual: number;
  year?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  expense: number;
  year?: string;
}


export interface ProductSalesData {
  name: string;
  value: number;
  year?: string;
}

export interface GrowthRateData {
  period: string;
  rate: number;
  year?: string;
}

export interface ProfitMarginData {
  month: string;
  margin: number;
  year?: string;
}

export interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
  year?: string;
}

export interface MarketSegmentData {
  segment: string;
  value: number;
  year?: string;
}

export interface ARTurnoverData {
  month: string;
  ratio: number;
  year?: string;
}
