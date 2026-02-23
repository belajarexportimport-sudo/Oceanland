
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

export interface PipelineData {
  stage: string;
  value: number;
  count: number;
}

export interface ProductSalesData {
  name: string;
  value: number;
}

export interface GrowthRateData {
  period: string;
  rate: number;
}

export interface ProfitMarginData {
  month: string;
  margin: number;
}

export interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
}

export interface MarketSegmentData {
  segment: string;
  value: number;
}
