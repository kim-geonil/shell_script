import { FileText, Clock, User, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { cn } from '../../utils/cn';

export interface ScriptCardProps {
  id: string;
  title: string;
  description?: string;
  type: 'U-102' | 'U-103' | 'U-106' | 'U-107' | 'U-301';
  status: 'draft' | 'completed' | 'in-progress' | 'failed';
  lastModified: string;
  author: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const typeColors = {
  'U-102': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'U-103': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'U-106': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'U-107': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'U-301': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

export function ScriptCard({
  id,
  title,
  description,
  type,
  status,
  lastModified,
  author,
  onEdit,
  onDelete,
  onDuplicate,
  className,
}: ScriptCardProps) {
  const handleEdit = () => onEdit?.(id);
  const handleDelete = () => onDelete?.(id);
  const handleDuplicate = () => onDuplicate?.(id);

  return (
    <Card className={cn('group hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h3 className="font-medium truncate">{title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={typeColors[type]}>
            {type}
          </Badge>
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      {description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="pt-3 text-xs text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{lastModified}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}