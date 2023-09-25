import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Container from "@/app/components/container";

const companyItems = [
  { label: "Service Portfolio", link: "/portfolio" },
  { label: "About", link: "/about" },
  { label: "Blog", link: "/blog" },
  { label: "Terms and Conditions", link: "/terms" },
];

const contact = [
  { icon: Facebook, link: "facebook.com" },
  { icon: Instagram, link: "instagram.com" },
  { icon: Twitter, link: "twitter.com" },
  { icon: Linkedin, link: "linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="py-8 bg-primary-dark text-slate-100 w-full">
      <Container
        compact
        className="grid sm:grid-flow-col sm:auto-cols-fr gap-6 mx-auto max-w-5xl"
      >
        <section className="">
          <h1 className="text-lg font-bold">Company</h1>
          <ul className="my-4">
            {companyItems.map((item, i) => (
              <li key={i} className="">
                <Link
                  href={item.link}
                  className="py-2 block w-full transition-colors  text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="">
          <h1 className="text-lg font-bold">Products</h1>
        </section>
        <section className="">
          <h1 className="text-lg font-bold">Connect with us</h1>
          <ul className="my-4 flex gap-3 items-center">
            {contact.map((item, i) => (
              <li key={i} className="">
                <a
                  href={`https://${item.link}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors text-gray-100 hover:text-white"
                >
                  {<item.icon size={18} />}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </footer>
  );
}
