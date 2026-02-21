
import { KPIData, RevenueData, PipelineData, ProductSalesData, GrowthRateData, Division } from './types';

export const DIVISIONS: Division[] = [
  'Sales',
  'Business Development & Marketing',
  'Technical Support',
  'Technical Service',
  'Finance Accounting & Tax',
  'Supply Chain & Pricing',
  'Warehouse',
  'Tender',
  'Human Resources & General Affair',
  'Project Operation',
  'Sales Service'
];

export const MOCK_KPI_DATA: KPIData[] = DIVISIONS.map(div => ({
  division: div,
  progress: Math.floor(Math.random() * 40) + 60, // 60-100%
  target: 100,
  actual: Math.floor(Math.random() * 30) + 70
}));

export const MOCK_REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', revenue: 4500, target: 4000, expense: 3200 },
  { month: 'Feb', revenue: 5200, target: 4200, expense: 3400 },
  { month: 'Mar', revenue: 4800, target: 4500, expense: 3100 },
  { month: 'Apr', revenue: 6100, target: 4800, expense: 3800 },
  { month: 'May', revenue: 5900, target: 5000, expense: 3600 },
  { month: 'Jun', revenue: 6800, target: 5500, expense: 4100 },
  { month: 'Jul', revenue: 7200, target: 6000, expense: 4300 },
  { month: 'Aug', revenue: 7100, target: 6200, expense: 4200 },
  { month: 'Sep', revenue: 8500, target: 6500, expense: 4800 },
  { month: 'Oct', revenue: 8200, target: 7000, expense: 4600 },
  { month: 'Nov', revenue: 9400, target: 7500, expense: 5200 },
  { month: 'Dec', revenue: 10500, target: 8000, expense: 5800 },
];

export const MOCK_PIPELINE_DATA: PipelineData[] = [
  { stage: 'Prospecting', value: 1200000, count: 45 },
  { stage: 'Qualification', value: 850000, count: 32 },
  { stage: 'Proposal', value: 600000, count: 18 },
  { stage: 'Negotiation', value: 450000, count: 12 },
  { stage: 'Closed Won', value: 300000, count: 8 },
];

export const MOCK_PRODUCT_SALES: ProductSalesData[] = [
  { name: 'Spare Parts', value: 35 },
  { name: 'Maintenance Service', value: 25 },
  { name: 'New Equipment', value: 20 },
  { name: 'Consultation', value: 15 },
  { name: 'Others', value: 5 },
];

export const MOCK_GROWTH_RATE: GrowthRateData[] = [
  { period: 'Q1', rate: 12.5 },
  { period: 'Q2', rate: 15.2 },
  { period: 'Q3', rate: 18.7 },
  { period: 'Q4', rate: 22.1 },
];

export interface BudgetData {
  category: string;
  budget: number;
  actual: number;
}

export const MOCK_BUDGET_DATA: BudgetData[] = [
  { category: 'Operational', budget: 50000, actual: 48500 },
  { category: 'Marketing', budget: 25000, actual: 28000 },
  { category: 'Development', budget: 40000, actual: 35000 },
  { category: 'HR & GA', budget: 15000, actual: 14200 },
  { category: 'Project Op', budget: 60000, actual: 58000 },
];

export const SUMMARY_STATS = {
  totalLeads: 1248,
  totalExpense: 48500,
  totalProfit: 32400,
  margin: 40.2,
  customerSatisfaction: 4.8,
  conversionRate: 24.5,
  totalInventoryAssets: 1500000,
  totalDemoAssets: 450000,
  totalOperationalOfficeAssets: 850000,
  bestEmployee: "Budi Santoso",
  bestDivision: "Sales",
  bestAttendance: "Siti Aminah",
};
