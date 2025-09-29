import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Stack } from "@mui/material";
import type { CashFlowType, Category, ID } from "../types";

// Generic dialog for entities with only 'name'
export function SimpleNameDialog({ open, title, onClose, onSubmit, initialName }: { open: boolean; title: string; onClose: () => void; onSubmit: (name: string) => void; initialName?: string; }) {
  const [name, setName] = useState("");
  useEffect(() => { if (open) setName(initialName ?? ""); }, [open, initialName]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField autoFocus fullWidth label="Название" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 1 }} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={() => onSubmit(name)} disabled={!name.trim()}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}

// Category: name + cash_flow_type
export function CategoryDialog({ open, types, onClose, onSubmit, initial }: { open: boolean; types: CashFlowType[]; onClose: () => void; onSubmit: (payload: { name: string; cash_flow_type: ID }) => void; initial?: { name: string; cash_flow_type: ID } }) {
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState<ID | "">("");
  useEffect(() => { if (open) { setName(initial?.name ?? ""); setTypeId(initial?.cash_flow_type ?? ""); } }, [open, initial]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Новая категория</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField select label="Тип" fullWidth value={typeId === "" ? "" : typeId} onChange={(e) => setTypeId(e.target.value === "" ? "" : Number(e.target.value))}>
            <MenuItem value="">Выбрать</MenuItem>
            {types.map((t) => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
        <Button variant="contained" disabled={!name.trim() || !typeId} onClick={() => onSubmit({ name, cash_flow_type: typeId as ID })}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}

// Subcategory: name + category
export function SubcategoryDialog({ open, categories, onClose, onSubmit, initial }: { open: boolean; categories: Category[]; onClose: () => void; onSubmit: (payload: { name: string; category: ID }) => void; initial?: { name: string; category: ID } }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<ID | "">("");
  useEffect(() => { if (open) { setName(initial?.name ?? ""); setCategoryId(initial?.category ?? ""); } }, [open, initial]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Новая подкатегория</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Название" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField select label="Категория" fullWidth value={categoryId === "" ? "" : categoryId} onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}>
            <MenuItem value="">Выбрать</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Отмена</Button>
        <Button variant="contained" disabled={!name.trim() || !categoryId} onClick={() => onSubmit({ name, category: categoryId as ID })}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}
