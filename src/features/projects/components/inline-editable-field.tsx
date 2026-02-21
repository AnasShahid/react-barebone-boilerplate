import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, Edit3, CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export const InlineEditableField = ({ value, type, options, onSave, fieldName, placeholder, displayValue }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(fieldName, currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const handleDateSelect = (selectedDate) => {
    setCurrentValue(selectedDate ? selectedDate.toISOString() : null);
    setIsCalendarOpen(false);
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full">
        {type === 'select' && options && (
          <Select onValueChange={setCurrentValue} defaultValue={currentValue}>
            <SelectTrigger className="h-8 flex-grow">
              <SelectValue placeholder={placeholder || t('common.selectPlaceholder', 'Select...') } />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {type === 'date' && (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`h-8 flex-grow justify-start text-left font-normal ${!currentValue && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentValue ? format(new Date(currentValue), "PPP") : <span>{placeholder || t('common.pickADate', 'Pick a date')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentValue ? new Date(currentValue) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
        {type === 'text' && (
          <Input
            type="text"
            value={currentValue || ''}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="h-8 flex-grow"
            placeholder={placeholder}
          />
        )}
        <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 flex-shrink-0">
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8 flex-shrink-0">
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center group cursor-pointer min-h-[32px] w-full" 
      onClick={() => setIsEditing(true)} 
      onFocus={() => setIsEditing(true)} 
      tabIndex={0} 
    >
      <span className="text-sm font-medium flex-grow">
        {displayValue || (type === 'date' && currentValue ? format(new Date(currentValue), "PPP") : currentValue) || t('common.notSet', 'Not set')}
      </span>
      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
        <Edit3 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};
