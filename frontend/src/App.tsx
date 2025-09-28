import { useEffect, useState } from 'react'
import './App.css'

type CashFlow = {
  status: number
  cash_flow_type: number
  cash_flow_type_name: string
  category_name: string
  subcategory: number
  subcategory_name: string
  amount: string
  created_at: string
  comment: string
  status_name: string
}

type ApiResponse = {
  count: number
  next: string | null
  previous: string | null
  results: CashFlow[]
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = 'http://127.0.0.1:8000/api/cash_flows/'
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: ApiResponse) => setData(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Движения денежных средств</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {!loading && !error && (
        <>
          <p style={{ color: '#666', marginBottom: 8 }}>
            Найдено: {data?.count ?? 0}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data?.results.map((item, idx) => (
              <li
                key={`${item.created_at}-${idx}`}
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                  background: '#fff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong>{item.cash_flow_type_name}</strong>
                  <span style={{ color: '#888' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: '#444', marginBottom: 6 }}>
                  {item.category_name} / {item.subcategory_name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{item.amount}</span>
                  <span style={{ color: '#666' }}>{item.status_name}</span>
                </div>
                {item.comment && (
                  <div style={{ marginTop: 8, color: '#333' }}>{item.comment}</div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
