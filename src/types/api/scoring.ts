export type PublishedScoringResult = {
  revision: number;
  published_at: string;
  note: string;
  rubric: {
    groups: {
      id: string;
      name: string;
      criteria: { id: string; name: string; maximum: number; weight: number }[];
    }[];
    grades: { label: string; minimum: number }[];
    note: string;
  };
  result: {
    criteria: {
      criterion_id: string;
      score: number | null;
      normalized: number | null;
      grade: string | null;
    }[];
    total: number | null;
    grade: string | null;
    complete: boolean;
  };
};
