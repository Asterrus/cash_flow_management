import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { CashFlow, CashFlowType, Category, ID, Status, Subcategory } from "../types";

export interface CashFlowFormDialogProps {
  open: boolean;
  initial?: Partial<CashFlow> | null;
  types: CashFlowType[];
  categories: Category[];
  subcategories: Subcategory[];
  statuses: Status[];
  onClose: () => void;
  onSubmit: (payload: { id?: ID; status: ID; cash_flow_type: ID; category: ID; subcategory: ID; amount: string; comment?: string }) => void;
}

export default function CashFlowFormDialog({ open, initial, types, categories, subcategories, statuses, onClose, onSubmit }: CashFlowFormDialogProps) {
  const [cashFlowType, setCashFlowType] = useState<ID | "">(initial?.cash_flow_type ?? "");
  const [category, setCategory] = useState<ID | "">(initial?.category ?? "");
  const [subcategory, setSubcategory] = useState<ID | "">(initial?.subcategory ?? "");
  const [status, setStatus] = useState<ID | "">(initial?.status ?? "");
  const [amount, setAmount] = useState<string>(initial?.amount ?? "");
  const [comment, setComment] = useState<string>(initial?.comment ?? "");

  useEffect(() => {
    // Reset on open/initial change
    if (open) {
      setCashFlowType(initial?.cash_flow_type ?? "");
      setCategory(initial?.category ?? "");
      setSubcategory(initial?.subcategory ?? "");
      setStatus(initial?.status ?? "");
      setAmount(initial?.amount ?? "");
      setComment(initial?.comment ?? "");
    }
  }, [open, initial?.id, initial?.cash_flow_type, initial?.category, initial?.subcategory, initial?.status, initial?.amount, initial?.comment])

  const filteredCategories = useMemo(() => {
    return cashFlowType === "" ? [] : categories.filter((c) => c.cash_flow_type === cashFlowType)
  }, [categories, cashFlowType])

  const filteredSubcategories = useMemo(() => {
    return category === "" ? [] : subcategories.filter((s) => s.category === category)
  }, [subcategories, category])

  const isEdit = Boolean(initial && initial.id)
  const isAmountValid = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) && n > 0
  }, [amount])

  function handleSubmit() {
    if (!cashFlowType || !category || !subcategory || !status || !amount || !isAmountValid) return;
    
    const payload = {
      id: isEdit ? (initial!.id as ID) : undefined,
      status: status as ID,
      cash_flow_type: cashFlowType as ID,
      category: category as ID,
      subcategory: subcategory as ID,
      amount: String(amount),
      comment: comment || undefined
    };
    
    console.log('Submitting payload:', payload); // For debugging
    onSubmit(payload);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Редактировать запись" : "Новая запись"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Тип"
            value={cashFlowType === "" ? "" : cashFlowType}
            onChange={(e) => {
              const next = e.target.value === "" ? "" : Number(e.target.value)
              setCashFlowType(next)
              setCategory("")
              setSubcategory("")
            }}
            fullWidth
          >
            <MenuItem value="">Выбрать</MenuItem>
            {types.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Категория"
            value={category === "" ? "" : category}
            onChange={(e) => {
              const next = e.target.value === "" ? "" : Number(e.target.value)
              setCategory(next)
              setSubcategory("")
            }}
            fullWidth
            disabled={!cashFlowType}
          >
            <MenuItem value="">Выбрать</MenuItem>
            {filteredCategories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Подкатегория"
            value={subcategory === "" ? "" : subcategory}
            onChange={(e) => setSubcategory(e.target.value === "" ? "" : Number(e.target.value))}
            fullWidth
            disabled={!category}
          >
            <MenuItem value="">Выбрать</MenuItem>
            {filteredSubcategories.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Статус"
            value={status === "" ? "" : status}
            onChange={(e) => setStatus(e.target.value === "" ? "" : Number(e.target.value))}
            fullWidth
          >
            <MenuItem value="">Выбрать</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Сумма"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            inputProps={{ step: "0.01", min: "0.01" }}
            error={Boolean(amount) && !isAmountValid}
            helperText={Boolean(amount) && !isAmountValid ? "Введите положительную сумму" : undefined}
          />

          <TextField
            label="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!cashFlowType || !category || !subcategory || !status || !amount || !isAmountValid}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
