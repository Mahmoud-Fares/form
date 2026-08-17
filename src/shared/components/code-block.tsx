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
            'relative w-full overflow-hidden rounded-lg border bg-zinc-950 sm:max-w-4xl',
            className
         )}
      >
         <Button
            size='icon'
            variant='ghost'
            className='absolute top-2 right-2 h-7 w-7 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
            onClick={handleCopy}
         >
            {copied ? (
               <Check className='h-3.5 w-3.5' />
            ) : (
               <Copy className='h-3.5 w-3.5' />
            )}
            <span className='sr-only'>Copy code</span>
         </Button>

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
   );
}
