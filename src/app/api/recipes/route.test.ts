import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB pool before importing the route
vi.mock("@/lib/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

import pool from "@/lib/db";
import { GET } from "./route";

describe("GET /api/recipes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a JSON list of recipes ordered by title", async () => {
    const mockRows = [
      { id: 1, title: "Apple Pie", slug: "apple-pie" },
      { id: 2, title: "Banana Bread", slug: "banana-bread" },
    ];
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockRows } as never);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockRows);
  });

  it("queries for id, title, and slug columns ordered by title", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as never);

    await GET();

    expect(pool.query).toHaveBeenCalledWith("SELECT id, title, slug FROM recipes ORDER BY title");
  });
});
