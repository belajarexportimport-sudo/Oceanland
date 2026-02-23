/**
 * Data Parsing Utilities for Dashboard (CSV & Excel)
 */
import * as XLSX from 'xlsx';

export const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });
    return { headers, rows };
};

export const parseExcel = (file: File): Promise<{ [sheetName: string]: any[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const result: { [sheetName: string]: any[] } = {};

                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                });

                resolve(result);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

export const mapRevenueData = (rows: any[]) => {
    return rows.map(row => ({
        month: row.month || row.Month || 'Jan',
        revenue: parseInt(row.revenue || row.Revenue) || 0,
        target: parseInt(row.target || row.Target) || 0,
        expense: parseInt(row.expense || row.Expense) || 0
    }));
};

export const mapKPIData = (rows: any[]) => {
    return rows.map(row => ({
        division: row.division || row.Division || 'Unknown',
        progress: parseInt(row.progress || row.Progress) || 0,
        target: 100,
        actual: parseInt(row.actual || row.Actual) || 0
    }));
};

export const mapBudgetData = (rows: any[]) => {
    return rows.map(row => ({
        category: row.category || row.Category || 'Other',
        budget: parseInt(row.budget || row.Budget) || 0,
        actual: parseInt(row.actual || row.Actual) || 0
    }));
};

export const mapPipelineData = (rows: any[]) => {
    return rows.map(row => ({
        stage: row.stage || row.Stage || 'Unknown',
        value: parseInt(row.value || row.Value) || 0,
        count: parseInt(row.count || row.Count) || 0
    }));
};

export const mapArTurnoverData = (rows: any[]) => {
    return rows.map(row => ({
        month: row.month || row.Month || 'Jan',
        ratio: parseFloat(row.ratio || row.Ratio) || 0
    }));
};
