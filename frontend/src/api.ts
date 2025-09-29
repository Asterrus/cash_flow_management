import type { CashFlow, CashFlowFilters, Paginated, Status, CashFlowType, Category, Subcategory, ID } from './types'

const BASE_API = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api'

function buildQuery(params: Record<string, any>) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      searchParams.append(k, String(v))
    }
  })
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

async function httpAbsolute<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// Dictionaries
export const api = {
  // Use a large page_size for dropdown sources to include newly created items immediately
  getStatuses: () => http<Paginated<Status>>('/statuses/?page_size=100').then(d => d.results),
  listStatuses: (params: Record<string, any> = {}) => http<Paginated<Status>>(`/statuses/${buildQuery(params)}`),
  getStatusesByUrl: (url: string) => httpAbsolute<Paginated<Status>>(url),
  getTypes: () => http<Paginated<CashFlowType>>('/cash_flow_types/?page_size=100').then(d => d.results),
  listTypes: (params: Record<string, any> = {}) => http<Paginated<CashFlowType>>(`/cash_flow_types/${buildQuery(params)}`),
  getTypesByUrl: (url: string) => httpAbsolute<Paginated<CashFlowType>>(url),
  getCategories: () => http<Paginated<Category>>('/categories/?page_size=100').then(d => d.results),
  listCategories: (params: Record<string, any> = {}) => http<Paginated<Category>>(`/categories/${buildQuery(params)}`),
  getCategoriesByUrl: (url: string) => httpAbsolute<Paginated<Category>>(url),
  getSubcategories: () => http<Paginated<Subcategory>>('/subcategories/?page_size=100').then(d => d.results),
  listSubcategories: (params: Record<string, any> = {}) => http<Paginated<Subcategory>>(`/subcategories/${buildQuery(params)}`),
  getSubcategoriesByUrl: (url: string) => httpAbsolute<Paginated<Subcategory>>(url),
  createStatus: (payload: { name: string }) => http<Status>('/statuses/', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id: ID, payload: { name: string }) => http<Status>(`/statuses/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteStatus: (id: ID) => http<void>(`/statuses/${id}/`, { method: 'DELETE' }),
  createType: (payload: { name: string }) => http<CashFlowType>('/cash_flow_types/', { method: 'POST', body: JSON.stringify(payload) }),
  updateType: (id: ID, payload: { name: string }) => http<CashFlowType>(`/cash_flow_types/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteType: (id: ID) => http<void>(`/cash_flow_types/${id}/`, { method: 'DELETE' }),
  createCategory: (payload: { name: string; cash_flow_type: ID }) => http<Category>('/categories/', { method: 'POST', body: JSON.stringify(payload) }),
  updateCategory: (id: ID, payload: { name: string; cash_flow_type: ID }) => http<Category>(`/categories/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteCategory: (id: ID) => http<void>(`/categories/${id}/`, { method: 'DELETE' }),
  createSubcategory: (payload: { name: string; category: ID }) => http<Subcategory>('/subcategories/', { method: 'POST', body: JSON.stringify(payload) }),
  updateSubcategory: (id: ID, payload: { name: string; category: ID }) => http<Subcategory>(`/subcategories/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteSubcategory: (id: ID) => http<void>(`/subcategories/${id}/`, { method: 'DELETE' }),

  // Cash flows
  getCashFlows: (filters: CashFlowFilters = {}) =>
    http<Paginated<CashFlow>>(`/cash_flows/${buildQuery(toApiFilters(filters))}`),

  getCashFlowsByUrl: (url: string) => httpAbsolute<Paginated<CashFlow>>(url),

  createCashFlow: (payload: {
    status: ID
    cash_flow_type: ID
    category: ID
    subcategory: ID
    amount: string
    comment?: string
  }) => http<CashFlow>('/cash_flows/', { method: 'POST', body: JSON.stringify(payload) }),

  updateCashFlow: (id: ID, payload: Partial<{ status: ID; cash_flow_type: ID; category: ID; subcategory: ID; amount: string; comment?: string }>) =>
    http<CashFlow>(`/cash_flows/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),

  deleteCashFlow: (id: ID) => http<void>(`/cash_flows/${id}/`, { method: 'DELETE' }),
}

function toApiFilters(f: CashFlowFilters) {
  return {
    status: f.status,
    cash_flow_type: f.cash_flow_type,
    category: f.category,
    subcategory: f.subcategory,
    created_at_after: f.created_at_after,
    created_at_before: f.created_at_before,
    page_size: f.page_size,
  }
}
