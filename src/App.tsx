/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Clean Version - Recent Enquiries Detail Section Removed
 */

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Users, TrendingUp, DollarSign, Target,
  Briefcase, CheckCircle2, ChevronDown, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, MessageSquare, ShoppingCart,
  Settings, X, Save, Plus, Trash2, Edit3, Box, Monitor, Building2,
  Award, Medal, Clock, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  MOCK_KPI_DATA, MOCK_REVENUE_DATA,
  MOCK_PRODUCT_SALES, MOCK_GROWTH_RATE, SUMMARY_STATS,
  DIVISIONS, MOCK_BUDGET_DATA, MOCK_PROFIT_MARGIN_DATA,
  MOCK_CASHFLOW_DATA, MOCK_MARKET_SHARE_DATA, MOCK_SEGMENTATION_DATA,
  MOCK_AR_TURNOVER_DATA
} from './constants';
import { fetchDashboardData, mapGSheetToDashboard } from './utils/gsheet';
import { parseCSV, parseExcel, mapRevenueData, mapKPIData, mapBudgetData } from './utils/dataUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const STORAGE_KEY = 'oseanland_dashboard_data';

export default function App() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [showEditPanel, setShowEditPanel] = useState(false);

  // Dashboard State
  const [kpiData, setKpiData] = useState(MOCK_KPI_DATA);
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE_DATA.filter(d => d.year === '2024'));
  const [budgetData, setBudgetData] = useState(MOCK_BUDGET_DATA);
  const [productSales, setProductSales] = useState(MOCK_PRODUCT_SALES);
  const [growthRate, setGrowthRate] = useState(MOCK_GROWTH_RATE);
  const [stats, setStats] = useState(SUMMARY_STATS);
  const [profitMarginData, setProfitMarginData] = useState(MOCK_PROFIT_MARGIN_DATA);
  const [cashFlowData, setCashFlowData] = useState(MOCK_CASHFLOW_DATA);
  const [marketShareData, setMarketShareData] = useState(MOCK_MARKET_SHARE_DATA);
  const [segmentationData, setSegmentationData] = useState(MOCK_SEGMENTATION_DATA);
  const [arTurnoverData, setArTurnoverData] = useState(MOCK_AR_TURNOVER_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Persistence & Data Fetching Logic
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.kpiData) setKpiData(parsed.kpiData);
        if (parsed.revenueData) setRevenueData(parsed.revenueData);
        if (parsed.budgetData) setBudgetData(parsed.budgetData);
        if (parsed.productSales) setProductSales(parsed.productSales);
        if (parsed.growthRate) setGrowthRate(parsed.growthRate);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.profitMarginData) setProfitMarginData(parsed.profitMarginData);
        if (parsed.cashFlowData) setCashFlowData(parsed.cashFlowData);
        if (parsed.marketShareData) setMarketShareData(parsed.marketShareData);
        if (parsed.segmentationData) setSegmentationData(parsed.segmentationData);
        if (parsed.arTurnoverData) setArTurnoverData(parsed.arTurnoverData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      }
    }

    const loadLiveData = async () => {
      setIsLoading(true);
      const liveData = await fetchDashboardData();
      if (liveData) {
        const mapped = mapGSheetToDashboard(liveData);
        if (mapped.kpiData.length) setKpiData(mapped.kpiData);
        if (mapped.revenueData.length) setRevenueData(mapped.revenueData);
        if (mapped.budgetData.length) setBudgetData(mapped.budgetData);
        if (Object.keys(mapped.stats).length) setStats(mapped.stats);
        setLastUpdated(new Date().toLocaleTimeString());
      }
      setIsLoading(false);
    };

    loadLiveData();
  }, []);

  const saveToDisk = () => {
    const data = {
      kpiData, revenueData, budgetData, productSales,
      growthRate, stats,
      profitMarginData, cashFlowData, marketShareData, segmentationData,
      arTurnoverData
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleStatChange = (key: keyof typeof SUMMARY_STATS, value: number) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  const handleKpiChange = (index: number, field: 'progress' | 'actual', value: number) => {
    const newData = [...kpiData];
    newData[index] = { ...newData[index], [field]: value };
    setKpiData(newData);
  };

  const handleRevenueChange = (index: number, field: 'revenue' | 'target' | 'expense', value: number) => {
    const newData = [...revenueData];
    newData[index] = { ...newData[index], [field]: value };
    setRevenueData(newData);
  };

  const handleBudgetChange = (index: number, field: 'budget' | 'actual', value: number) => {
    const newData = [...budgetData];
    newData[index] = { ...newData[index], [field]: value };
    setBudgetData(newData);
  };

  const handleProductChange = (index: number, value: number) => {
    const newData = [...productSales];
    newData[index] = { ...newData[index], value };
    setProductSales(newData);
  };

  const handleGrowthChange = (index: number, rate: number) => {
    const newData = [...growthRate];
    newData[index] = { ...newData[index], rate };
    setGrowthRate(newData);
  };

  const handleProfitMarginChange = (index: number, margin: number) => {
    const newData = [...profitMarginData];
    newData[index] = { ...newData[index], margin };
    setProfitMarginData(newData);
  };

  const handleCashFlowChange = (index: number, field: 'inflow' | 'outflow', value: number) => {
    const newData = [...cashFlowData];
    newData[index] = { ...newData[index], [field]: value };
    setCashFlowData(newData);
  };

  const handleMarketShareChange = (index: number, value: number) => {
    const newData = [...marketShareData];
    newData[index] = { ...newData[index], value };
    setMarketShareData(newData);
  };

  const handleSegmentationChange = (index: number, value: number) => {
    const newData = [...segmentationData];
    newData[index] = { ...newData[index], value };
    setSegmentationData(newData);
  };

  const handleArTurnoverChange = (index: number, ratio: number) => {
    const newData = [...arTurnoverData];
    newData[index] = { ...newData[index], ratio };
    setArTurnoverData(newData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'revenue' | 'kpi' | 'budget' | 'all') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      try {
        const sheets = await parseExcel(file);
        const sheetNames = Object.keys(sheets);

        if (type === 'all' || sheetNames.length > 1) {
          // Smart matching based on sheet names
          let importedCount = 0;
          for (const name of sheetNames) {
            const lowerName = name.toLowerCase();
            const rows = sheets[name];
            if (lowerName.includes('revenue') || lowerName.includes('monthly')) {
              setRevenueData(mapRevenueData(rows));
              importedCount++;
            } else if (lowerName.includes('kpi') || lowerName.includes('performa')) {
              setKpiData(mapKPIData(rows));
              importedCount++;
            } else if (lowerName.includes('budget') || lowerName.includes('anggaran')) {
              setBudgetData(mapBudgetData(rows));
              importedCount++;
            } else if (lowerName.includes('turnover') || lowerName.includes('ar turnover')) {
              const { mapArTurnoverData } = await import('./utils/dataUtils');
              setArTurnoverData(mapArTurnoverData(rows));
              importedCount++;
            }
          }

          if (importedCount > 0) {
            alert(`Smart Import: Successfully imported ${importedCount} sheets!`);
          } else if (type !== 'all') {
            const rows = sheets[sheetNames[0]];
            if (type === 'revenue') setRevenueData(mapRevenueData(rows));
            if (type === 'kpi') setKpiData(mapKPIData(rows));
            if (type === 'budget') setBudgetData(mapBudgetData(rows));
            alert(`Imported first sheet "${sheetNames[0]}" as ${type}.`);
          }
        } else {
          const rows = sheets[sheetNames[0]];
          if (type === 'revenue') setRevenueData(mapRevenueData(rows));
          if (type === 'kpi') setKpiData(mapKPIData(rows));
          if (type === 'budget') setBudgetData(mapBudgetData(rows));
          alert(`Successfully imported "${sheetNames[0]}" for ${type}!`);
        }
      } catch (err) {
        console.error("Excel import failed", err);
        alert("Failed to parse Excel file.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const { rows } = parseCSV(content);

        if (type === 'revenue' || type === 'all') setRevenueData(mapRevenueData(rows));
        if (type === 'kpi' || type === 'all') setKpiData(mapKPIData(rows));
        if (type === 'budget' || type === 'all') setBudgetData(mapBudgetData(rows));

        alert(`Successfully imported ${rows.length} rows!`);
      };
      reader.readAsText(file);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans relative overflow-x-hidden">
      {/* Premium Orange Header */}
      <div className="bg-[#FF7A30] pb-32 pt-8 px-4 md:px-8 shadow-inner">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-2 bg-white rounded-2xl shadow-xl border border-white/20 flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-extrabold tracking-tighter text-white drop-shadow-md"
              >
                Executive Summary Dashboard
              </motion.h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-orange-50/95">PT Oseanland Indonesia Group</span>
                <span className="text-white/40 text-sm">|</span>
                <p className="text-white/80 text-sm font-medium tracking-wide">Performance overview and strategic insights</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-2.5 pr-12 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm cursor-pointer transition-all"
              >
                <option className="text-slate-900">2023</option>
                <option className="text-slate-900">2024</option>
                <option className="text-slate-900">2025</option>
                <option className="text-slate-900">2026</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none group-hover:text-white transition-colors" />
            </div>

            <div className="relative group">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-2.5 pr-12 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm cursor-pointer transition-all"
              >
                <option className="text-slate-900">All Months</option>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} className="text-slate-900">{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none group-hover:text-white transition-colors" />
            </div>

            <button
              onClick={() => setShowEditPanel(true)}
              className="bg-white/10 hover:bg-white border border-white/20 hover:text-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold backdrop-blur-sm transition-all flex items-center gap-2 shadow-lg"
            >
              <Settings className="w-4 h-4" />
              Manage Data
            </button>

            <button
              onClick={() => {
                setRevenueData(MOCK_REVENUE_DATA.filter(d => d.year === selectedYear));
                alert(`Dashboard updated for ${selectedMonth} ${selectedYear}`);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
          </div>
        </header>

        {lastUpdated && (
          <div className="max-w-7xl mx-auto mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md text-white/90 text-[11px] font-bold rounded-full border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Live Data Source Linked • Last Sync: {lastUpdated}
            </span>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 space-y-8 pb-16">
        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            icon={<Users className="w-5 h-5 text-blue-600" />}
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard
            title="Total Profit"
            value={formatCurrency(stats.totalProfit)}
            icon={<span className="font-bold text-emerald-600 text-lg">Rp</span>}
            trend="+15.2%"
            trendUp={true}
          />
          <StatCard
            title="Margin"
            value={`${stats.margin}%`}
            icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            trend="+2.1%"
            trendUp={true}
          />
          <StatCard
            title="Sales Conversion"
            value={`${stats.conversionRate}%`}
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            trend="+0.8%"
            trendUp={true}
          />
          <StatCard
            title="Customer Satisfaction"
            value={`${stats.customerSatisfaction}/5.0`}
            icon={<MessageSquare className="w-5 h-5 text-amber-600" />}
            trend="+0.2"
            trendUp={true}
          />
        </div>

        {/* Assets Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Inventory Assets"
            value={formatCurrency(stats.totalInventoryAssets)}
            icon={<Box className="w-5 h-5 text-indigo-600" />}
            trend="+5.4%"
            trendUp={true}
          />
          <StatCard
            title="Total Demo Assets"
            value={formatCurrency(stats.totalDemoAssets)}
            icon={<Monitor className="w-5 h-5 text-blue-600" />}
            trend="+2.1%"
            trendUp={true}
          />
          <StatCard
            title="Total Operational Office Assets"
            value={formatCurrency(stats.totalOperationalOfficeAssets)}
            icon={<Building2 className="w-5 h-5 text-slate-600" />}
            trend="+0.8%"
            trendUp={true}
          />
          <StatCard
            title="Best Employee Performance"
            value={stats.bestEmployee}
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend="Top Performer"
            trendUp={true}
          />
          <StatCard
            title="Best Division Performance"
            value={stats.bestDivision}
            icon={<Medal className="w-5 h-5 text-indigo-500" />}
            trend="Highest KPI"
            trendUp={true}
          />
          <StatCard
            title="Best Attendance"
            value={stats.bestAttendance}
            icon={<Clock className="w-5 h-5 text-emerald-500" />}
            trend="100% Present"
            trendUp={true}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" title="Revenue vs Target Performance" subtitle="Monthly actual revenue vs set targets">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 10 }}
                    tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="revenue" name="Actual Revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Budget vs Actual" subtitle="Comparison by category">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} width={80} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#94A3B8" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="actual" name="Actual" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Revenue Growth Rate" subtitle="Quarterly percentage growth">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthRate}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="#10B981" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>


          <Card title="Product Sales Distribution" subtitle="Revenue share by product category">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-1" title="Divisional KPI Progress" subtitle="Realization progress across departments">
            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {kpiData.map((kpi, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate max-w-[200px]">{kpi.division}</span>
                    <span>{kpi.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${kpi.progress}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 }}
                      className={cn(
                        "h-full rounded-full",
                        kpi.progress > 90 ? "bg-emerald-500" :
                          kpi.progress > 75 ? "bg-indigo-500" :
                            "bg-amber-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>


        {/* Financial & Market Analysis Section */}
        <div className="bg-orange-50/50 -mx-4 md:-mx-8 px-4 md:px-8 py-12 border-y border-orange-100/50">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Financial & Market Analysis</h2>
                <p className="text-slate-500 text-sm font-medium">Deep dive into profitability, market position, and liquidity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Net Profit Margin (%)" subtitle="Monthly profitability ratio">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="margin" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Cash Flow Analysis" subtitle="Monthly inflow vs outflow">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip />
                      <Legend iconType="circle" />
                      <Bar dataKey="inflow" name="Cash Inflow" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outflow" name="Cash Outflow" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Market Share" subtitle="Current market position vs competitors">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Market Expansion by Segmentation" subtitle="Sales performance by market segment (Units)">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={segmentationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="segment" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Accounts Receivable Turnover Ratio" subtitle="Efficiency in collecting receivables" className="lg:col-span-2">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={arTurnoverData}>
                      <defs>
                        <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="ratio" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRatio)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Expense Trend */}
        <Card title="Expense Trend" subtitle="Monthly operational costs vs revenue">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>

      {/* Edit Panel Overlay */}
      <AnimatePresence>
        {
          showEditPanel && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditPanel(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Manage Dashboard Data</h2>
                    <p className="text-sm text-slate-500">Update values to see live changes</p>
                  </div>
                  <button
                    onClick={() => setShowEditPanel(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {/* Bulk Import */}
                  <section className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <UploadCloud className="w-5 h-5" />
                      Bulk Import (CSV/Excel)
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label className="w-full flex items-center justify-center p-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-all font-bold shadow-md">
                        <span>Smart Import (Auto-detect Sheets)</span>
                        <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFileUpload(e, 'all')} />
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex flex-col items-center justify-center p-2 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">Monthly</span>
                          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFileUpload(e, 'revenue')} />
                        </label>
                        <label className="flex flex-col items-center justify-center p-2 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">KPI Data</span>
                          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFileUpload(e, 'kpi')} />
                        </label>
                        <label className="flex flex-col items-center justify-center p-2 bg-white border border-indigo-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase">Budget</span>
                          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => handleFileUpload(e, 'budget')} />
                        </label>
                      </div>
                      <p className="text-[10px] text-indigo-400 mt-2 italic text-center">Format: .csv, .xlsx, .xls</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Summary Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Leads</label>
                        <input type="number" value={stats.totalLeads} onChange={(e) => handleStatChange('totalLeads', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Expense (Rp)</label>
                        <input type="number" value={stats.totalExpense} onChange={(e) => handleStatChange('totalExpense', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Profit (Rp)</label>
                        <input type="number" value={stats.totalProfit} onChange={(e) => handleStatChange('totalProfit', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Margin (%)</label>
                        <input type="number" step="0.1" value={stats.margin} onChange={(e) => handleStatChange('margin', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Conversion Rate (%)</label>
                        <input type="number" step="0.1" value={stats.conversionRate} onChange={(e) => handleStatChange('conversionRate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">CSAT Score (0-5)</label>
                        <input type="number" step="0.1" max="5" value={stats.customerSatisfaction} onChange={(e) => handleStatChange('customerSatisfaction', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Asset Management (Rp)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Inventory Assets</label>
                        <input type="number" value={stats.totalInventoryAssets} onChange={(e) => handleStatChange('totalInventoryAssets', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Demo Assets</label>
                        <input type="number" value={stats.totalDemoAssets} onChange={(e) => handleStatChange('totalDemoAssets', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Total Operational Office Assets</label>
                        <input type="number" value={stats.totalOperationalOfficeAssets} onChange={(e) => handleStatChange('totalOperationalOfficeAssets', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Performance Highlights
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Best Employee</label>
                        <input type="text" value={stats.bestEmployee} onChange={(e) => setStats(prev => ({ ...prev, bestEmployee: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Best Division</label>
                        <select value={stats.bestDivision} onChange={(e) => setStats(prev => ({ ...prev, bestDivision: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                          {DIVISIONS.map(div => <option key={div} value={div}>{div}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Best Attendance</label>
                        <input type="text" value={stats.bestAttendance} onChange={(e) => setStats(prev => ({ ...prev, bestAttendance: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Divisional KPI Progress (%)
                    </h3>
                    <div className="space-y-3">
                      {kpiData.map((kpi, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="text-xs font-medium text-slate-600 w-40 truncate">{kpi.division}</span>
                          <input type="range" min="0" max="100" value={kpi.progress} onChange={(e) => handleKpiChange(idx, 'progress', parseInt(e.target.value))} className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                          <span className="text-xs font-bold text-slate-900 w-8">{kpi.progress}%</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Monthly Financials
                    </h3>
                    <div className="space-y-4">
                      {revenueData.map((data, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-4 gap-3 items-end">
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Month</label>
                            <div className="text-sm font-bold text-slate-700">{data.month}</div>
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Revenue</label>
                            <input type="number" value={data.revenue} onChange={(e) => handleRevenueChange(idx, 'revenue', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Target</label>
                            <input type="number" value={data.target} onChange={(e) => handleRevenueChange(idx, 'target', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Expense</label>
                            <input type="number" value={data.expense} onChange={(e) => handleRevenueChange(idx, 'expense', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Budget vs Actual
                    </h3>
                    <div className="space-y-4">
                      {budgetData.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-3 items-end">
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                            <div className="text-xs font-bold text-slate-700 truncate">{item.category}</div>
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Budget</label>
                            <input type="number" value={item.budget} onChange={(e) => handleBudgetChange(idx, 'budget', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Actual</label>
                            <input type="number" value={item.actual} onChange={(e) => handleBudgetChange(idx, 'actual', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Product Distribution (%)
                    </h3>
                    <div className="space-y-3">
                      {productSales.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="text-xs font-medium text-slate-600 w-32 truncate">{product.name}</span>
                          <input type="range" min="0" max="100" value={product.value} onChange={(e) => handleProductChange(idx, parseInt(e.target.value))} className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                          <span className="text-xs font-bold text-slate-900 w-8">{product.value}%</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Quarterly Growth (%)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {growthRate.map((q, idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">{q.period}</label>
                          <input type="number" step="0.1" value={q.rate} onChange={(e) => handleGrowthChange(idx, parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Net Profit Margin (%)
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {profitMarginData.map((data, idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">{data.month}</label>
                          <input type="number" step="0.1" value={data.margin} onChange={(e) => handleProfitMarginChange(idx, parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Cash Flow Analysis
                    </h3>
                    <div className="space-y-4">
                      {cashFlowData.map((data, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 items-end">
                          <div className="col-span-1 text-xs font-bold text-slate-700">{data.month}</div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Inflow</label>
                            <input type="number" value={data.inflow} onChange={(e) => handleCashFlowChange(idx, 'inflow', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Outflow</label>
                            <input type="number" value={data.outflow} onChange={(e) => handleCashFlowChange(idx, 'outflow', parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Market Share (%)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {marketShareData.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</label>
                          <input type="number" value={item.value} onChange={(e) => handleMarketShareChange(idx, parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Market Segmentation
                    </h3>
                    <div className="space-y-3">
                      {segmentationData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="text-xs font-medium text-slate-600 w-32 truncate">{item.segment}</span>
                          <input type="number" value={item.value} onChange={(e) => handleSegmentationChange(idx, parseInt(e.target.value) || 0)} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs flex-1" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      AR Turnover Ratio
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {arTurnoverData.map((data, idx) => (
                        <div key={idx} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">{data.month}</label>
                          <input type="number" step="0.1" value={data.ratio} onChange={(e) => handleArTurnoverChange(idx, parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs" />
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                  <button
                    onClick={() => {
                      saveToDisk();
                      setShowEditPanel(false);
                    }}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save & Persist
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Reset all data?")) {
                        localStorage.removeItem(STORAGE_KEY);
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>(c) 2024 PT Oseanland Indonesia Group. All rights reserved.</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div >
  );
}

function StatCard({ title, value, icon, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full", trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

function Card({ children, title, subtitle, className }: { children: React.ReactNode, title: string, subtitle?: string, className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={cn("bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", className)}>
      <div className="mb-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
