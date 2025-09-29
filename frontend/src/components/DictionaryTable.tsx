import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert, CircularProgress } from '@mui/material'
import type { Paginated, CashFlowType, Category, ID } from '../types'
import { api } from '../api'
import ConfirmDialog from './ConfirmDialog'
import { SimpleNameDialog, CategoryDialog, SubcategoryDialog } from './DictionaryDialogs'

export type DictMode = 'statuses' | 'types' | 'categories' | 'subcategories'

interface Props {
  mode: DictMode
  types: CashFlowType[]
  categories: Category[]
  pageSize: number
  onChanged: () => void
  onPageSizeChange: (size: number) => void
}

export default function DictionaryTable({ mode, types, categories, pageSize, onChanged, onPageSizeChange }: Props) {
  const [data, setData] = useState<Paginated<any> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<{ id: ID; label: string } | null>(null)

  const [openNameDlg, setOpenNameDlg] = useState(false)
  const [nameInitial, setNameInitial] = useState<string>('')
  const [editingId, setEditingId] = useState<ID | null>(null)

  const [openCategoryDlg, setOpenCategoryDlg] = useState(false)
  const [categoryInitial, setCategoryInitial] = useState<{ name: string; cash_flow_type: ID } | null>(null)

  const [openSubcategoryDlg, setOpenSubcategoryDlg] = useState(false)
  const [subcategoryInitial, setSubcategoryInitial] = useState<{ name: string; category: ID } | null>(null)

  const title = useMemo(() => {
    switch (mode) {
      case 'statuses': return 'Статусы'
      case 'types': return 'Типы'
      case 'categories': return 'Категории'
      case 'subcategories': return 'Подкатегории'
    }
  }, [mode])

  const list = useCallback((url?: string, customPageSize?: number) => {
    setLoading(true)
    setError(null)
    const currentPageSize = customPageSize !== undefined ? customPageSize : pageSize;
    const run = () => {
      switch (mode) {
        case 'statuses': return url ? api.getStatusesByUrl(url) : api.listStatuses({ page_size: currentPageSize })
        case 'types': return url ? api.getTypesByUrl(url) : api.listTypes({ page_size: currentPageSize })
        case 'categories': return url ? api.getCategoriesByUrl(url) : api.listCategories({ page_size: currentPageSize })
        case 'subcategories': return url ? api.getSubcategoriesByUrl(url) : api.listSubcategories({ page_size: currentPageSize })
      }
    }
    run()!
      .then(setData)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false))
  }, [mode, pageSize])

  useEffect(() => { list() }, [list])

  const openCreate = () => {
    setEditingId(null)
    if (mode === 'statuses' || mode === 'types') {
      setNameInitial('')
      setOpenNameDlg(true)
    } else if (mode === 'categories') {
      setCategoryInitial({ name: '', cash_flow_type: types[0]?.id as ID })
      setOpenCategoryDlg(true)
    } else {
      setSubcategoryInitial({ name: '', category: categories[0]?.id as ID })
      setOpenSubcategoryDlg(true)
    }
  }

  const openEdit = (row: any) => {
    setEditingId(row.id)
    if (mode === 'statuses' || mode === 'types') {
      setNameInitial(row.name)
      setOpenNameDlg(true)
    } else if (mode === 'categories') {
      setCategoryInitial({ name: row.name, cash_flow_type: row.cash_flow_type as ID })
      setOpenCategoryDlg(true)
    } else {
      setSubcategoryInitial({ name: row.name, category: row.category as ID })
      setOpenSubcategoryDlg(true)
    }
  }

  const handleDeleteAsk = (row: any) => {
    setToDelete({ id: row.id, label: row.name })
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!toDelete) return
    const id = toDelete.id
    switch (mode) {
      case 'statuses': await api.deleteStatus(id); break
      case 'types': await api.deleteType(id); break
      case 'categories': await api.deleteCategory(id); break
      case 'subcategories': await api.deleteSubcategory(id); break
    }
    setConfirmOpen(false)
    setToDelete(null)
    list()
    onChanged()
  }

  const handleSubmitName = async (name: string) => {
    if (mode === 'statuses') {
      if (editingId) await api.updateStatus(editingId, { name })
      else await api.createStatus({ name })
    } else if (mode === 'types') {
      if (editingId) await api.updateType(editingId, { name })
      else await api.createType({ name })
    }
    setOpenNameDlg(false)
    setEditingId(null)
    list(); onChanged()
  }

  const handleSubmitCategory = async (payload: { name: string; cash_flow_type: ID }) => {
    if (editingId) await api.updateCategory(editingId, payload)
    else await api.createCategory(payload)
    setOpenCategoryDlg(false)
    setEditingId(null)
    list(); onChanged()
  }

  const handleSubmitSubcategory = async (payload: { name: string; category: ID }) => {
    if (editingId) await api.updateSubcategory(editingId, payload)
    else await api.createSubcategory(payload)
    setOpenSubcategoryDlg(false)
    setEditingId(null)
    list(); onChanged()
  }

  const renderHead = () => {
    switch (mode) {
      case 'statuses':
      case 'types':
        return (
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        )
      case 'categories':
        return (
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        )
      case 'subcategories':
        return (
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        )
    }
  }

  const renderRow = (row: any) => {
    switch (mode) {
      case 'statuses':
      case 'types':
        return (
          <TableRow key={row.id} hover>
            <TableCell>{row.name}</TableCell>
            <TableCell align="right">
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => openEdit(row)}>Ред.</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteAsk(row)}>Удалить</Button>
            </TableCell>
          </TableRow>
        )
      case 'categories':
        return (
          <TableRow key={row.id} hover>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.cash_flow_type_name}</TableCell>
            <TableCell align="right">
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => openEdit(row)}>Ред.</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteAsk(row)}>Удалить</Button>
            </TableCell>
          </TableRow>
        )
      case 'subcategories':
        return (
          <TableRow key={row.id} hover>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.category_name}</TableCell>
            <TableCell align="right">
              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => openEdit(row)}>Ред.</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteAsk(row)}>Удалить</Button>
            </TableCell>
          </TableRow>
        )
    }
  }

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" mb={2}>
          {/* <Typography variant="body2" color="text.secondary">{title}: найдено {data?.count ?? 0}</Typography> */}
          <Stack direction="row" spacing={1} alignItems="center">
            {loading && <CircularProgress size={20} />}
            <Button variant="contained" onClick={openCreate} disabled={loading}>Добавить</Button>
          </Stack>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>{renderHead()}</TableHead>
            <TableBody>
              {data?.results?.map((r: any) => renderRow(r))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={2}>
          <Button variant="outlined" size="small" disabled={!data?.previous} onClick={() => data?.previous && list(data.previous)}>← Предыдущая</Button>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">На странице:</Typography>
            <select 
              value={pageSize} 
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onPageSizeChange(newSize);
                list(undefined, newSize);
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
          
          <Button variant="outlined" size="small" disabled={!data?.next} onClick={() => data?.next && list(data.next)}>Следующая →</Button>
        </Box>
      </Paper>

      {/* Dialogs */}
      <SimpleNameDialog open={openNameDlg && (mode === 'statuses' || mode === 'types')} title={editingId ? `Изменить ${mode === 'statuses' ? 'статус' : 'тип'}` : `Новый ${mode === 'statuses' ? 'статус' : 'тип'}`} onClose={() => { setOpenNameDlg(false); setEditingId(null) }} onSubmit={handleSubmitName} initialName={nameInitial} />

      <CategoryDialog open={openCategoryDlg && mode === 'categories'} types={types} onClose={() => { setOpenCategoryDlg(false); setEditingId(null) }} onSubmit={handleSubmitCategory} initial={categoryInitial || undefined} />

      <SubcategoryDialog open={openSubcategoryDlg && mode === 'subcategories'} categories={categories} onClose={() => { setOpenSubcategoryDlg(false); setEditingId(null) }} onSubmit={handleSubmitSubcategory} initial={subcategoryInitial || undefined} />

      <ConfirmDialog
        open={confirmOpen}
        title={"Удалить запись?"}
        description={toDelete ? `Вы уверены, что хотите удалить «${toDelete.label}»?` : undefined}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
