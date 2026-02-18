"use client";

import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

interface Props {
  recipes: { id: number; title: string }[];
  selectedId?: string;
}

export default function AdminNav({ recipes, selectedId }: Props) {
  const router = useRouter();

  function handleRecipeChange(e: SelectChangeEvent) {
    const val = e.target.value;
    router.push(val ? `/admin/edit?id=${val}` : "/admin/edit");
  }

  async function handleLogout() {
    await fetch("/admin/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Select
          value={selectedId ?? ""}
          onChange={handleRecipeChange}
          displayEmpty
          size="small"
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">Add new recipe</MenuItem>
          {recipes.map((r) => (
            <MenuItem key={r.id} value={String(r.id)}>
              {r.title}
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={handleLogout}
          sx={{ ml: "auto", color: "text.secondary" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
