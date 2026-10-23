import { Hero } from "@/components/nation/Hero";
import { BigWord } from "@/components/nation/BigWord";
import { WhatIs } from "@/components/nation/WhatIs";
import { NationMap } from "@/components/nation/NationMap";
import { Paths } from "@/components/nation/Paths";
import { Constellation } from "@/components/nation/Constellation";
import { Journey } from "@/components/nation/Journey";
import { Toolkit } from "@/components/nation/Toolkit";
import { Impact } from "@/components/nation/Impact";
import { Stories } from "@/components/nation/Stories";
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
      <Paths />
      <Constellation />
      <BigWord word="LEADERSHIP" urdu="قیادت" />
      <Journey />
      <Toolkit />
      <BigWord word="IMPACT" urdu="اثر" />
      <Impact />
      <Stories />
      <FinalCta />
    </>
  );
}
