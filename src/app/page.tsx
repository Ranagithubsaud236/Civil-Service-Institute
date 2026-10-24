import { Banner } from "@/components/home/Banner";
import { QuickLinks } from "@/components/home/QuickLinks";
import { NewsBand } from "@/components/home/NewsBand";
import { Stars } from "@/components/home/Stars";
import { Stats } from "@/components/home/Stats";
import { ServiceMarquee } from "@/components/home/ServiceMarquee";
import { Quiz } from "@/components/home/Quiz";
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
      <Banner />
      <NewsBand />
      <QuickLinks />
      <News />
      <Stars />
      <Stats />
      <ServiceMarquee />
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
