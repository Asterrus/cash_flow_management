export type ID = number;

export interface Status {
  id: ID;
  name: string;
}

export interface CashFlowType {
  id: ID;
  name: string;
}

export interface Category {
  id: ID;
  name: string;
  cash_flow_type: ID;
  cash_flow_type_name: string;
}

export interface Subcategory {
  id: ID;
  name: string;
  category: ID;
  category_name: string;
}

export interface CashFlow {
  id: ID;
  status: ID;
  cash_flow_type: ID;
  category: ID;
  cash_flow_type_name: string;
  category_name: string;
  subcategory: ID;
  subcategory_name: string;
  amount: string;
  created_at: string;
  comment: string;
  status_name: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CashFlowFilters {
  status?: ID | '';
  cash_flow_type?: ID | '';
  category?: ID | '';
  subcategory?: ID | '';
  created_at_after?: string;
  created_at_before?: string;
  page_size?: number;
  ordering?: string;
}
