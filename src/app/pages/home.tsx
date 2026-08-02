import { toast } from 'sonner';

import { ThemeToggler } from '@/shared/components/theme-toggler';
import { Button } from '@/shared/components/ui/button';

export default function Home() {
   return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
         <h1 className='text-3xl font-bold underline'>Home Page</h1>
         <Button onClick={() => toast('Okay, That is Enough!!')}>
            Click Me
         </Button>
         <ThemeToggler />
         <SonnerTypes />
      </div>
   );
}

export function SonnerTypes() {
   return (
      <div className='flex flex-wrap gap-2'>
         <Button
            variant='outline'
            onClick={() => toast('Event has been created')}
         >
            Default
         </Button>
         <Button
            variant='outline'
            onClick={() => toast.success('Event has been created')}
         >
            Success
         </Button>
         <Button
            variant='outline'
            onClick={() =>
               toast.info('Be at the area 10 minutes before the event time')
            }
         >
            Info
         </Button>
         <Button
            variant='outline'
            onClick={() =>
               toast.warning('Event start time cannot be earlier than 8am')
            }
         >
            Warning
         </Button>
         <Button
            variant='outline'
            onClick={() => toast.error('Event has not been created')}
         >
            Error
         </Button>
         <Button
            variant='outline'
            onClick={() => {
               toast.promise<{ name: string }>(
                  () =>
                     new Promise((resolve) =>
                        setTimeout(() => resolve({ name: 'Event' }), 2000)
                     ),
                  {
                     loading: 'Loading...',
                     success: (data) => `${data.name} has been created`,
                     error: 'Error',
                  }
               );
            }}
         >
            Promise
         </Button>
      </div>
   );
}
