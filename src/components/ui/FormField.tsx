import { forwardRef } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  error,
  description,
  className,
  value,
  onChange,
  ...props
}, ref) => {
  const id = `field-${name}`;
  
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}>
        {label}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(error && 'border-destructive')}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          {...props}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(error && 'border-destructive')}
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          {...props}
        />
      )}
      
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';