import * as z from 'zod';

const firstTab = z.object({
   input1: z
      .string()
      .min(3, 'This input field must be at least 3 characters.')
      .max(10, 'This input field must be at most 10 characters.'),
});

const secondTab = z.object({
   input2: z
      .string()
      .min(3, 'This input field must be at least 3 characters.')
      .max(10, 'This input field must be at most 10 characters.'),
});

const thirdTab = z.object({
   input3: z
      .string()
      .min(3, 'This input field must be at least 3 characters.')
      .max(10, 'This input field must be at most 10 characters.'),
});

export const multiTabsFormSchema = z.object({
   ...firstTab.shape,
   ...secondTab.shape,
   ...thirdTab.shape,
});

export type MultiTabsFormValues = z.infer<typeof multiTabsFormSchema>;

// the old way to map fields to tabs
// export const tabSchemas = {
//    'tab-1': firstTab,
//    'tab-2': secondTab,
//    'tab-3': thirdTab,
// } as const;

// export const fieldToTab = Object.fromEntries(
//    Object.entries(tabSchemas).flatMap(([tab, schema]) =>
//       Object.keys(schema.shape).map((field) => [field, tab])
//    )
// ) as Record<keyof MultiTabsFormValues, keyof typeof tabSchemas>;
