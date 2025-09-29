import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import type { CashFlow, CashFlowFilters, Category, CashFlowType, Status, Subcategory, ID, Paginated } from "./types";
import { api } from "./api";
import FiltersBar from "./components/FiltersBar";
import CashFlowTable from "./components/CashFlowTable";
import CashFlowFormDialog from "./components/CashFlowFormDialog";
import ConfirmDialog from "./components/ConfirmDialog";
import DictionaryTable from "./components/DictionaryTable";
import type { DictMode } from "./components/DictionaryTable";

function App() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [types, setTypes] = useState<CashFlowType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [filters, setFilters] = useState<CashFlowFilters>({ page_size: 10 });
  const [pageSize, setPageSize] = useState<number>(10);
  const [dictPageSizes, setDictPageSizes] = useState<{ statuses: number; types: number; categories: number; subcategories: number }>({
    statuses: 10,
    types: 10,
    categories: 10,
    subcategories: 10,
  });
  

  const [data, setData] = useState<Paginated<CashFlow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CashFlow | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CashFlow | null>(null);

  // Mode: cash flows or dictionaries
  type Mode = 'cash_flows' | DictMode;
  const [mode, setMode] = useState<Mode>('cash_flows');

  const fetchData = useCallback(() => {
    if (mode !== 'cash_flows') return;
    
    setLoading(true);
    setError(null);
    api.getCashFlows(filters)
      .then(setData)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [filters, mode]);
  
  // Refetch data when filters or mode changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load dictionaries once
  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getStatuses(), api.getTypes(), api.getCategories(), api.getSubcategories()])
      .then(([st, tp, cat, sub]) => {
        if (cancelled) return;
        setStatuses(st);
        setTypes(tp);
        setCategories(cat);
        setSubcategories(sub);
      })
      .catch((e) => console.error(e));
    return () => { cancelled = true };
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteCashFlow(toDelete.id as ID);
      setConfirmOpen(false);
      setToDelete(null);
      fetchData();
    } catch (e: any) {
      setError(String(e.message || e));
    }
  };

  const handleSubmit = async (payload: { id?: ID; status: ID; cash_flow_type: ID; category: ID; subcategory: ID; amount: string; comment?: string }) => {
    try {
      if (payload.id) {
        const { id, ...rest } = payload;
        await api.updateCashFlow(id as ID, rest);
      } else {
        const { id: _omit, ...rest } = payload; // keep category in payload
        await api.createCashFlow(rest);
      }
      setFormOpen(false);
      setEditing(null);
      fetchData();
    } catch (e: any) {
      setError(String(e.message || e));
    }
  };

  const resetFilters = () => setFilters((f) => ({ page_size: f.page_size }));

  // Dictionaries refresh helper
  const refreshDictionaries = useCallback(() => {
    Promise.all([api.getStatuses(), api.getTypes(), api.getCategories(), api.getSubcategories()])
      .then(([st, tp, cat, sub]) => {
        setStatuses(st);
        setTypes(tp);
        setCategories(cat);
        setSubcategories(sub);
      })
      .catch((e) => console.error(e));
  }, []);

  // Dictionaries changed
  const onDictionariesChanged = useCallback(() => {
    refreshDictionaries();
    // If we're in cash_flows mode, refresh the data
    if (mode === 'cash_flows') {
      fetchData();
    }
  }, [mode, refreshDictionaries, fetchData]);

  const content = useMemo(() => {
    return (
      <Stack direction="row" spacing={0} sx={{ height: '100%', width: '100%' }}>
        <Box flex={1} sx={{ overflow: 'auto', height: '100%' }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <Box sx={{ ml: 'auto' }} />
            {mode === 'cash_flows' && (
              <Button sx={{ ml: 2 }} variant="contained" onClick={() => { setEditing(null); setFormOpen(true); }}>Добавить</Button>
            )}
          </Stack>

          {/* Body */}
          {mode === 'cash_flows' ? (
            <>
              {loading ? <CircularProgress /> : error ? <Alert severity="error">Ошибка: {error}</Alert> : (
                <>
                  <Stack direction="row" spacing={2}>
                    <FiltersBar
                      statuses={statuses}
                      types={types}
                      categories={categories}
                      subcategories={subcategories}
                      value={filters}
                      onChange={setFilters}
                      onReset={resetFilters}
                    />
                    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={2}>
                        <Button variant="outlined" size="small" disabled={!data?.previous} onClick={() => data?.previous && api.getCashFlowsByUrl(data.previous).then(setData)}>← Предыдущая</Button>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">На странице:</Typography>
                          <select
                            value={pageSize}
                            onChange={(e) => { 
                              const v = Number(e.target.value); 
                              setPageSize(v);
                              // Update filters with the new page size
                              setFilters(f => ({
                                ...f,
                                page_size: v,
                                page: 1 // Reset to first page when changing page size
                              }));
                            }}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </Box>
                        
                        <Button variant="outlined" size="small" disabled={!data?.next} onClick={() => data?.next && api.getCashFlowsByUrl(data.next).then(setData)}>Следующая →</Button>
                      </Box>
                      <CashFlowTable 
                        rows={data?.results ?? []} 
                        onEdit={(row) => { setEditing(row); setFormOpen(true); }} 
                        onDelete={(row) => { setToDelete(row); setConfirmOpen(true); }} 
                      />

                  </Stack>

                  </Stack>
                </>
              )}
            </>
          ) : (
            <DictionaryTable
              mode={mode}
              types={types}
              categories={categories}
              pageSize={dictPageSizes[mode as DictMode]}
              onChanged={onDictionariesChanged}
              onPageSizeChange={(size) => setDictPageSizes((s) => ({ ...s, [mode as DictMode]: size }))}
            />
          )}
        </Box>
        <Box sx={{ width: 260, height: '100%', flexShrink: 0 }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" gutterBottom>Разделы</Typography>
            <Stack spacing={1}>
              <Button variant={mode === 'cash_flows' ? 'contained' : 'outlined'} onClick={() => setMode('cash_flows')}>ДДС</Button>
              <Button variant={mode === 'statuses' ? 'contained' : 'outlined'} onClick={() => setMode('statuses')}>Статусы</Button>
              <Button variant={mode === 'types' ? 'contained' : 'outlined'} onClick={() => setMode('types')}>Типы</Button>
              <Button variant={mode === 'categories' ? 'contained' : 'outlined'} onClick={() => setMode('categories')}>Категории</Button>
              <Button variant={mode === 'subcategories' ? 'contained' : 'outlined'} onClick={() => setMode('subcategories')}>Подкатегории</Button>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    );
  }, [mode, loading, error, data, pageSize, dictPageSizes, types, categories, statuses, subcategories, filters]);

  return (
    <Box sx={{ bgcolor: '#f6f7fb', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Container maxWidth={false} disableGutters sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: '0 0 auto', textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" color="text.primary">
            {mode === 'cash_flows' ? 'Движения денежных средств' : (
              mode === 'statuses' ? 'Статусы' : mode === 'types' ? 'Типы' : mode === 'categories' ? 'Категории' : 'Подкатегории'
            )}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex' }}>
          {content}
        </Box>

        <CashFlowFormDialog
          open={formOpen}
          initial={editing}
          types={types}
          categories={categories}
          subcategories={subcategories}
          statuses={statuses}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSubmit={handleSubmit}
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Удалить запись?"
          description={toDelete ? `Вы уверены, что хотите удалить запись на сумму ${toDelete.amount}?` : undefined}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />

        {/* Dictionary dialogs moved into DictionaryTable */}
      </Container>
    </Box>
  );
}

export default App;