import { Hero } from "@/components/nation/Hero";
import { WhatIs } from "@/components/nation/WhatIs";
import { NationMap } from "@/components/nation/NationMap";
import { Paths } from "@/components/nation/Paths";
import { Journey } from "@/components/nation/Journey";
import { Impact } from "@/components/nation/Impact";
import { Stories } from "@/components/nation/Stories";
import { FinalCta } from "@/components/nation/FinalCta";

/** "From Aspirant to Nation Builder" — Pakistan unfolds as you scroll. */
export default function Home() {
  return (
    <>
      <Hero />
      <WhatIs />
      <NationMap />
      <Paths />
      <Journey />
      <Impact />
      <Stories />
      <FinalCta />
    </>
  );
}
