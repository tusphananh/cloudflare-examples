'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { SelectSingleEventHandler } from 'react-day-picker';
import PreviewItemDialog from './preview-item';

export interface IDatePickerProps {
  value?: Date;
  onValueChange?: (date?: Date) => void;
  placeholder?: string;
}

export function DatePicker(props: IDatePickerProps) {
  const { value, onValueChange, placeholder = 'Select date' } = props;

  return (
    <PreviewItemDialog
      trigger={
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd/MM/yyyy') : <span>{placeholder}</span>}
        </Button>
      }
      closeBtn
    >
      <div className="flex flex-col gap-4">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onValueChange as SelectSingleEventHandler}
          initialFocus
        />
        <Button
          className="mx-auto"
          onClick={() => {
            if (onValueChange) {
              onValueChange(undefined);
            }
          }}
        >
          Clear
        </Button>
      </div>
    </PreviewItemDialog>
  );
}
