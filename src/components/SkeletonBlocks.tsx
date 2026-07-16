"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/cookbook.module.css";

type BlockPattern = () => React.ReactNode;

type SkeletonLayout =
  | { type: "single"; length: number }
  | { type: "double"; first: number; second: number };

/** Varied title-like lengths; doubles mimic two-word recipe names. */
const SKELETON_LAYOUTS: SkeletonLayout[] = [
  { type: "single", length: 6 },
  { type: "double", first: 4, second: 5 },
  { type: "single", length: 9 },
  { type: "single", length: 4 },
  { type: "double", first: 3, second: 6 },
  { type: "single", length: 11 },
  { type: "single", length: 7 },
  { type: "double", first: 5, second: 4 },
  { type: "single", length: 12 },
  { type: "single", length: 5 },
  { type: "double", first: 6, second: 5 },
  { type: "single", length: 8 },
  { type: "double", first: 4, second: 7 },
  { type: "single", length: 10 },
  { type: "single", length: 3 },
  { type: "double", first: 5, second: 6 },
  { type: "single", length: 9 },
  { type: "double", first: 3, second: 5 },
  { type: "single", length: 6 },
  { type: "single", length: 11 },
  { type: "double", first: 4, second: 4 },
  { type: "single", length: 7 },
  { type: "single", length: 12 },
  { type: "double", first: 6, second: 3 },
];

function getSkeletonLayout(tileIndex: number): SkeletonLayout {
  return SKELETON_LAYOUTS[tileIndex % SKELETON_LAYOUTS.length];
}

/** Monospace-style block glyphs as inline SVG (no extra font requests). */
const BLOCK_PATTERNS: BlockPattern[] = [
  // █ full block
  () => <rect x="0" y="0" width="8" height="16" />,
  // ▓ dark shade
  () => (
    <>
      <rect x="0" y="0" width="8" height="3" />
      <rect x="0" y="4" width="8" height="3" />
      <rect x="0" y="8" width="8" height="3" />
      <rect x="0" y="12" width="8" height="3" />
    </>
  ),
  // ▒ medium shade
  () => (
    <>
      <rect x="0" y="0" width="3" height="3" />
      <rect x="5" y="0" width="3" height="3" />
      <rect x="0" y="5" width="3" height="3" />
      <rect x="5" y="5" width="3" height="3" />
      <rect x="0" y="10" width="3" height="3" />
      <rect x="5" y="10" width="3" height="3" />
      <rect x="0" y="13" width="3" height="3" />
      <rect x="5" y="13" width="3" height="3" />
    </>
  ),
  // ░ light shade
  () => (
    <>
      <rect x="1" y="2" width="2" height="2" />
      <rect x="5" y="2" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="5" y="7" width="2" height="2" />
      <rect x="1" y="12" width="2" height="2" />
      <rect x="5" y="12" width="2" height="2" />
    </>
  ),
  // ▄ upper half
  () => <rect x="0" y="0" width="8" height="8" />,
  // ▀ lower half
  () => <rect x="0" y="8" width="8" height="8" />,
  // ▌ left half
  () => <rect x="0" y="0" width="4" height="16" />,
  // ▐ right half
  () => <rect x="4" y="0" width="4" height="16" />,
  // dense dot grid
  () => (
    <>
      <rect x="0" y="1" width="2" height="2" />
      <rect x="3" y="1" width="2" height="2" />
      <rect x="6" y="1" width="2" height="2" />
      <rect x="1" y="5" width="2" height="2" />
      <rect x="4" y="5" width="2" height="2" />
      <rect x="0" y="9" width="2" height="2" />
      <rect x="3" y="9" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
      <rect x="1" y="13" width="2" height="2" />
      <rect x="4" y="13" width="2" height="2" />
    </>
  ),
  // sparse dots
  () => (
    <>
      <rect x="2" y="3" width="2" height="2" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="1" y="12" width="2" height="2" />
    </>
  ),
  // vertical stripes
  () => (
    <>
      <rect x="0" y="0" width="2" height="16" />
      <rect x="3" y="0" width="2" height="16" />
      <rect x="6" y="0" width="2" height="16" />
    </>
  ),
  // offset checker (glitch phase)
  () => (
    <>
      <rect x="5" y="0" width="3" height="3" />
      <rect x="0" y="3" width="3" height="3" />
      <rect x="5" y="6" width="3" height="3" />
      <rect x="0" y="9" width="3" height="3" />
      <rect x="5" y="12" width="3" height="3" />
    </>
  ),
];

function BlockGlyph({ patternIndex }: { patternIndex: number }) {
  const pattern = BLOCK_PATTERNS[patternIndex % BLOCK_PATTERNS.length];

  return (
    <svg
      className={styles.blockGlyph}
      viewBox="0 0 8 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="currentColor">{pattern()}</g>
    </svg>
  );
}

export default function SkeletonBlocks({ tileIndex }: { tileIndex: number }) {
  const [tick, setTick] = useState(0);
  const layout = getSkeletonLayout(tileIndex);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const delay = 90 + (tileIndex % 7) * 35;
    // Advance on the first frame after paint so blocks start morphing
    // immediately, then continue at a steady per-tile cadence — otherwise the
    // interval waits a full period before its first tick, leaving a visible
    // pause before the animation begins.
    const rafId = window.requestAnimationFrame(() => setTick((t) => t + 1));
    const id = window.setInterval(() => setTick((t) => t + 1), delay);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(id);
    };
  }, [tileIndex]);

  const renderWord = (wordIndex: number, blockCount: number, glyphOffset: number) => (
    <span key={wordIndex} className={styles.skeletonWord}>
      {Array.from({ length: blockCount }, (_, i) => (
        <BlockGlyph
          key={i}
          patternIndex={(tick + tileIndex * 5 + (glyphOffset + i) * 11) % BLOCK_PATTERNS.length}
        />
      ))}
    </span>
  );

  return (
    <span className={styles.skeletonText}>
      {layout.type === "single" ? (
        renderWord(0, layout.length, 0)
      ) : (
        <>
          {renderWord(0, layout.first, 0)}
          {renderWord(1, layout.second, layout.first)}
        </>
      )}
    </span>
  );
}
