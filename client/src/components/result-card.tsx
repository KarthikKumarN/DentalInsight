import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import type { SearchResponse } from "@shared/schema";

interface ResultCardProps {
  result: SearchResponse;
}

const SeverityIcon = ({ severity }: { severity?: string }) => {
  switch (severity) {
    case "high":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "medium":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "low":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="relative h-64 w-full mb-4">
          <img
            src={result.imageUrl}
            alt="Dental reference"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            Photo by {result.imageCredit}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Description</h3>
            <p className="text-gray-600">{result.description}</p>
          </div>

          {result.diagnosticSteps && result.diagnosticSteps.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                Diagnostic Steps
              </h3>
              <div className="space-y-4">
                {result.diagnosticSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <SeverityIcon severity={step.severity} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {index + 1}. {step.step}
                        </h4>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        {step.warning && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            {step.warning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Recommended Treatments</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {result.treatments.map((treatment, i) => (
                <li key={i}>{treatment}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Suggested Medicines</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {result.medicines.map((medicine, i) => (
                <li key={i}>{medicine}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Learn More</h3>
            <ul className="space-y-2">
              {result.references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            {result.sourceAttribution}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}