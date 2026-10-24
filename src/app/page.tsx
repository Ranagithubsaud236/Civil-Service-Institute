import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Classroom } from "@/components/home/Classroom";
import { Approach } from "@/components/home/Approach";
import { EssayReview } from "@/components/home/EssayReview";
import { Programmes } from "@/components/home/Programmes";
import { Journey } from "@/components/home/Journey";
import { Faculty } from "@/components/home/Faculty";
import { AlumniRoad } from "@/components/home/AlumniRoad";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Classroom />
      <Approach />
      <EssayReview />
      <Programmes />
      <Journey />
      <Faculty />
      <AlumniRoad />
      <Faq />
      <Contact />
    </>
  );
}
