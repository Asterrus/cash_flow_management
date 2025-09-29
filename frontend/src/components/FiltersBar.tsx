import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import type { CashFlowFilters, Category, CashFlowType, ID, Status, Subcategory } from "../types";

function toStr(v: ID | "" | undefined) {
  return v === undefined ? "" : (v as any);
}

export interface FiltersBarProps {
  statuses: Status[];
  types: CashFlowType[];
  categories: Category[];
  subcategories: Subcategory[];
  value: CashFlowFilters;
  onChange: (next: CashFlowFilters) => void;
  onReset?: () => void;
}

export default function FiltersBar({ statuses, types, categories, subcategories, value, onChange, onReset }: FiltersBarProps) {
  const filteredCategories = value.cash_flow_type
    ? categories.filter((c) => c.cash_flow_type === value.cash_flow_type)
    : categories;
  const filteredSubcategories = value.category
    ? subcategories.filter((s) => s.category === value.category)
    : subcategories;

  return (
    <Stack direction={{ xs: "column", sm: "column" }} spacing={2} alignItems="left" mb={2}>
      <TextField
        select
        label="Тип"
        size="small"
        value={toStr(value.cash_flow_type)}
        onChange={(e) => {
          const nextType = e.target.value === "" ? undefined : Number(e.target.value);
          onChange({ ...value, cash_flow_type: nextType, category: undefined, subcategory: undefined });
        }}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Все</MenuItem>
        {types.map((t) => (
          <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Категория"
        size="small"
        value={toStr(value.category)}
        onChange={(e) => {
          const nextCat = e.target.value === "" ? undefined : Number(e.target.value);
          onChange({ ...value, category: nextCat, subcategory: undefined });
        }}
        sx={{ minWidth: 200 }}
        disabled={!value.cash_flow_type}
      >
        <MenuItem value="">Все</MenuItem>
        {filteredCategories.map((c) => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Подкатегория"
        size="small"
        value={toStr(value.subcategory)}
        onChange={(e) => {
          const next = e.target.value === "" ? undefined : Number(e.target.value);
          onChange({ ...value, subcategory: next });
        }}
        sx={{ minWidth: 220 }}
        disabled={!value.category}
      >
        <MenuItem value="">Все</MenuItem>
        {filteredSubcategories.map((s) => (
          <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Статус"
        size="small"
        value={toStr(value.status)}
        onChange={(e) => {
          const next = e.target.value === "" ? undefined : Number(e.target.value);
          onChange({ ...value, status: next });
        }}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">Все</MenuItem>
        {statuses.map((s) => (
          <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
        ))}
      </TextField>
      <TextField
          type="date"
          label="С даты"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={value.created_at_after ?? ""}
          onChange={(e) => onChange({ ...value, created_at_after: e.target.value || undefined })}
          inputProps={{
            pattern: '\\d{4}-\\d{2}-\\d{2}',
            placeholder: 'дд.мм.гггг',
          }}
          InputProps={{
            inputProps: {
              format: 'dd.MM.yyyy',
            },
          }}
        />
        <TextField
          type="date"
          label="По дату"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={value.created_at_before ?? ""}
          onChange={(e) => onChange({ ...value, created_at_before: e.target.value || undefined })}
          inputProps={{
            pattern: '\\d{4}-\\d{2}-\\d{2}',
            placeholder: 'дд.мм.гггг',
          }}
          InputProps={{
            inputProps: {
              format: 'dd.MM.yyyy',
            },
          }}
        />

      {onReset && (
        <Button variant="outlined" size="small" onClick={onReset}>Сбросить</Button>
      )}
    </Stack>
  );
}
