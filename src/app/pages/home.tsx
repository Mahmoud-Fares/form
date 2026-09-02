import { Dot } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';

export default function Home() {
   return (
      <div className='p-3'>
         <ul className='flex flex-col gap-4'>
            <Item>
               <Link to='/text'>Text</Link>
            </Item>

            <Item>
               <Link to='/schedule'>Schedule</Link>
            </Item>

            <Item>
               <Link to='/checkbox'>Checkbox</Link>
            </Item>

            <Item>
               <Link to='/multi-tabs'>Multi Tabs</Link>
            </Item>

            <Item>
               <Link to='/date-picker'>Date Picker</Link>
            </Item>
         </ul>
      </div>
   );
}

function Item({ children, className, ...props }: React.ComponentProps<'li'>) {
   return (
      <li className={cn('flex items-center gap-2', className)} {...props}>
         <Dot />

         {children}
      </li>
   );
}
