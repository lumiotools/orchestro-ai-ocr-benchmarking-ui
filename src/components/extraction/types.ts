export interface ExtractionResult {
  success: boolean;
  metadata?: {
    started_at?: string | number;
    completed_at?: string | number;
    extraction_time?: number;
    score?: {
      overall_score?: number;
      structural_score?: number;
      content_score?: number;
      semantic_score?: number;
      detailed_metrics?: {
        word_count_expected?: number;
        word_count_extracted?: number;
        character_count_expected?: number;
        character_count_extracted?: number;
        word_count_ratio?: number;
        character_count_ratio?: number;
      };
    };
    [k: string]: unknown;
  };
  data: {
    markdown: string;
  };
}

export interface Report {
  id: string;
  created_at?: string;
  inputs?: Record<string, unknown> | { provider?: string };
  metadata?: ExtractionResult["metadata"];
  markdown?: string;
}

export interface ReportResponse {
  success: boolean;
  data?: { report?: Report; reports?: Report[] };
}

