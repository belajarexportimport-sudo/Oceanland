/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
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
  MOCK_KPI_DATA, MOCK_REVENUE_DATA, MOCK_PIPELINE_DATA,
  MOCK_PRODUCT_SALES, MOCK_GROWTH_RATE, SUMMARY_STATS,
  DIVISIONS, MOCK_BUDGET_DATA
} from './constants';
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

  // Persistence Logic
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
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      }
    }
  }, []);

  const saveToDisk = () => {
    const data = { kpiData, revenueData, budgetData, productSales, growthRate, stats };
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
          sheetNames.forEach(name => {
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
            }
          });

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
      reader.onload = (event) => {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8 relative overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3"
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                // Fallback in case image fails to load during dev
                e.currentTarget.style.display = 'none';
              }}
            />
            Executive Summary Dashboard
          </motion.h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">PT Oseanland Indonesia Group</span>
            <span className="text-slate-300">|</span>
            <p className="text-slate-500 text-sm">Performance overview and strategic insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowEditPanel(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Manage Data
          </button>

          <button
            onClick={() => {
              // Logic to filter data based on selectedYear
              setRevenueData(MOCK_REVENUE_DATA.filter(d => d.year === selectedYear));
              // Note: KPI and other mock data aren't year-specific yet in MOCK_KPI_DATA 
              // but we can simulate changes or filter if they were.
              alert(`Dashboard updated for year ${selectedYear}`);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
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
            title="Total Expense"
            value={formatCurrency(stats.totalExpense)}
            icon={<DollarSign className="w-5 h-5 text-red-600" />}
            trend="-2.4%"
            trendUp={false}
          />
          <StatCard
            title="Total Profit"
            value={formatCurrency(stats.totalProfit)}
            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
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
        {showEditPanel && (
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
        <p>(c) 2024 Executive Dashboard. All rights reserved.</p>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
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
