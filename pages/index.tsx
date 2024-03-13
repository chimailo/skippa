import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import Footer from "@/components/footer";
import WhySkippa from "@/components/whyskippa";
import Logo from "@/components/svg/logo";
import RadioButton from "@/components/radioButton";
import { Drawer } from "@/components/drawer";
import AppleLogo from "@/public/apple.svg";
import PlaystoreLogo from "@/public/playstore.svg";

export default function Home() {
  const [view, setView] = useState("customers");

  return (
    <div className="pt-10">
      <header
        role="banner"
        className="flex flex-shrink-0 h-14 md:h-16 z-40 sticky top-0 bg-white"
      >
        <Container className="flex items-center w-full gap-4 max-w-screen-xl justify-between">
          <div className="flex items-center gap-3 text-primary">
            <Logo className="w-10 h-10" />
            <h1 className="truncate font-bold text-3xl text-[#272E2D]">
              Skippa
            </h1>
          </div>
          <nav className="lg:flex items-center gap-7 text-[#272E2D] hidden">
            <Link href="/faqs" className="text-lg font-semibold leading-none">
              FAQs
            </Link>
            <Link href="/about" className="text-lg font-semibold leading-none">
              About Us
            </Link>
            <Link href="/terms" className="text-lg font-semibold leading-none">
              Terms & Conditions
            </Link>
          </nav>
          <div className="lg:flex items-center gap-6 hidden">
            <Button
              asChild
              variant="ghost"
              className="text-primary font-bold gap-2 hover:text-primary"
            >
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="font-bold gap-2 hover:bg-teal-600">
              <Link href="/select-business-type">Sign Up as a Partner</Link>
            </Button>
          </div>
          <Drawer></Drawer>
        </Container>
      </header>
      <main className="flex flex-col items-center justify-between">
        <div className="flex items-center gap-5 my-14">
          <RadioButton
            name="customers"
            view={view}
            className="rounded-xl"
            handleChange={() => setView("customers")}
          ></RadioButton>
          <RadioButton
            name="riders"
            view={view}
            className="rounded-xl"
            handleChange={() => setView("riders")}
          ></RadioButton>
        </div>
        <Container
          compact
          className="grid md:grid-flow-col md:auto-cols-fr md:gap-6 gap-12 mb-28 lg:mb-56"
        >
          <div className="sm:w-4/5 md:w-full xl:w-4/5">
            <h1 className="text-3xl mb-4 md:mb-6 font-bold">
              Introducing <span className="text-primary">Skippa:</span>{" "}
              Revolutionizing Logistics!
            </h1>
            {view === "customers" && (
              <p className="text-sm">
                Transform your delivery experience with Skippa! Say goodbye to
                waiting and inefficiencies, and hello to seamless, streamlined
                operations. Join us today to revolutionize how you receive your
                deliveries!
              </p>
            )}
            {view === "riders" && (
              <p className="text-sm">
                Transform your delivery experience with Skippa! Say goodbye to
                idle time and hello to a world of opportunities. Partner with us
                today and make every trip count!
              </p>
            )}
          </div>
          <div className="py-6 px-5 space-y-9 sm:px-8 md:py-8 xl:px-12">
            <a
              href="#"
              target="_blank"
              rel="noreferrer noopener"
              className="py-2 justify-center w-64 text-white gap-2.5 rounded-md font-bold flex bg-[#272E2D] items-center"
            >
              <Image src={AppleLogo} alt="Apple logo" />
              Get it on iPhone
            </a>
            <a
              href="#"
              target="_blank"
              rel="noreferrer noopener"
              className="py-2 justify-center w-64 text-white gap-2.5 rounded-md font-bold flex bg-[#272E2D] items-center"
            >
              <Image src={PlaystoreLogo} alt="Playstore logo" />
              Get it on Android
            </a>
          </div>
        </Container>
        <WhySkippa />
      </main>
      <Footer />
    </div>
  );
}
