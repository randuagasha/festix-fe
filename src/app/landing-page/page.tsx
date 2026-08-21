import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeaturedEvents } from "@/components/landing-page/featured-events";
import { ExploreEvents } from "@/components/landing-page/explore-events";
import { WhyTixora } from "@/components/landing-page/why-tixora";
import { UpcomingEvents } from "@/components/landing-page/upcoming-events";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { CtaSection } from "@/components/landing-page/cta-section";

export default function LandingPage() {
  return (
    <main>
      <Navbar isLoggedIn={false} />

      <HeroSection />

      <FeaturedEvents events={[]} />

      <ExploreEvents
        events={[]}
        categories={[]}
      />

      <WhyTixora />

      <UpcomingEvents events={[]} />

      <HowItWorks />

      <CtaSection />
    </main>
  );
}