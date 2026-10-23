import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Approach } from "@/components/home/Approach";
import { Programmes } from "@/components/home/Programmes";
import { Journey } from "@/components/home/Journey";
import { Faculty } from "@/components/home/Faculty";
import { Results } from "@/components/home/Results";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Approach />
      <Programmes />
      <Journey />
      <Faculty />
      <Results />
      <Faq />
      <Contact />
    </>
  );
}
