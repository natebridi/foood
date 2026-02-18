"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function LoginPage() {
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const password = inputRef.current?.value ?? "";

    const res = await fetch("/admin/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/edit");
    } else {
      setError(true);
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
      }}
    >
      <TextField
        inputRef={inputRef}
        type="password"
        placeholder="Password"
        error={error}
        helperText={error ? "Incorrect password" : ""}
        autoFocus
        autoComplete="off"
        variant="outlined"
        size="small"
      />
    </Box>
  );
}
