'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for files.
 *
 * - suggestTagsFlow - A function that takes a file name and an optional description and suggests relevant tags.
 * - SuggestTagsInput - The input type for the suggestTagsFlow function.
 * - SuggestTagsOutput - The output type for the suggestTagsFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit/zod';

export const SuggestTagsInputSchema = z.object({
  fileName: z.string().describe('The name of the file.'),
  description: z.string().optional().describe('An optional user-provided description of the file.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

export const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of 3-5 suggested tags for the file. Tags should be concise, relevant, and in lowercase.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant that helps users organize their cloud drive by suggesting relevant tags for their files.

Analyze the file name and its description (if provided) to generate 3-5 concise, relevant, and lowercase tags.

File Name: {{{fileName}}}
{{#if description}}
Description: {{{description}}}
{{/if}}

Generate tags that will be useful for searching and filtering. For example, if a file is named "q3-sales-report.pdf", good tags would be "sales", "report", "q3".`,
});


export const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async (input) => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
