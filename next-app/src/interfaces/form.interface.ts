import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface IFormComponent<T extends FieldValues = any> {
  methods: UseFormReturn<T>;
  className?: string;
}
