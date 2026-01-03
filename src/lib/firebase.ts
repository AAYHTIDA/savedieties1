import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
// Firebase Storage imports removed - using local backend instead
import { CourtCase, CourtCaseFormData, CourtCasesResponse, AppUser } from '@/types/courtCase';

const USERS_COLLECTION = 'users';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAbXN9unFCNvTO2HtxFdgZkTA9NMcjJUo",
  authDomain: "diety-204b0.firebaseapp.com",
  projectId: "diety-204b0",
  storageBucket: "diety-204b0.firebasestorage.app",
  messagingSenderId: "1071397904810",
  appId: "1:1071397904810:web:7c157fa97c81ba3f104bd3",
  measurementId: "G-L3ZX67149E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

const CASES_COLLECTION = 'cases';

// Demo cases data to seed the collection
const demoCases: Omit<CourtCase, 'id'>[] = [
  {
    caseTitle: 'Save Deities Temple vs Municipal Corporation',
    caseNumber: 'CWP-2024-001',
    description: 'Petition challenging the demolition notice issued by the municipal corporation for the ancient temple premises.',
    dateFiled: '2024-01-15',
    status: 'Active',
    courtName: 'High Court of Justice',
    judgeName: 'Hon. Justice R.K. Sharma',
    plaintiff: 'Save Deities Temple Trust',
    defendant: 'Municipal Corporation',
    caseType: 'Civil Writ Petition',
    priority: 'High',
    pdfFileUrl: 'https://example.com/case1.pdf',
    pdfFileName: 'Petition_CWP-2024-001.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
    imageName: 'temple1.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    caseTitle: 'Heritage Protection Appeal',
    caseNumber: 'SLP-2024-002',
    description: 'Special Leave Petition for protection of heritage temple structure and surrounding archaeological sites.',
    dateFiled: '2024-02-20',
    status: 'Pending',
    courtName: 'Supreme Court of India',
    judgeName: 'Hon. Justice M.L. Verma',
    plaintiff: 'Heritage Conservation Society',
    defendant: 'State Government',
    caseType: 'Special Leave Petition',
    priority: 'High',
    pdfFileUrl: 'https://example.com/case2.pdf',
    pdfFileName: 'SLP_Heritage_Protection.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    imageName: 'heritage_temple.jpg',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    caseTitle: 'Land Acquisition Compensation',
    caseNumber: 'CA-2024-003',
    description: 'Appeal for fair compensation for temple land acquired for public infrastructure development.',
    dateFiled: '2024-03-10',
    status: 'In Progress',
    courtName: 'District Court',
    judgeName: 'Hon. Justice S.P. Singh',
    plaintiff: 'Temple Management Committee',
    defendant: 'Land Acquisition Officer',
    caseType: 'Civil Appeal',
    priority: 'Medium',
    pdfFileUrl: 'https://example.com/case3.pdf',
    pdfFileName: 'Land_Compensation_Appeal.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
    imageName: 'temple_land.jpg',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    caseTitle: 'Religious Freedom Protection',
    caseNumber: 'PIL-2024-004',
    description: 'Public Interest Litigation for protection of religious practices and freedom of worship at the temple.',
    dateFiled: '2024-04-05',
    status: 'Active',
    courtName: 'High Court of Justice',
    judgeName: 'Hon. Justice A.K. Gupta',
    plaintiff: 'Citizens for Religious Freedom',
    defendant: 'State of Delhi',
    caseType: 'Public Interest Litigation',
    priority: 'High',
    pdfFileUrl: 'https://example.com/case4.pdf',
    pdfFileName: 'Religious_Freedom_PIL.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=300&fit=crop',
    imageName: 'temple_worship.jpg',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    caseTitle: 'Environmental Clearance Challenge',
    caseNumber: 'NGT-2024-005',
    description: 'Challenge to environmental clearance granted for construction activities near the temple complex.',
    dateFiled: '2024-05-18',
    status: 'In Progress',
    courtName: 'National Green Tribunal',
    judgeName: 'Hon. Justice Environmental Panel',
    plaintiff: 'Environmental Protection Group',
    defendant: 'Project Developer',
    caseType: 'Environmental Appeal',
    priority: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
    imageName: 'temple_environment.jpg',
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    caseTitle: 'Archaeological Survey Dispute',
    caseNumber: 'WP-2024-006',
    description: 'Writ petition regarding archaeological survey findings and their impact on temple operations.',
    dateFiled: '2024-06-22',
    status: 'In Court',
    courtName: 'High Court of Justice',
    judgeName: 'Hon. Justice Cultural Heritage Bench',
    plaintiff: 'Archaeological Society',
    defendant: 'Archaeological Survey of India',
    caseType: 'Writ Petition',
    priority: 'Low',
    pdfFileUrl: 'https://example.com/case6.pdf',
    pdfFileName: 'Archaeological_Survey_Dispute.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop',
    imageName: 'temple_archaeology.jpg',
    createdAt: new Date('2024-06-22'),
    updatedAt: new Date('2024-11-30'),
  },
];

// Convert Firestore document to CourtCase
const docToCourtCase = (docSnap: any): CourtCase => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    caseTitle: data.caseTitle,
    caseNumber: data.caseNumber,
    description: data.description,
    dateFiled: data.dateFiled,
    status: data.status,
    courtName: data.courtName,
    judgeName: data.judgeName,
    plaintiff: data.plaintiff,
    defendant: data.defendant,
    caseType: data.caseType,
    priority: data.priority,
    pdfFileUrl: data.pdfFileUrl,
    pdfFileName: data.pdfFileName,
    imageUrl: data.imageUrl,
    imageName: data.imageName,
    images: data.images,
    // Temple location for map
    templeLocation: data.templeLocation,
    isDeleted: data.isDeleted || false,
    deletedAt: data.deletedAt?.toDate?.() || data.deletedAt,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  };
};

// Seed demo cases to Firestore (run once)
export const seedDemoCases = async (): Promise<void> => {
  const casesRef = collection(db, CASES_COLLECTION);
  const snapshot = await getDocs(casesRef);
  
  // Only seed if collection is empty
  if (snapshot.empty) {
    console.log('Seeding demo cases to Firestore...');
    for (const caseData of demoCases) {
      await addDoc(casesRef, {
        ...caseData,
        createdAt: Timestamp.fromDate(caseData.createdAt as Date),
        updatedAt: Timestamp.fromDate(caseData.updatedAt as Date),
      });
    }
    console.log('Demo cases seeded successfully!');
  }
};


// Firebase API Client - Direct Firestore operations
export const firebaseApi = {
  // Get all court cases with filtering, sorting, and pagination
  async getCourtCases(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<CourtCasesResponse> {
    const casesRef = collection(db, CASES_COLLECTION);
    
    // Fetch all cases first, then filter client-side to avoid composite index issues
    const q = query(casesRef, orderBy(params.sortBy || 'createdAt', params.sortOrder || 'desc'));
    const snapshot = await getDocs(q);
    let cases = snapshot.docs.map(docToCourtCase);

    // Filter out soft-deleted cases
    cases = cases.filter(courtCase => !courtCase.isDeleted);

    // Apply status filter (client-side to avoid Firestore composite index requirement)
    if (params.status && params.status !== 'all') {
      console.log('Filtering by status:', params.status);
      console.log('Available statuses in data:', [...new Set(cases.map(c => c.status))]);
      cases = cases.filter(courtCase => courtCase.status === params.status);
      console.log('Cases after filter:', cases.length);
    }

    // Apply search filter (client-side)
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      cases = cases.filter(
        (courtCase) =>
          courtCase.caseTitle.toLowerCase().includes(searchTerm) ||
          courtCase.caseNumber.toLowerCase().includes(searchTerm) ||
          (courtCase.description && courtCase.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCases = cases.slice(startIndex, endIndex);

    return {
      cases: paginatedCases,
      pagination: {
        page,
        limit,
        total: cases.length,
        totalPages: Math.ceil(cases.length / limit),
      },
    };
  },

  // Get single court case by ID
  async getCourtCase(id: string): Promise<CourtCase> {
    const docRef = doc(db, CASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Court case not found');
    }

    return docToCourtCase(docSnap);
  },

  // Create new court case
  async createCourtCase(data: CourtCaseFormData, imageFile?: File, additionalImages?: File[]): Promise<{ message: string; id: string }> {
    const casesRef = collection(db, CASES_COLLECTION);
    
    // Generate a unique case number
    const caseNumber = `CASE-${Date.now()}`;

    let imageUrl: string | undefined;
    let imageName: string | undefined;
    let images: Array<{ url: string; filename: string; uploadedAt: string }> = [];

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    // Upload main image to backend if provided
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('photo', imageFile);
        
        const response = await fetch(`${backendUrl}/api/court-cases/upload`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          imageUrl = result.url;
          imageName = result.filename;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image to server');
      }
    }

    // Upload additional images to backend if provided
    if (additionalImages && additionalImages.length > 0) {
      try {
        const formData = new FormData();
        additionalImages.forEach(file => {
          formData.append('photos', file);
        });
        
        const response = await fetch(`${backendUrl}/api/court-cases/upload-multiple`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          images = result.images.map((img: any) => ({
            url: img.url,
            filename: img.filename,
            uploadedAt: img.uploadedAt
          }));
        } else {
          throw new Error(result.error || 'Failed to upload additional images');
        }
      } catch (error) {
        console.error('Additional images upload error:', error);
        throw new Error('Failed to upload additional images to server');
      }
    }

    // Create the document - exclude undefined fields for Firestore
    const docData: any = {
      caseTitle: data.caseTitle,
      description: data.description || '',
      dateFiled: data.dateFiled,
      status: data.status,
      caseNumber,
      priority: 'Medium',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Add templeLocation if provided
    if (data.templeLocation && data.templeLocation.lat && data.templeLocation.lng) {
      docData.templeLocation = {
        name: data.templeLocation.name || '',
        address: data.templeLocation.address || '',
        lat: data.templeLocation.lat,
        lng: data.templeLocation.lng,
      };
    }
    
    // Only add image fields if they have values
    if (imageUrl) {
      docData.imageUrl = imageUrl;
      docData.imageName = imageName;
    }
    if (images.length > 0) {
      docData.images = images;
    }

    const docRef = await addDoc(casesRef, docData);

    return { message: 'Court case created successfully', id: docRef.id };
  },

  // Update existing court case
  async updateCourtCase(id: string, data: CourtCaseFormData, imageFile?: File, additionalImages?: File[]): Promise<{ message: string }> {
    const docRef = doc(db, CASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Court case not found');
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const existingData = docSnap.data();

    const updateData: any = {
      caseTitle: data.caseTitle,
      description: data.description || '',
      dateFiled: data.dateFiled,
      status: data.status,
      updatedAt: Timestamp.now(),
    };

    // Add templeLocation if provided
    if (data.templeLocation && data.templeLocation.lat && data.templeLocation.lng) {
      updateData.templeLocation = {
        name: data.templeLocation.name || '',
        address: data.templeLocation.address || '',
        lat: data.templeLocation.lat,
        lng: data.templeLocation.lng,
      };
    }

    // Upload new image to backend if provided
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('photo', imageFile);
        
        const response = await fetch(`${backendUrl}/api/court-cases/upload`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          updateData.imageUrl = result.url;
          updateData.imageName = result.filename;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image to server');
      }
    }

    // Upload additional images to backend if provided
    if (additionalImages && additionalImages.length > 0) {
      try {
        const formData = new FormData();
        additionalImages.forEach(file => {
          formData.append('photos', file);
        });
        
        const response = await fetch(`${backendUrl}/api/court-cases/upload-multiple`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          const newImages = result.images.map((img: any) => ({
            url: img.url,
            filename: img.filename,
            uploadedAt: img.uploadedAt
          }));
          // Append new images to existing ones
          const existingImages = existingData.images || [];
          updateData.images = [...existingImages, ...newImages];
        } else {
          throw new Error(result.error || 'Failed to upload additional images');
        }
      } catch (error) {
        console.error('Additional images upload error:', error);
        throw new Error('Failed to upload additional images to server');
      }
    }

    await updateDoc(docRef, updateData);

    return { message: 'Court case updated successfully' };
  },

  // Soft delete court case (move to trash)
  async softDeleteCourtCase(id: string): Promise<{ message: string }> {
    const docRef = doc(db, CASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Court case not found');
    }

    await updateDoc(docRef, {
      isDeleted: true,
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { message: 'Court case moved to trash' };
  },

  // Hard delete court case (permanent)
  async hardDeleteCourtCase(id: string): Promise<{ message: string }> {
    const docRef = doc(db, CASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Court case not found');
    }

    // Note: Local backend images are not automatically deleted
    await deleteDoc(docRef);

    return { message: 'Court case permanently deleted' };
  },

  // Restore court case from trash
  async restoreCourtCase(id: string): Promise<{ message: string }> {
    const docRef = doc(db, CASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Court case not found');
    }

    await updateDoc(docRef, {
      isDeleted: false,
      deletedAt: null,
      updatedAt: Timestamp.now(),
    });

    return { message: 'Court case restored successfully' };
  },

  // Get trashed court cases
  async getTrashedCourtCases(): Promise<CourtCasesResponse> {
    const casesRef = collection(db, CASES_COLLECTION);
    // Use simple query and filter client-side to avoid composite index issues
    const q = query(casesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const allCases = snapshot.docs.map(docToCourtCase);
    // Filter for deleted cases client-side
    const cases = allCases.filter(c => c.isDeleted === true);

    return {
      cases,
      pagination: {
        page: 1,
        limit: cases.length,
        total: cases.length,
        totalPages: 1,
      },
    };
  },

  // Legacy delete (now uses soft delete)
  async deleteCourtCase(id: string): Promise<{ message: string }> {
    return this.softDeleteCourtCase(id);
  },

  // Update status from "Dismissed" to "In Court" (temporary function)
  async updateDismissedToInCourt(): Promise<void> {
    const casesRef = collection(db, CASES_COLLECTION);
    const dismissedQuery = query(casesRef, where('status', '==', 'Dismissed'));
    const snapshot = await getDocs(dismissedQuery);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { status: 'In Court' })
    );
    
    await Promise.all(updatePromises);
    console.log('Updated all "Dismissed" cases to "In Court"');
  },

  // Verify token (for auth compatibility)
  async verifyToken(): Promise<{ user: { uid: string; email: string; admin: boolean } | null }> {
    const user = auth.currentUser;
    if (user) {
      // Check if user is admin (check users collection)
      const userDoc = await this.getUserByEmail(user.email || '');
      const isAdmin = userDoc?.isAdmin || false;
      return {
        user: {
          uid: user.uid,
          email: user.email || '',
          admin: isAdmin,
        },
      };
    }
    return { user: null };
  },

  // ==================== USER MANAGEMENT ====================

  // Create a new user using a secondary Firebase app to avoid logging out the admin
  async createUser(name: string, email: string, password: string): Promise<{ message: string; id: string }> {
    // Import and create a secondary app for user creation
    const { initializeApp, deleteApp } = await import('firebase/app');
    const { getAuth, createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
    
    // Create a secondary app instance
    const secondaryApp = initializeApp({
      apiKey: "AIzaSyCAbXN9unFCNvTO2HtxFdgZkTA9NMcjJUo",
      authDomain: "diety-204b0.firebaseapp.com",
      projectId: "diety-204b0",
    }, 'secondary-' + Date.now());
    
    try {
      const secondaryAuth = getAuth(secondaryApp);
      
      // Create user in Firebase Auth using secondary app
      const userCredential = await createUser(secondaryAuth, email, password);
      
      // Add user to Firestore users collection
      const usersRef = collection(db, USERS_COLLECTION);
      const docRef = await addDoc(usersRef, {
        uid: userCredential.user.uid,
        name,
        email,
        isEnabled: true,
        isAdmin: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return { message: 'User created successfully', id: docRef.id };
    } finally {
      // Clean up the secondary app
      await deleteApp(secondaryApp);
    }
  },

  // Get all users
  async getUsers(): Promise<AppUser[]> {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        isEnabled: data.isEnabled ?? true,
        isAdmin: data.isAdmin ?? false,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    });
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<AppUser | null> {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      isEnabled: data.isEnabled ?? true,
      isAdmin: data.isAdmin ?? false,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    };
  },

  // Toggle user enabled status
  async toggleUserEnabled(userId: string, isEnabled: boolean): Promise<{ message: string }> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      isEnabled,
      updatedAt: Timestamp.now(),
    });
    return { message: isEnabled ? 'User enabled' : 'User disabled' };
  },

  // Check if user is enabled (for login validation)
  async isUserEnabled(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return true; // If user not in collection, allow (might be admin)
    return user.isEnabled;
  },

  // Delete user from Firestore and Firebase Auth
  async deleteUser(userId: string): Promise<{ message: string }> {
    // First get the user to find their Firebase Auth UID
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }
    
    const userData = docSnap.data();
    const authUid = userData.uid;
    
    // Delete from Firebase Auth via backend
    if (authUid) {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/users/${authUid}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        if (!result.success) {
          console.warn('Failed to delete from Firebase Auth:', result.error);
        }
      } catch (error) {
        console.warn('Error deleting from Firebase Auth:', error);
        // Continue to delete from Firestore even if Auth deletion fails
      }
    }
    
    // Delete from Firestore
    await deleteDoc(docRef);
    return { message: 'User deleted successfully' };
  },
};

export default app;
