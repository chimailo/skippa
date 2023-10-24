"use client";

import Link from "next/link";

import Container from "@/app/components/container";
import Logo from "@/app/components/svg/logo";

export default function Header() {
  return (
    <header
      role="banner"
      className="flex flex-shrink-0 h-14 sm:h-16 border-b border-gray-300"
    >
      <Container className="flex items-center w-full gap-4" compact>
        <Link href="/" className="flex items-center gap-3 text-primary">
          <Logo />
          <h1 className="truncate font-bold text-xl">Skippa</h1>
        </Link>
      </Container>
    </header>
  );
}
