import { Result } from "./result.model";

export interface Page {
  count: number;
  next: string;
  previous: string;
  results: Result[];
}
