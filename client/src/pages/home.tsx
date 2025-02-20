import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchBox } from "@/components/search-box";
import { ResultCard } from "@/components/result-card";
import { QuickTips } from "@/components/quick-tips";
import { apiRequest } from "@/lib/queryClient";
import { UI_CONSTANTS } from "@/lib/constants";
import type { Search, SearchResponse } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
	const [searchQuery, setSearchQuery] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const {
		data: searchResult,
		isLoading,
		error,
	} = useQuery<Search>({
		queryKey: ["/api/search", searchQuery],
		enabled: !!searchQuery,
	});

	const searchMutation = useMutation({
		mutationFn: async (query: string) => {
			console.log("Sending search request with query:", query);
			const res = await apiRequest("POST", "/api/search", { query });
			console.log("Received response from API");
			const data = await res.json();
			console.log("Parsed response data:", data);
			return data as Search;
		},
		onSuccess: (data) => {
			console.log("Search mutation succeeded:", data);
			setSearchQuery(data.query);
			queryClient.setQueryData(["/api/search", data.query], data);
		},
		onError: (error) => {
			console.error("Search mutation failed:", error);
		},
	});

	const handleSearch = (query: string) => {
		console.log("Handling search for query:", query);
		searchMutation.mutate(query);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-4 text-gray-900">
						Dental Information Search
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Search for dental conditions, treatments, and professional recommendations
					</p>
				</div>

				<SearchBox
					onSearch={handleSearch}
					isLoading={isLoading || searchMutation.isPending}
				/>

				{/* Move Quick Tips to top for better visibility */}
				<div className="mb-12">
					<QuickTips />
				</div>

				<div className="mt-8">
					{(isLoading || searchMutation.isPending) && (
						<div className="space-y-4">
							<Skeleton className="h-64 w-full max-w-4xl mx-auto" />
							<Skeleton className="h-40 w-full max-w-4xl mx-auto" />
						</div>
					)}

					{(error || searchMutation.error) && (
						<Alert variant="destructive" className="max-w-4xl mx-auto">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								{UI_CONSTANTS.ERROR_MESSAGE}
								{searchMutation.error && (
									<div className="mt-2 text-sm">
										Error details: {searchMutation.error.message}
									</div>
								)}
							</AlertDescription>
						</Alert>
					)}

					{!searchQuery && !isLoading && !searchMutation.isPending && (
						<p className="text-center text-gray-500">{UI_CONSTANTS.EMPTY_STATE}</p>
					)}

					{searchResult && searchResult.response && (
						<ResultCard result={searchResult.response as SearchResponse} />
					)}
				</div>
			</div>
		</div>
	);
}
