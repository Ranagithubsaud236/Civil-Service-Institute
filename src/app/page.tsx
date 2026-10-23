import { Hero } from "@/components/nation/Hero";
import { BigWord } from "@/components/nation/BigWord";
import { WhatIs } from "@/components/nation/WhatIs";
import { NationMap } from "@/components/nation/NationMap";
import { ProvinceStory } from "@/components/nation/ProvinceStory";
import { History } from "@/components/nation/History";
import { Paths } from "@/components/nation/Paths";
import { VelocityMarquee } from "@/components/nation/VelocityMarquee";
import { Constellation } from "@/components/nation/Constellation";
import { Quiz } from "@/components/nation/Quiz";
import { DayInLife } from "@/components/nation/DayInLife";
import { Journey } from "@/components/nation/Journey";
import { Bookshelf } from "@/components/nation/Bookshelf";
import { Toolkit } from "@/components/nation/Toolkit";
import { RedPen } from "@/components/nation/RedPen";
import { Torch } from "@/components/nation/Torch";
import { Impact } from "@/components/nation/Impact";
import { Stories } from "@/components/nation/Stories";
import { ScatterQuote } from "@/components/nation/ScatterQuote";
import { MentorChat } from "@/components/nation/MentorChat";
import { OfficerCard } from "@/components/nation/OfficerCard";
import { FinalCta } from "@/components/nation/FinalCta";
import { ChapterNav } from "@/components/nation/ChapterNav";
import { Calligraphy } from "@/components/nation/Calligraphy";
import { PaperOrbit } from "@/components/nation/PaperOrbit";
import { Hourglass } from "@/components/nation/Hourglass";
import { Flashcards } from "@/components/nation/Flashcards";
import { MemoryGame } from "@/components/nation/MemoryGame";
import { InkFlood } from "@/components/nation/InkFlood";
import { Pledge } from "@/components/nation/Pledge";

/**
 * "From Aspirant to Nation Builder" — Pakistan unfolds as you scroll. The hero, the map and
 * the golden journey are the signature scenes; oversized words mark the chapter changes.
 */
export default function Home() {
  return (
    <>
      <ChapterNav />
      <Hero />
      <BigWord word="SERVICE" urdu="خدمت" />
      <WhatIs />
      <Calligraphy />
      <NationMap />
      <ProvinceStory />
      <History />
      <Paths />
      <PaperOrbit />
      <VelocityMarquee />
      <Constellation />
      <Quiz />
      <BigWord word="LEADERSHIP" urdu="قیادت" />
      <DayInLife />
      <Journey />
      <Hourglass />
      <Bookshelf />
      <Toolkit />
      <Flashcards />
      <MemoryGame />
      <RedPen />
      <Torch />
      <BigWord word="IMPACT" urdu="اثر" />
      <Impact />
      <Stories />
      <InkFlood />
      <ScatterQuote />
      <MentorChat />
      <Pledge />
      <OfficerCard />
      <FinalCta />
    </>
  );
}
