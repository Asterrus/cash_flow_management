import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import type { CashFlow } from "../types";

export interface CashFlowTableProps {
  rows: CashFlow[];
  onEdit: (row: CashFlow) => void;
  onDelete: (row: CashFlow) => void;
}

export default function CashFlowTable({ rows, onEdit, onDelete }: CashFlowTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Подкатегория</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell>Статус</TableCell>
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
