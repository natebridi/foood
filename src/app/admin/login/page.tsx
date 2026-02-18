"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    <>
      <style>{`
        body { background: #eee; }
        input {
          display: block;
          padding: 0.5em 1em;
          width: 200px;
          color: ${error ? "#f00" : "#444"};
          font-size: 18px;
          margin: 3em auto;
          border: 0;
          background: #fff;
          box-shadow: none;
          border-radius: 3px;
        }
      `}</style>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          name="password"
          autoComplete="off"
          autoCapitalize="off"
          placeholder="Enter password"
          autoFocus
        />
      </form>
    </>
  );
}
