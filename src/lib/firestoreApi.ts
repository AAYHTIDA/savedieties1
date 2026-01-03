import { CourtCase, CourtCaseFormData, CourtCasesResponse } from '@/types/courtCase';
import { mockCourtCases } from './mockData';

// Court cases API client with local storage
class FirestoreApiClient {
  private cases: CourtCase[] = [...mockCourtCases];

  async getCourtCases(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<CourtCasesResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));

    let cases = [...this.cases];

    if (params.search) {
      const term = params.search.toLowerCase();
      cases = cases.filter(c =>
        c.caseTitle.toLowerCase().includes(term) ||
        c.caseNumber.toLowerCase().includes(term)
      );
    }

    if (params.status && params.status !== 'all') {
      cases = cases.filter(c => c.status.toLowerCase() === params.status?.toLowerCase());
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;

    return {
      cases: cases.slice(start, start + limit),
      pagination: { page, limit, total: cases.length, totalPages: Math.ceil(cases.length / limit) },
    };
  }

  async createCourtCase(data: CourtCaseFormData, file?: File): Promise<{ message: string; id: string }> {
    const newCase: CourtCase = {
      id: Date.now().toString(),
      ...data,
      pdfFileUrl: file ? URL.createObjectURL(file) : undefined,
      pdfFileName: file?.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cases.unshift(newCase);
    return { message: 'Court case created successfully', id: newCase.id };
  }

  async updateCourtCase(id: string, data: CourtCaseFormData, file?: File): Promise<{ message: string }> {
    const index = this.cases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cases[index] = {
        ...this.cases[index],
        ...data,
        pdfFileUrl: file ? URL.createObjectURL(file) : this.cases[index].pdfFileUrl,
        pdfFileName: file?.name || this.cases[index].pdfFileName,
        updatedAt: new Date(),
      };
    }
    return { message: 'Court case updated successfully' };
  }

  async deleteCourtCase(id: string): Promise<{ message: string }> {
    this.cases = this.cases.filter(c => c.id !== id);
    return { message: 'Court case deleted successfully' };
  }

  async seedInitialData(): Promise<void> {}
}

export const firestoreApiClient = new FirestoreApiClient();
