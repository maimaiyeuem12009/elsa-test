import { z } from 'zod';

export const questionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  answer: z.enum(['A', 'B', 'C', 'D'])
}).array()