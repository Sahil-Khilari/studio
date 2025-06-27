'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for files upon upload.
 *
 * - suggestTags - A function that takes file content and suggests relevant tags.
 * - SuggestTagsInput - The input type for the suggestTags function, containing the file content.
 * - SuggestTagsOutput - The output type for the suggestTags function, containing an array of suggested tags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  fileContent: z
    .string()
    .describe('The content of the file for which to suggest tags.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the file.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant tags for files based on their content.

  Analyze the content provided and suggest 5-10 tags that would be most helpful for categorizing and finding the file later.
  The tags should be comma separated.

  File Content: {{{fileContent}}}`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
