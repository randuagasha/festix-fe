import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeaturedEvents } from "@/components/landing-page/featured-events";
import { ExploreEvents } from "@/components/landing-page/explore-events";
import { WhyTixora } from "@/components/landing-page/why-tixora";
import { UpcomingEvents } from "@/components/landing-page/upcoming-events";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { CtaSection } from "@/components/landing-page/cta-section";
import { API_URL } from "../../../api";

interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quota: number;
  availableQuota: number;
  createdAt: string;
  updatedAt: string;
}

interface EventCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  organizerId: string;
  categoryId: string;
  title: string;
  description: string;
  location: string;
  coverImageUrl: string;
  coverImageId: string;
  venueImageUrl: string | null;
  venueImageId: string | null;
  startDatetime: string;
  endDatetime: string;
  isRefundable: boolean;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  category: EventCategory;
  ticketTypes: TicketType[];
}

export default async function LandingPage() {
  const [eventsResponse, popularResponse, categoriesResponse] =
    await Promise.all([
      fetch(`${API_URL}/events`, {
        cache: "no-store",
      }),
      fetch(`${API_URL}/events/most-popular`, {
        cache: "no-store",
      }),
      fetch(`${API_URL}/categories`, {
        cache: "no-store",
      }),
    ]);

  if (!eventsResponse.ok || !popularResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch landing page data");
  }

  const events: Event[] = await eventsResponse.json();
  const mostPopularEvents: Event[] = await popularResponse.json();
  const categories: EventCategory[] = await categoriesResponse.json();

  return (
    <main>
      <Navbar isLoggedIn={false} />

      <HeroSection />

      <FeaturedEvents events={mostPopularEvents} />

      <ExploreEvents
        events={events}
        categories={categories}
      />

      <WhyTixora />

      <UpcomingEvents />

      <HowItWorks />

      <CtaSection />
    </main>
  );
}