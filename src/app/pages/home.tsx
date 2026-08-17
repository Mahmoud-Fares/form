import { Dot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
   return (
      <div className='p-3'>
         <ul className='flex flex-col gap-4'>
            <li className='flex items-center gap-2'>
               <Dot />
               <Link to='/text'>Text</Link>
            </li>
         </ul>
      </div>
   );
}
