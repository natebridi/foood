"use client";

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import type { RecipeListItem } from "@/types/recipe";
import TransitionLink from "./TransitionLink";
import styles from "@/app/styles/cookbook.module.css";
import { SearchIcon, FooodLogo, CloseIcon } from "@/components/Images";
import SkeletonBlocks from "@/components/SkeletonBlocks";

const MIN_LOADING_MS = 750;
const REVEAL_DURATION_MS = 500;
const ESTIMATED_TITLE_BAR_HEIGHT = 72;
const TILE_MIN_HEIGHT = 64; // 4rem — keep in sync with .recipe min-height in CSS
// Extra rows of skeletons rendered beyond the viewport so the grid always
// overfills and there's never a visible gap during load / reveal.
const SKELETON_BUFFER_ROWS = 4;

function getColorStyle(index: number): string {
  return `${styles.recipe} ${styles[`style-${(index % 7) + 1}`]}`;
}

function getColumnCount(width: number): number {
  if (width >= 900) return 4;
  if (width >= 600) return 3;
  return 2;
}

function estimateSkeletonCount(
  viewportHeight: number,
  viewportWidth: number,
  titleBarHeight = ESTIMATED_TITLE_BAR_HEIGHT
): number {
  const availableHeight = viewportHeight - titleBarHeight;
  const columns = getColumnCount(viewportWidth);
  const rows = Math.max(1, Math.ceil(availableHeight / TILE_MIN_HEIGHT)) + SKELETON_BUFFER_ROWS;
  return rows * columns;
}

function isSkeletonFrozen(): boolean {
  return new URLSearchParams(window.location.search).get("skeleton") === "1";
}

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [freezeSkeleton, setFreezeSkeleton] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(() => estimateSkeletonCount(900, 1200));
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);

  const updateSkeletonCount = useCallback(() => {
    const titleBarHeight = titleBarRef.current?.offsetHeight ?? ESTIMATED_TITLE_BAR_HEIGHT;
    setSkeletonCount(estimateSkeletonCount(window.innerHeight, window.innerWidth, titleBarHeight));
  }, []);

  useEffect(() => {
    // Reads window.location (browser-only), so it must run after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFreezeSkeleton(isSkeletonFrozen());
  }, []);

  useLayoutEffect(() => {
    // Measures viewport/DOM before paint, then syncs the skeleton count —
    // the canonical measure-then-set layout-effect pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);
    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, [updateSkeletonCount]);

  useEffect(() => {
    const startTime = Date.now();
    let timeoutId: ReturnType<typeof setTimeout>;

    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data: { id: number; title: string; slug: string }[]) => {
        const withStyles = data.map((recipe, index) => ({
          ...recipe,
          colorStyle: getColorStyle(index),
        }));
        const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - startTime));
        timeoutId = setTimeout(() => {
          setRecipes(withStyles);
          setDataReady(true);
        }, remaining);
      })
      .catch(() => {
        const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - startTime));
        timeoutId = setTimeout(() => setDataReady(true), remaining);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!dataReady || freezeSkeleton || recipes.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Honors the reduced-motion media query by revealing everything at once.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealedCount(recipes.length);
      return;
    }

    const startTime = performance.now();
    let rafId = 0;

    const tick = () => {
      const progress = Math.min(1, (performance.now() - startTime) / REVEAL_DURATION_MS);
      setRevealedCount(Math.min(recipes.length, Math.ceil(progress * recipes.length)));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [dataReady, freezeSkeleton, recipes.length]);

  const showViewportSkeleton = !dataReady || freezeSkeleton;
  const isRevealing = dataReady && !freezeSkeleton && revealedCount < recipes.length;
  const showBusy = showViewportSkeleton || isRevealing;

  // Freeze page scroll while the skeleton grid is loading/revealing so the
  // overfilled grid always covers the viewport and can't be scrolled past.
  useEffect(() => {
    if (!showBusy) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showBusy]);

  const filteredRecipes = query
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  return (
    <div className="menu-wrap">
      <div ref={titleBarRef} className={`${styles.titleBar} ${query !== "" ? styles.active : ""}`}>
        <div className={styles.searchContain}>
          <h1 className={styles.logoWrap}>
            <FooodLogo className={styles.logo} />
          </h1>

          <div className={styles.searchWrap}>
            <button
              className={styles.searchIconBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                inputRef.current?.focus();
              }}
              onClick={() => inputRef.current?.focus()}
              aria-label="Search"
              tabIndex={1}
              type="button"
            >
              <SearchIcon className={styles.searchIcon} />
            </button>
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              role="searchbox"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className={styles.closeIconBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery("");
                inputRef.current?.blur();
              }}
              onClick={() => {
                setQuery("");
                inputRef.current?.blur();
              }}
              type="button"
              aria-label="Clear search"
            >
              <CloseIcon className={styles.closeIcon} />
            </button>
          </div>
        </div>
      </div>

      <ul className={styles.recipes} aria-busy={showBusy}>
        {showViewportSkeleton
          ? Array.from({ length: skeletonCount }, (_, i) => (
              <li
                key={`skeleton-${i}`}
                className={`${getColorStyle(i)} ${styles.skeleton}`}
                data-testid="recipe-tile-skeleton"
                aria-hidden="true"
              >
                <SkeletonBlocks tileIndex={i} />
              </li>
            ))
          : filteredRecipes.map((recipe, i) => (
              <li
                key={recipe.id}
                className={`${recipe.colorStyle}${i >= revealedCount ? ` ${styles.skeleton}` : ""}`}
                data-testid={i < revealedCount ? "recipe-tile" : "recipe-tile-skeleton"}
                aria-hidden={i >= revealedCount ? true : undefined}
              >
                {i < revealedCount ? (
                  <TransitionLink href={`/${recipe.slug}`}>
                    <span dangerouslySetInnerHTML={{ __html: recipe.title }} />
                  </TransitionLink>
                ) : (
                  <SkeletonBlocks tileIndex={i} />
                )}
              </li>
            ))}
      </ul>
    </div>
  );
}
