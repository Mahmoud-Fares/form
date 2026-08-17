import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

export function PageWrapper({ className, ...props }: ComponentProps<'div'>) {
   return (
      <div
         className={cn(
            'flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8',
            className
         )}
         {...props}
      />
   );
}
