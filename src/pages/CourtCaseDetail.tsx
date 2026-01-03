import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Scale, 
  User, 
  FileText, 
  Download,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { firebaseApi } from '@/lib/firebase';
import { format } from 'date-fns';

const CourtCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: courtCase, isLoading, error } = useQuery({
    queryKey: ['courtCase', id],
    queryFn: () => firebaseApi.getCourtCase(id!),
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in court':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'settled':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const allImages = React.useMemo(() => {
    if (!courtCase) return [];
    
    const images = [];
    
    // Add main image if exists
    if (courtCase.imageUrl) {
      images.push({
        url: courtCase.imageUrl,
        filename: courtCase.imageName || 'Main Image',
        uploadedAt: courtCase.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        isMain: true
      });
    }
    
    // Add additional images if exists
    if (courtCase.images && courtCase.images.length > 0) {
      images.push(...courtCase.images.map(img => ({ ...img, isMain: false })));
    }
    
    return images;
  }, [courtCase]);

  // Auto-cycle images every 5 seconds
  React.useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex < allImages.length - 1 ? prevIndex + 1 : 0
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [allImages.length]);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < allImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading court case details...</p>
        </div>
      </div>
    );
  }

  if (error || !courtCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                {error?.message || 'Court case not found'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/court-cases')} 
              className="mt-4 w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Court Cases
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/court-cases')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Court Cases
            </Button>
            <Badge className={`${getStatusColor(courtCase.status)} border`}>
              {courtCase.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Images Carousel - Above everything */}
        {allImages.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {/* Main Image Display */}
                  <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={allImages[currentImageIndex].url}
                      alt={allImages[currentImageIndex].filename}
                      className="w-full h-full object-cover cursor-pointer transition-all duration-500"
                      onClick={() => openImageModal(currentImageIndex)}
                    />
                    {allImages.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                        <p className="text-sm">{currentImageIndex + 1} of {allImages.length}</p>
                      </div>
                    )}
                    
                    {/* Navigation arrows */}
                    {allImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentImageIndex(currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    
                    {/* Auto-cycle indicator dots */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {allImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-white' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Title and Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {courtCase.caseTitle}
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Case Number: {courtCase.caseNumber}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-3 h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Date Filed</p>
                      <p className="text-lg">{formatDate(courtCase.dateFiled)}</p>
                    </div>
                  </div>
                  
                  {courtCase.courtName && (
                    <div className="flex items-center text-gray-600">
                      <Scale className="mr-3 h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Court</p>
                        <p className="text-lg">{courtCase.courtName}</p>
                      </div>
                    </div>
                  )}
                  
                  {courtCase.judgeName && (
                    <div className="flex items-center text-gray-600">
                      <User className="mr-3 h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Judge</p>
                        <p className="text-lg">{courtCase.judgeName}</p>
                      </div>
                    </div>
                  )}
                  
                  {courtCase.priority && (
                    <div className="flex items-center text-gray-600">
                      <FileText className="mr-3 h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Priority</p>
                        <p className="text-lg">{courtCase.priority}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {courtCase.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {courtCase.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courtCase.plaintiff && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Plaintiff</p>
                      <p className="text-gray-900">{courtCase.plaintiff}</p>
                    </div>
                  )}
                  
                  {courtCase.defendant && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Defendant</p>
                      <p className="text-gray-900">{courtCase.defendant}</p>
                    </div>
                  )}
                  
                  {courtCase.caseType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Case Type</p>
                      <p className="text-gray-900">{courtCase.caseType}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                    <p className="text-gray-900">
                      {courtCase.createdAt?.toDate ? 
                        format(courtCase.createdAt.toDate(), 'MMMM dd, yyyy at h:mm a') : 
                        'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Documents */}
          <div className="space-y-6">
            {/* Documents */}
            {courtCase.pdfFileUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {courtCase.pdfFileName || 'Case Document'}
                        </p>
                        <p className="text-sm text-gray-500">PDF Document</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(courtCase.pdfFileUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 disabled:opacity-30"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  disabled={selectedImageIndex === allImages.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 disabled:opacity-30"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            <img
              src={allImages[selectedImageIndex].url}
              alt={allImages[selectedImageIndex].filename}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">
                {selectedImageIndex + 1} of {allImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtCaseDetail;