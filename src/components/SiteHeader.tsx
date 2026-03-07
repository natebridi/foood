"use client";

import { useEffect, useState } from "react";
import TransitionLink from "./TransitionLink";
import { FooodLogo, SunIcon, MoonIcon } from "@/components/Images";
import styles from "@/app/styles/header.module.css";

export default function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark"); // eslint-disable-line react-hooks/set-state-in-effect -- syncing from external store (localStorage) is the correct pattern
    }
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next === "dark" ? "dark" : "";
    localStorage.setItem("theme", next);
  }

  return (
    <header className={styles.siteHeader}>
      <TransitionLink href="/" direction="backward" className={styles.logoLink}>
        <FooodLogo className={styles.logo} />
      </TransitionLink>
      <button
        onClick={toggleTheme}
        className={styles.darkToggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
      >
        {theme === "dark" ? (
          <SunIcon className={styles.toggleIcon} />
        ) : (
          <MoonIcon className={styles.toggleIcon} />
        )}
      </button>
    </header>
  );
}
