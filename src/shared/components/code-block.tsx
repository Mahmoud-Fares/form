import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type CodeBlockProps = {
   code: string;
   language?: string;
   className?: string;
};

export function CodeBlock({
   code,
   language = 'tsx',
   className,
}: CodeBlockProps) {
   const [copied, setCopied] = useState(false);

   const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div
         className={cn(
            'group relative grid w-full rounded-lg border bg-zinc-950 sm:max-w-4xl',
            className
         )}
      >
         <div className='col-start-1 row-start-1 flex items-start justify-end p-2'>
            <Button
               size='icon'
               variant='ghost'
               className={cn(
                  'sticky top-2 z-10',
                  'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
               )}
               onClick={handleCopy}
            >
               {copied ? (
                  <Check className='h-3.5 w-3.5' />
               ) : (
                  <Copy className='h-3.5 w-3.5' />
               )}
               <span className='sr-only'>Copy code</span>
            </Button>
         </div>

         <div className='col-start-1 row-start-1 overflow-hidden rounded-lg'>
            <Highlight
               theme={themes.nightOwl}
               code={code.trim()}
               language={language}
            >
               {({
                  className: highlightClass,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
               }) => (
                  <pre
                     className={cn(
                        highlightClass,
                        'overflow-x-auto p-4 text-sm leading-relaxed'
                     )}
                     style={style}
                  >
                     {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                           {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                           ))}
                        </div>
                     ))}
                  </pre>
               )}
            </Highlight>
         </div>
      </div>
   );
}
