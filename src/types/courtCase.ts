export interface CourtCase {
  id: string;
  caseTitle: string;
  caseNumber: string;
  description?: string;
  dateFiled: string;
  status: string;
  courtName?: string;
  judgeName?: string;
  plaintiff?: string;
  defendant?: string;
  caseType?: string;
  priority: string;
  pdfFileUrl?: string;
  pdfFileName?: string;
  imageUrl?: string;
  imageName?: string;
  // Temple location for map
  templeLocation?: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  };
  // Multiple images support
  images?: Array<{
    url: string;
    filename: string;
    uploadedAt: string;
  }>;
  // Soft delete support
  isDeleted?: boolean;
  deletedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface CourtCaseFormData {
  caseTitle: string;
  description?: string;
  dateFiled: string;
  status: string;
  templeLocation?: {
    name?: string;
    address?: string;
    lat: number;
    lng: number;
  };
}

export interface CourtCasesResponse {
  cases: CourtCase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User management types
export interface AppUser {
  id: string;
  name: string;
  email: string;
  isEnabled: boolean;
  isAdmin: boolean;
  createdAt: any;
  updatedAt: any;
}