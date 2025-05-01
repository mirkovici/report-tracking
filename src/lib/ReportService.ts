export interface Report {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  const STORAGE_KEY = 'reports';
  
  export class ReportService {
    static getAll(): Report[] {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
  
    static saveAll(reports: Report[]) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  
    static list(): Report[] {
      return this.getAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
  
    static search(title: string): Report[] {
      const lower = title.toLowerCase();
      return this.getAll().filter((r) => r.title.toLowerCase().includes(lower));
    }
  
    static getById(id: string): Report | undefined {
      return this.getAll().find((r) => r.id === id);
    }
  
    static create(title: string, content: string): Report {
      const newReport: Report = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const reports = this.getAll();
      reports.push(newReport);
      this.saveAll(reports);
      return newReport;
    }
  
    static update(id: string, title: string, content: string): Report | null {
      const reports = this.getAll();
      const index = reports.findIndex((r) => r.id === id);
  
      if (index === -1) return null;
  
      reports[index] = {
        ...reports[index],
        title,
        content,
        updatedAt: new Date().toISOString(),
      };
  
      this.saveAll(reports);
      return reports[index];
    }
  
    static delete(id: string): boolean {
      const reports = this.getAll();
      const filtered = reports.filter((r) => r.id !== id);
      if (filtered.length === reports.length) return false;
  
      this.saveAll(filtered);
      return true;
    }
  }