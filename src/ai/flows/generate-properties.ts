// Use server directive.
'use server';

/**
 * @fileOverview AI agent that generates a list of Monopoly board properties based on a given theme.
 *
 * - generateProperties - A function that generates the properties for the board.
 * - GeneratePropertiesInput - The input type for the generateProperties function.
 * - GeneratePropertiesOutput - The return type for the generateProperties function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertiesInputSchema = z.object({
  theme: z.string().describe('The theme for the Monopoly board (e.g., Kansas City).'),
});
export type GeneratePropertiesInput = z.infer<typeof GeneratePropertiesInputSchema>;

const GeneratePropertiesOutputSchema = z.object({
  properties: z.array(
    z.object({
      name: z.string().describe('The name of the property.'),
      group: z.string().describe('The group the property belongs to (e.g., Brown, Light Blue).'),
      color: z.string().describe('The color associated with the property group.'),
    })
  ).describe('A list of properties for the Monopoly board, grouped by likeness and color.'),
});
export type GeneratePropertiesOutput = z.infer<typeof GeneratePropertiesOutputSchema>;

export async function generateProperties(input: GeneratePropertiesInput): Promise<GeneratePropertiesOutput> {
  return generatePropertiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertiesPrompt',
  input: {schema: GeneratePropertiesInputSchema},
  output: {schema: GeneratePropertiesOutputSchema},
  prompt: `You are an expert Monopoly board game designer.

You will generate a list of properties for a Monopoly board based on the given theme.
The properties should be grouped by likeness, similar to the original Monopoly game.
Each group should have a distinct color associated with it.

Theme: {{{theme}}}

Generate a list of properties, grouped by likeness and assigned distinct colors, mimicking the Monopoly board structure.
`,
});

const generatePropertiesFlow = ai.defineFlow(
  {
    name: 'generatePropertiesFlow',
    inputSchema: GeneratePropertiesInputSchema,
    outputSchema: GeneratePropertiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
