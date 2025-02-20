import { Card, CardContent } from "@/components/ui/card";
import { DENTAL_TIPS } from "@/lib/constants";
import * as Icons from "lucide-react";

export function QuickTips() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Dental Health Diagnostic Guide</h2>
      <p className="text-gray-600 mb-6">
        Use these self-diagnostic techniques to monitor your oral health. Remember to consult a dentist for professional diagnosis.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DENTAL_TIPS.map((tip, index) => {
          // Type assertion to ensure IconComponent is valid
          const IconComponent = Icons[tip.icon as keyof typeof Icons] as React.FC<{ className?: string }>;

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {IconComponent && (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> These diagnostic tips are for reference only. Always consult a dental professional for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}