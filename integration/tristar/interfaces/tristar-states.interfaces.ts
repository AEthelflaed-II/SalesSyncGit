export interface TristarStatesResponse {
  data: State[];
}

export interface State {
  id: number;
  name: string;
  name_locale?: string;
  code: string;
  country_id: number;
  sequence: number;
  created_by_id: number;
  updated_by_id?: number;
  ICMS: number;
  FECP: number;
  created_at: string;
  updated_at?: string;
}
