import OpenAI from "openai";
import { searchResponseSchema, type SearchResponse } from "@shared/schema";
import { OPENAI_API_KEY } from "./config";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const DENTAL_IMAGES = {
	procedures: [
		{
			url: "https://images.unsplash.com/photo-1468493858157-0da44aaf1d13",
			credit: "Peter Kasprzyk",
		},
		{
			url: "https://images.unsplash.com/photo-1522849696084-818b29dfe210",
			credit: "Umanoide",
		},
		{
			url: "https://images.unsplash.com/photo-1564420228450-d9a5bc8d6565",
			credit: "Candid",
		},
		{
			url: "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2",
			credit: "Lesly Juarez",
		},
		{
			url: "https://images.unsplash.com/photo-1525893277997-207c04d47d65",
			credit: "Matthew Poetker",
		},
		{
			url: "https://images.unsplash.com/photo-1612283105859-6e2585710acd",
			credit: "Diana Polekhina",
		},
	],
	symptoms: [
		{
			url: "https://images.unsplash.com/photo-1468493858157-0da44aaf1d13",
			credit: "Peter Kasprzyk",
		},
		{
			url: "https://images.unsplash.com/photo-1522849696084-818b29dfe210",
			credit: "Umanoide",
		},
		{
			url: "https://images.unsplash.com/photo-1564420228450-d9a5bc8d6565",
			credit: "Candid",
		},
		{
			url: "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2",
			credit: "Lesly Juarez",
		},
	],
};

export async function getDentalInformation(
	query: string
): Promise<SearchResponse> {
	try {
		console.log("Starting getDentalInformation with query:", query);

		if (!process.env.OPENAI_API_KEY) {
			throw new Error("OpenAI API key is missing");
		}

		console.log("Sending request to OpenAI API...");
		const response = await openai.chat.completions.create({
			model: "gpt-4-turbo-preview",
			messages: [
				{
					role: "system",
					content: `You are a dental health expert. Provide detailed, accurate information about dental conditions, treatments, and diagnostic steps. Format your response as JSON with the following structure:
          {
            "description": "A detailed explanation of the condition or query",
            "treatments": ["List of recommended treatments"],
            "medicines": ["List of relevant medications"],
            "diagnosticSteps": [
              {
                "step": "Name of diagnostic step",
                "description": "Detailed explanation of how to perform the diagnostic check",
                "warning": "Optional warning message for this step",
                "severity": "low|medium|high"
              }
            ],
            "references": [{"title": "Reference title", "url": "URL to reputable dental health resource"}]
          }

          For any symptom or condition query, always include specific diagnostic steps that can help identify the issue.
          Each diagnostic step should be clear, actionable, and include any relevant warnings or precautions.
          Severity levels should be assigned based on the potential risks involved in the diagnostic process.`,
				},
				{
					role: "user",
					content: query,
				},
			],
			response_format: { type: "json_object" },
			temperature: 0.7,
			max_tokens: 1000,
		});

		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw new Error("Empty response from OpenAI");
		}

		const rawResponse = JSON.parse(content);

		const imageSet =
			query.toLowerCase().includes("treatment") ||
			query.toLowerCase().includes("procedure")
				? DENTAL_IMAGES.procedures
				: DENTAL_IMAGES.symptoms;
		const randomImage = imageSet[Math.floor(Math.random() * imageSet.length)];

		const fullResponse = {
			...rawResponse,
			imageUrl: randomImage.url,
			imageCredit: randomImage.credit,
			sourceAttribution:
				"Information provided by dental health experts via OpenAI",
		};

		return searchResponseSchema.parse(fullResponse);
	} catch (error) {
		console.error("Error in getDentalInformation:", error);
		throw new Error(`Failed to get dental information: ${error.message}`);
	}
}
