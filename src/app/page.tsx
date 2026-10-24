import { Hero } from "@/components/home/Hero";
import { HighlightsSlider } from "@/components/home/HighlightsSlider";
import { Stats } from "@/components/home/Stats";
import { ServiceMarquee } from "@/components/home/ServiceMarquee";
import { Quiz } from "@/components/home/Quiz";
import { Classroom } from "@/components/home/Classroom";
import { Approach } from "@/components/home/Approach";
import { EssayReview } from "@/components/home/EssayReview";
import { Programmes } from "@/components/home/Programmes";
import { Journey } from "@/components/home/Journey";
import { Faculty } from "@/components/home/Faculty";
import { News } from "@/components/home/News";
import { Gallery } from "@/components/home/Gallery";
import { AlumniRoad } from "@/components/home/AlumniRoad";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <News />
      <HighlightsSlider />
      <Stats />
      <ServiceMarquee />
      <Classroom />
      <Approach />
      <EssayReview />
      <Quiz />
      <Programmes />
      <Journey />
      <Faculty />
      <Gallery />
      <AlumniRoad />
      <Faq />
      <Contact />
    </>
  );
}
