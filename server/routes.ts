import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDentalInformation } from "./openai";
import { insertSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/search", async (req, res) => {
    try {
      console.log('Received search request:', req.body);
      const { query } = req.body;

      if (!query || typeof query !== 'string') {
        console.error('Invalid query parameter:', query);
        return res.status(400).json({ 
          message: 'Invalid query parameter',
          details: 'Query must be a non-empty string'
        });
      }

      console.log('Processing search request for query:', query);

      // Check cache first
      const existingSearch = await storage.getSearchByQuery(query);
      if (existingSearch) {
        console.log('Returning cached result for query:', query);
        return res.json(existingSearch);
      }

      console.log('No cached result found, fetching from OpenAI...');
      // Get new response from OpenAI
      const response = await getDentalInformation(query);
      console.log('Successfully received OpenAI response');

      // Store search
      const newSearch = await storage.createSearch({
        query: query.toLowerCase(),
        response,
        timestamp: new Date().toISOString()
      });

      console.log('Successfully stored search result');
      res.json(newSearch);
    } catch (error) {
      console.error('Error processing search request:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ 
        message: 'Failed to get dental information. Please try again.',
        details: errorMessage 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}