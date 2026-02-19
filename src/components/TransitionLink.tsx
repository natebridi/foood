"use client";

import { useRouter } from "next/navigation";

interface Props {
  href: string;
  direction?: "forward" | "backward";
  className?: string;
  children: React.ReactNode;
}

export default function TransitionLink({ href, direction = "forward", className, children }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.documentElement.dataset.navDirection = direction;
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
