import * as z from 'zod';

export const formSchema = z.object({
   username: z
      .string()
      .min(3, 'Username must be at least 3 characters.')
      .max(10, 'Username must be at most 10 characters.')
      .regex(
         /^[a-zA-Z0-9_]+$/,
         'Username can only contain letters, numbers, and underscores.'
      ),
});

export type FormDemoValues = z.infer<typeof formSchema>;
