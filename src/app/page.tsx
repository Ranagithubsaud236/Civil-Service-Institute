import { Hero } from "@/components/nation/Hero";
import { BigWord } from "@/components/nation/BigWord";
import { WhatIs } from "@/components/nation/WhatIs";
import { NationMap } from "@/components/nation/NationMap";
import { ProvinceStory } from "@/components/nation/ProvinceStory";
import { Paths } from "@/components/nation/Paths";
import { VelocityMarquee } from "@/components/nation/VelocityMarquee";
import { Constellation } from "@/components/nation/Constellation";
import { DayInLife } from "@/components/nation/DayInLife";
import { Journey } from "@/components/nation/Journey";
import { Toolkit } from "@/components/nation/Toolkit";
import { RedPen } from "@/components/nation/RedPen";
import { Impact } from "@/components/nation/Impact";
import { Stories } from "@/components/nation/Stories";
import { OfficerCard } from "@/components/nation/OfficerCard";
import { FinalCta } from "@/components/nation/FinalCta";

/**
 * "From Aspirant to Nation Builder" — Pakistan unfolds as you scroll. The hero, the map and
 * the golden journey are the signature scenes; oversized words mark the chapter changes.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BigWord word="SERVICE" urdu="خدمت" />
      <WhatIs />
      <NationMap />
      <ProvinceStory />
      <Paths />
      <VelocityMarquee />
      <Constellation />
      <BigWord word="LEADERSHIP" urdu="قیادت" />
      <DayInLife />
      <Journey />
      <Toolkit />
      <RedPen />
      <BigWord word="IMPACT" urdu="اثر" />
      <Impact />
      <Stories />
      <OfficerCard />
      <FinalCta />
    </>
  );
}
