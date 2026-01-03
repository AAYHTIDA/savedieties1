import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Scale, LogOut, User } from 'lucide-react';
import { CourtCaseCard } from '@/components/court-cases/CourtCaseCard';
import { CourtCaseForm } from '@/components/court-cases/CourtCaseForm';
import { CourtCaseFilters } from '@/components/court-cases/CourtCaseFilters';
import { CourtCasesPagination } from '@/components/court-cases/CourtCasesPagination';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseApi } from '@/lib/firebase';
import { CourtCase, CourtCaseFormData } from '@/types/courtCase';
import { toast } from 'sonner';

export default function CourtCases() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // State for modals
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<CourtCase | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  // Fetch court cases
  const {
    data: courtCasesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courtCases', page, limit, search, status, sortBy, sortOrder],
    queryFn: () =>
      firebaseApi.getCourtCases({
        page,
        limit,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        sortBy,
        sortOrder,
      }),
    refetchInterval: 30000,
  });

  // Create court case mutation
  const createMutation = useMutation({
    mutationFn: ({ data, imageFile }: { data: CourtCaseFormData; imageFile?: File }) =>
      firebaseApi.createCourtCase(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courtCases'] });
      setShowForm(false);
      toast.success('Court case created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create court case');
    },
  });

  // Update court case mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
      imageFile,
    }: {
      id: string;
      data: CourtCaseFormData;
      imageFile?: File;
    }) => firebaseApi.updateCourtCase(id, data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courtCases'] });
      setShowForm(false);
      setEditingCase(null);
      toast.success('Court case updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update court case');
    },
  });

  // Delete court case mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => firebaseApi.deleteCourtCase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courtCases'] });
      toast.success('Court case deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete court case');
    },
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, sortBy, sortOrder]);

  const handleFormSubmit = async (data: CourtCaseFormData, imageFile?: File) => {
    if (editingCase) {
      await updateMutation.mutateAsync({ id: editingCase.id, data, imageFile });
    } else {
      await createMutation.mutateAsync({ data, imageFile });
    }
  };

  const handleEdit = (courtCase: CourtCase) => {
    setEditingCase(courtCase);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this court case?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (courtCase: CourtCase) => {
    if (courtCase.pdfFileUrl) {
      window.open(courtCase.pdfFileUrl, '_blank');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCase(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Court Cases</h1>
                <p className="text-sm text-gray-500">Manage court case records</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                    {isAdmin && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button variant="outline" onClick={logout} size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowLogin(true)} size="sm">
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {courtCasesData?.pagination.total || 0} Court Cases
            </h2>
            <p className="text-gray-600">
              Browse and manage court case records
            </p>
          </div>
          
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New Case
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CourtCaseFilters
            search={search}
            status={status}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Failed to load court cases. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {/* Court Cases Grid */}
        {courtCasesData && (
          <>
            {courtCasesData.cases.length === 0 ? (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No court cases found
                </h3>
                <p className="text-gray-600 mb-4">
                  {search || status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first court case'}
                </p>
                {isAdmin && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Case
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {courtCasesData.cases.map((courtCase) => (
                    <CourtCaseCard
                      key={courtCase.id}
                      courtCase={courtCase}
                      onEdit={isAdmin ? handleEdit : undefined}
                      onDelete={isAdmin ? handleDelete : undefined}
                      onDownload={handleDownload}
                      showActions={isAdmin}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <CourtCasesPagination
                  currentPage={page}
                  totalPages={courtCasesData.pagination.totalPages}
                  totalItems={courtCasesData.pagination.total}
                  itemsPerPage={limit}
                  onPageChange={setPage}
                  onItemsPerPageChange={setLimit}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCase ? 'Edit Court Case' : 'Add New Court Case'}
            </DialogTitle>
          </DialogHeader>
          <CourtCaseForm
            courtCase={editingCase || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md">
          <LoginForm onSuccess={() => setShowLogin(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}