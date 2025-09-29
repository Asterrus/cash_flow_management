import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel } from "@mui/material";
import type { CashFlow } from "../types";

export interface CashFlowTableProps {
  rows: CashFlow[];
  onEdit: (row: CashFlow) => void;
  onDelete: (row: CashFlow) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (key: string) => void;
}

export default function CashFlowTable({ rows, onEdit, onDelete, sortKey, sortDir, onSortChange }: CashFlowTableProps) {
  const active = (key: string) => sortKey === key;
  const handleSort = (key: string) => () => onSortChange && onSortChange(key);
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={active('created_at') ? sortDir : false}>
              <TableSortLabel active={active('created_at')} direction={active('created_at') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('created_at')}>
                Дата
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={active('cash_flow_type__name') ? sortDir : false}>
              <TableSortLabel active={active('cash_flow_type__name')} direction={active('cash_flow_type__name') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('cash_flow_type__name')}>
                Тип
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={active('category__name') ? sortDir : false}>
              <TableSortLabel active={active('category__name')} direction={active('category__name') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('category__name')}>
                Категория
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={active('subcategory__name') ? sortDir : false}>
              <TableSortLabel active={active('subcategory__name')} direction={active('subcategory__name') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('subcategory__name')}>
                Подкатегория
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={active('amount') ? sortDir : false}>
              <TableSortLabel active={active('amount')} direction={active('amount') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('amount')}>
                Сумма
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={active('status__name') ? sortDir : false}>
              <TableSortLabel active={active('status__name')} direction={active('status__name') ? (sortDir || 'asc') : 'asc'} onClick={handleSort('status__name')}>
                Статус
              </TableSortLabel>
            </TableCell>
            <TableCell>Комментарий</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => {
            const isExpense = r.cash_flow_type_name?.toLowerCase().includes('спис')
            const rowBg = isExpense ? '#fff1f4' : '#eef9f1' // light pink / light green
            return (
            <TableRow
              key={r.id}
              hover
              sx={{
                cursor: 'pointer',
                backgroundColor: rowBg,
                '&:hover': {
                  backgroundColor: isExpense ? '#ffe6ea' : '#e7f6ec',
                },
              }}
              onClick={() => onEdit(r)}
            >
              <TableCell>{new Date(r.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).replace(',', '')}</TableCell>
              <TableCell>{r.cash_flow_type_name}</TableCell>
              <TableCell>{r.category_name}</TableCell>
              <TableCell>{r.subcategory_name}</TableCell>
              <TableCell align="right">{r.amount}</TableCell>
              <TableCell>{r.status_name}</TableCell>
              <TableCell>{r.comment}</TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => onEdit(r)}>Ред.</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => onDelete(r)}>Удалить</Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
