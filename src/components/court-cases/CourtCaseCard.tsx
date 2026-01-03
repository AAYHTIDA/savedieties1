import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowRight } from 'lucide-react';
import { CourtCase } from '@/types/courtCase';

interface CourtCaseCardProps {
  courtCase: CourtCase;
  onEdit?: (courtCase: CourtCase) => void;
  onDelete?: (id: string) => void;
  onDownload?: (courtCase: CourtCase) => void;
  showActions?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in court':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'settled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};



export const CourtCaseCard: React.FC<CourtCaseCardProps> = ({
  courtCase,
  onEdit,
  onDelete,
  onDownload,
  showActions = false,
}) => {
  const navigate = useNavigate();
  


  const handleKnowMore = () => {
    navigate(`/court-cases/${courtCase.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        {courtCase.imageUrl ? (
          <img
            src={courtCase.imageUrl}
            alt={courtCase.caseTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-lg">Image Not Available</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(courtCase.status)}>
            {courtCase.status}
          </Badge>
        </div>

        {/* Admin Actions */}
        {showActions && (
          <div className="absolute top-3 left-3 flex gap-1">
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(courtCase)}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(courtCase.id)}
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Temple Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {courtCase.caseTitle}
        </h3>
        
        {/* Description */}
        {courtCase.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {courtCase.description}
          </p>
        )}

        {/* Know More Button */}
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full"
          onClick={handleKnowMore}
        >
          Know More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};