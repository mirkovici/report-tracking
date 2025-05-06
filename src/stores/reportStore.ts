import { create } from 'zustand';
import { Report } from '~/lib/ReportService';

interface ReportState {
  reports: Report[];
  search: string;
  filter: string;
  selected: Report | null;
  setReports: (r: Report[] | ((prev: Report[]) => Report[])) => void;
  setSearch: (s: string) => void;
  setFilter: (f: string) => void;
  selectReport: (r: Report | null) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  search: '',
  filter: 'all',
  selected: null,
  setReports: (updater) =>
    set((state) => ({
      reports: typeof updater === 'function' ? updater(state.reports) : updater
    })),
  setSearch: (search) => set({ search }),
  setFilter: (filter) => set({ filter }),
  selectReport: (report) => set({ selected: report }),
}));
