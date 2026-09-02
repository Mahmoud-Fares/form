import { cn } from '@/shared/lib/utils';

export function Header({ className, ...props }: React.ComponentProps<'h3'>) {
   return (
      <h3 className={cn('leading-none font-semibold', className)} {...props} />
   );
}
