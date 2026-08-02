import { type ReactNode, createContext, use } from 'react';

import type { UseFormReturn } from 'react-hook-form';

import type { FormDemoValues } from '@/shared/schema';

type ContextType = UseFormReturn<FormDemoValues>;

const Context = createContext<ContextType | null>(null);

type Props = {
   form: ContextType;
   children: ReactNode;
};

export function FormDemoProvider({ children, form }: Props) {
   return <Context value={form}>{children}</Context>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFormDemo() {
   const context = use(Context);

   if (!context)
      throw new Error('useFormDemo must be used within a FormDemoProvider');

   return context;
}
