import { z } from 'zod';

const envSchema = z.object({
   MODE: z.enum(['development', 'production', 'test']).default('development'),

   VITE_TEST: z.string().nonempty(),
});

const parseEnv = () => {
   const parsed = envSchema.safeParse(import.meta.env);

   if (!parsed.success) {
      console.error('❌ Invalid environment variables:');
      console.error(parsed.error.flatten().fieldErrors);
      throw new Error('Invalid environment variables');
   }

   return parsed.data;
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
