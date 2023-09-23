import Image from "next/image";
import Link from "next/link";

import Container from "@/app/components/container";

export default function Header() {
  return (
    <header
      role="banner"
      className="flex flex-shrink-0 h-14 sm:h-16 border-b border-gray-300"
    >
      <Container className="flex items-center w-full" compact>
        <Link
          className="flex place-items-center gap-2 text-primary font-serif shrink-0 font-bold text-2xl uppercase"
          href="/"
        >
          Skippa
          {/* <Image
            src="/vercel.svg"
            alt="Skippa's Logo"
            width={180}
            height={40}
            priority
          /> */}
        </Link>
      </Container>
    </header>
  );
}
