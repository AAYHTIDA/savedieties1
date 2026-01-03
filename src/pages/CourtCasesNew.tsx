import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Scale, LogOut, User, Home, ChevronRight, FileText, Edit, Trash2, Search, Trash, RotateCcw, AlertTriangle, Users } from 'lucide-react';
import { CourtCaseForm } from '@/components/court-cases/CourtCaseForm';
import { CourtCasesMap } from '@/components/court-cases/CourtCasesMap';
import { LoginForm } from '@/components/auth/LoginForm';
import { UserLoginForm } from '@/components/auth/UserLoginForm';
import { UserManagement } from '@/components/auth/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseApi } from '@/lib/firebase';
import { CourtCase, CourtCaseFormData } from '@/types/courtCase';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Court Case Card Component with image carousel
const CourtCaseCardNew: React.FC<{
  courtCase: CourtCase;
  onEdit?: (courtCase: CourtCase) => void;
  onDelete?: (id: string) => void;
  onDownload?: (courtCase: CourtCase) => void;
  onKnowMore?: (courtCase: CourtCase) => void;
  showActions?: boolean;
}> = ({ courtCase, onEdit, onDelete, onDownload, onKnowMore, showActions }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine main image and additional images
  const allImages = React.useMemo(() => {
    const images: string[] = [];
    if (courtCase.imageUrl) {
      images.push(courtCase.imageUrl);
    }
    if (courtCase.images && courtCase.images.length > 0) {
      images.push(...courtCase.images.map(img => img.url));
    }
    return images;
  }, [courtCase.imageUrl, courtCase.images]);

  const hasMultipleImages = allImages.length > 1;

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    if (!hasMultipleImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, allImages.length]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: string) => {
    return status;
  };

  return (
    <div className="bg-orange-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm mx-auto h-full flex flex-col">
      {/* Image Section with Carousel */}
      <div className="relative h-64 bg-gray-100 flex-shrink-0">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {getStatusText(courtCase.status)}
          </span>
        </div>

        {allImages.length > 0 ? (
          <>
            {/* Current Image */}
            <img
              src={allImages[currentImageIndex]}
              alt={courtCase.caseTitle}
              className="w-full h-full object-cover"
            />
            
            {/* Carousel Indicators - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allImages.map((_, index) => (
                    <span
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                  {currentImageIndex + 1}/{allImages.length}
                </div>
              </>
            )}
          </>
        ) : (
          /* Fallback with Om Pattern */
          <div className="relative bg-red-600 h-full flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-8xl text-red-800 font-bold select-none">ॐ</div>
              </div>
              <div className="absolute top-6 left-6 text-3xl text-red-800 font-bold select-none">ॐ</div>
              <div className="absolute top-6 right-6 text-3xl text-red-800 font-bold select-none">ॐ</div>
              <div className="absolute bottom-6 left-6 text-3xl text-red-800 font-bold select-none">ॐ</div>
              <div className="absolute bottom-6 right-6 text-3xl text-red-800 font-bold select-none">ॐ</div>
            </div>
            <div className="relative z-10 text-center">
              <div className="text-red-300 text-lg font-medium">Image Not Available</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Cream Section */}
      <div className="bg-orange-50 p-6 flex-1 flex flex-col">
        <h3 className="text-gray-800 font-bold text-lg mb-3 line-clamp-2">{courtCase.caseTitle}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {courtCase.description || `Case filed on ${formatDate(courtCase.dateFiled)} regarding ${courtCase.caseType || 'legal proceedings'}.`}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <Button
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
            onClick={() => onKnowMore && onKnowMore(courtCase)}
          >
            Know More
            <ChevronRight className="h-4 w-4" />
          </Button>

          {showActions && (
            <div className="flex gap-2">
              {courtCase.pdfFileUrl && (
                <Button variant="ghost" size="sm" onClick={() => onDownload?.(courtCase)} className="text-gray-600 hover:text-orange-600 h-8 w-8 p-0" title="Download PDF">
                  <FileText className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(courtCase)} className="text-gray-600 hover:text-orange-600 h-8 w-8 p-0" title="Edit Case">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(courtCase.id)} className="text-gray-600 hover:text-red-600 h-8 w-8 p-0" title="Delete Case">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CourtCases() {
  const { user, isAdmin, isUser, logout, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [district, setDistrict] = useState('all');
  const [caseStudy, setCaseStudy] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<CourtCase | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const { data: courtCasesData, isLoading, error, refetch } = useQuery({
    queryKey: ['courtCases', page, limit, search, status, district, caseStudy],
    queryFn: () => {
      console.log('Fetching court cases with filters:', { 
        page, 
        limit, 
        search: search || undefined, 
        status: status !== 'all' ? status : undefined 
      });
      return firebaseApi.getCourtCases({ 
        page, 
        limit, 
        search: search || undefined, 
        status: status !== 'all' ? status : undefined,
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
    },
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: ({ data, file, additionalImages }: { data: CourtCaseFormData; file?: File; additionalImages?: File[] }) => firebaseApi.createCourtCase(data, file, additionalImages),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courtCases'] }); setShowForm(false); toast.success('Court case created successfully'); },
    onError: (error: any) => { toast.error(error.message || 'Failed to create court case'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data, file, additionalImages }: { id: string; data: CourtCaseFormData; file?: File; additionalImages?: File[] }) => firebaseApi.updateCourtCase(id, data, file, additionalImages),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['courtCases'] }); setShowForm(false); setEditingCase(null); toast.success('Court case updated successfully'); },
    onError: (error: any) => { toast.error(error.message || 'Failed to update court case'); },
  });

  const softDeleteMutation = useMutation({
    mutationFn: (id: string) => firebaseApi.softDeleteCourtCase(id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['courtCases'] }); 
      queryClient.invalidateQueries({ queryKey: ['trashedCases'] });
      toast.success('Court case moved to trash'); 
    },
    onError: (error: any) => { toast.error(error.message || 'Failed to move court case to trash'); },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (id: string) => firebaseApi.hardDeleteCourtCase(id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['courtCases'] }); 
      queryClient.invalidateQueries({ queryKey: ['trashedCases'] });
      toast.success('Court case permanently deleted'); 
    },
    onError: (error: any) => { toast.error(error.message || 'Failed to delete court case'); },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => firebaseApi.restoreCourtCase(id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['courtCases'] }); 
      queryClient.invalidateQueries({ queryKey: ['trashedCases'] });
      toast.success('Court case restored successfully'); 
    },
    onError: (error: any) => { toast.error(error.message || 'Failed to restore court case'); },
  });

  const { data: trashedCasesData, isLoading: isLoadingTrash } = useQuery({
    queryKey: ['trashedCases'],
    queryFn: () => firebaseApi.getTrashedCourtCases(),
    enabled: isAdmin,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, district, caseStudy]);

  const handleFormSubmit = async (data: CourtCaseFormData, file?: File, additionalImages?: File[]) => {
    if (editingCase) { await updateMutation.mutateAsync({ id: editingCase.id, data, file, additionalImages }); }
    else { await createMutation.mutateAsync({ data, file, additionalImages }); }
  };

  const handleEdit = (courtCase: CourtCase) => { setEditingCase(courtCase); setShowForm(true); };
  const handleDeleteClick = (id: string) => { setDeletingCaseId(id); setShowDeleteDialog(true); };
  const handleSoftDelete = () => { if (deletingCaseId) { softDeleteMutation.mutate(deletingCaseId); setShowDeleteDialog(false); setDeletingCaseId(null); } };
  const handleHardDelete = () => { if (deletingCaseId) { hardDeleteMutation.mutate(deletingCaseId); setShowDeleteDialog(false); setDeletingCaseId(null); } };
  const handleRestore = (id: string) => { restoreMutation.mutate(id); };
  const handlePermanentDeleteFromTrash = (id: string) => { if (window.confirm('Are you sure you want to permanently delete this case? This cannot be undone.')) { hardDeleteMutation.mutate(id); } };
  const handleDownload = (courtCase: CourtCase) => { if (courtCase.pdfFileUrl) { window.open(courtCase.pdfFileUrl, '_blank'); } };
  const handleKnowMore = (courtCase: CourtCase) => { navigate(`/court-cases/${courtCase.id}`); };
  const handleCloseForm = () => { setShowForm(false); setEditingCase(null); };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-orange-50"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-orange-600">SaveDeities</h1>
                  <p className="text-sm text-gray-600">देवा: सत्य: हरिदेवा:</p>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
              <div className="text-gray-700 hover:text-orange-600">Our Seva</div>
              <div className="text-orange-600 font-medium">Media Centre</div>
              <div className="text-gray-700 hover:text-orange-600">About Us</div>
              <div className="text-gray-700 hover:text-orange-600">Contact Us</div>
              <div className="text-gray-700 hover:text-orange-600">Contribute</div>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                    {isAdmin && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Admin</span>}
                  </div>
                  {isAdmin && (
                    <Button variant="outline" onClick={() => setShowUserManagement(true)} size="sm">
                      <Users className="h-4 w-4 mr-2" />Manage Users
                    </Button>
                  )}
                  <Button variant="outline" onClick={logout} size="sm"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={() => setShowUserLogin(true)} size="sm" variant="outline">User Login</Button>
                  <Button onClick={() => setShowLogin(true)} size="sm" className="bg-orange-600 hover:bg-orange-700">Admin Login</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-orange-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-600">Media Centre</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-orange-600 font-medium">Court Cases</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Court Cases</h1>
        </div>

        {/* Search Bar and Clear Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search court cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setStatus('all');
                setDistrict('all');
                setCaseStudy('all');
              }}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Court">In Court</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Settled">Settled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose District</label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger><SelectValue placeholder="All Districts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="thiruvananthapuram">Thiruvananthapuram</SelectItem>
                <SelectItem value="kollam">Kollam</SelectItem>
                <SelectItem value="pathanamthitta">Pathanamthitta</SelectItem>
                <SelectItem value="alappuzha">Alappuzha</SelectItem>
                <SelectItem value="kottayam">Kottayam</SelectItem>
                <SelectItem value="idukki">Idukki</SelectItem>
                <SelectItem value="ernakulam">Ernakulam</SelectItem>
                <SelectItem value="thrissur">Thrissur</SelectItem>
                <SelectItem value="palakkad">Palakkad</SelectItem>
                <SelectItem value="malappuram">Malappuram</SelectItem>
                <SelectItem value="kozhikode">Kozhikode</SelectItem>
                <SelectItem value="wayanad">Wayanad</SelectItem>
                <SelectItem value="kannur">Kannur</SelectItem>
                <SelectItem value="kasaragod">Kasaragod</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <Select value={caseStudy} onValueChange={setCaseStudy}>
              <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {/* <SelectItem value="heritage">Completed</SelectItem>
                <SelectItem value="land">In Court</SelectItem>
                <SelectItem value="religious">In Progress</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          {(isAdmin || isUser) && (
            <div className="flex items-end gap-2">
              <Button onClick={() => setShowForm(true)} className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />Add New Case
              </Button>
              {isAdmin && (
                <Button onClick={() => setShowTrash(true)} variant="outline" className="relative">
                  <Trash className="h-4 w-4" />
                  {trashedCasesData && trashedCasesData.cases.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {trashedCasesData.cases.length}
                    </span>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Google Maps Section */}
        {courtCasesData && courtCasesData.cases.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Case Locations Map</label>
            <CourtCasesMap 
              cases={courtCasesData.cases} 
              onCaseClick={(courtCase) => handleKnowMore(courtCase)}
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>Failed to load court cases. <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">Retry</Button></AlertDescription>
          </Alert>
        )}

        {isLoading && <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>}

        {courtCasesData && (
          <>
            {/* Results indicator */}
            <div className="mb-4 text-sm text-gray-600">
              {courtCasesData.pagination.total > 0 ? (
                <>
                  Showing {courtCasesData.cases.length} of {courtCasesData.pagination.total} court cases
                  {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') && (
                    <span className="ml-2 text-orange-600 font-medium">
                      (filtered)
                    </span>
                  )}
                </>
              ) : (
                'No court cases found'
              )}
            </div>

            {courtCasesData.cases.length === 0 ? (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') 
                    ? 'No court cases match your filters' 
                    : 'No court cases found'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') 
                    ? 'Try adjusting your search criteria or clear the filters' 
                    : 'Get started by adding your first court case'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearch('');
                        setStatus('all');
                        setDistrict('all');
                        setCaseStudy('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  {(isAdmin || isUser) && (
                    <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                      <Plus className="h-4 w-4 mr-2" />
                      {(search || status !== 'all' || district !== 'all' || caseStudy !== 'all') ? 'Add New Case' : 'Add First Case'}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 auto-rows-fr">
                  {courtCasesData.cases.map((courtCase) => (
                    <CourtCaseCardNew 
                      key={courtCase.id}
                      courtCase={courtCase} 
                      onEdit={(isAdmin || isUser) ? handleEdit : undefined} 
                      onDelete={isAdmin ? handleDeleteClick : undefined} 
                      onDownload={handleDownload} 
                      onKnowMore={handleKnowMore} 
                      showActions={isAdmin || isUser} 
                    />
                  ))}
                </div>
                {courtCasesData.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {courtCasesData.pagination.totalPages}</span>
                    <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page === courtCasesData.pagination.totalPages}>Next</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingCase ? 'Edit Court Case' : 'Add New Court Case'}</DialogTitle></DialogHeader>
          <CourtCaseForm courtCase={editingCase || undefined} onSubmit={handleFormSubmit} onCancel={handleCloseForm} isLoading={createMutation.isPending || updateMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md"><LoginForm onSuccess={() => setShowLogin(false)} /></DialogContent>
      </Dialog>

      <Dialog open={showUserLogin} onOpenChange={setShowUserLogin}>
        <DialogContent className="max-w-md"><UserLoginForm onSuccess={() => setShowUserLogin(false)} /></DialogContent>
      </Dialog>

      <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <UserManagement onClose={() => setShowUserManagement(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Delete Court Case
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">How would you like to delete this court case?</p>
            <div className="space-y-3">
              <Button
                onClick={handleSoftDelete}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                disabled={softDeleteMutation.isPending}
              >
                <div className="flex items-start gap-3">
                  <Trash className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Move to Trash</div>
                    <div className="text-sm text-gray-500">Case can be restored later from the Trash</div>
                  </div>
                </div>
              </Button>
              <Button
                onClick={handleHardDelete}
                variant="outline"
                className="w-full justify-start h-auto py-3 border-red-200 hover:bg-red-50"
                disabled={hardDeleteMutation.isPending}
              >
                <div className="flex items-start gap-3">
                  <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium text-red-600">Delete Permanently</div>
                    <div className="text-sm text-gray-500">This action cannot be undone</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trash Dialog */}
      <Dialog open={showTrash} onOpenChange={setShowTrash}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5" />
              Trash ({trashedCasesData?.cases.length || 0} items)
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoadingTrash ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : trashedCasesData?.cases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Trash is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trashedCasesData?.cases.map((courtCase) => (
                  <div key={courtCase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {courtCase.imageUrl ? (
                        <img src={courtCase.imageUrl} alt={courtCase.caseTitle} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Scale className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{courtCase.caseTitle}</h4>
                        <p className="text-sm text-gray-500">Deleted {courtCase.deletedAt ? format(new Date(courtCase.deletedAt), 'MMM dd, yyyy') : 'recently'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(courtCase.id)}
                        disabled={restoreMutation.isPending}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePermanentDeleteFromTrash(courtCase.id)}
                        disabled={hardDeleteMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}