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

  it("returns a JSON list of recipes with parsed tags", async () => {
    const mockRows = [
      { id: 1, title: "Apple Pie", slug: "apple-pie", tags: '["dessert","fruit"]' },
      { id: 2, title: "Banana Bread", slug: "banana-bread", tags: null },
    ];
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: mockRows } as never);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([
      { id: 1, title: "Apple Pie", slug: "apple-pie", tags: ["dessert", "fruit"] },
      { id: 2, title: "Banana Bread", slug: "banana-bread", tags: [] },
    ]);
  });

  it("queries for id, title, slug, and tags columns ordered by title", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as never);

    await GET();

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, title, slug, tags FROM recipes ORDER BY title"
    );
  });
});
