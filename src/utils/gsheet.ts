/**
 * GSheet Fetcher Utility
 * Connects the dashboard to the Google Apps Script Master and parses the response.
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzBkPrPYwpel3Q2Y4qW6o0EFPRCxAPZ4kSufta8Hc-G8lj_59XR9A-KiRmI8agH_NqXyA/exec';

export interface DashboardData {
  inquiries: any[];
  revenue: any[];
  kpi: any[];
  budget: any[];
  pipeline: any[];
  stats: any;
}

export async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    // We send a request to a special action "fetch_dashboard_data"
    // Note: We might need to update the GAS script to support this action
    const response = await fetch(GAS_URL + "?action=fetch_dashboard_data", {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
}

/**
 * Mapping function to transform raw GSheet response to state-ready data
 */
export function mapGSheetToDashboard(raw: any) {
  // Defensive mapping in case some fields are missing
  return {
    kpiData: raw.kpi || [],
    revenueData: raw.revenue || [],
    budgetData: raw.budget || [],
    pipelineData: raw.pipeline || [],
    stats: raw.stats || {},
    recentInquiries: raw.inquiries || []
  };
}
