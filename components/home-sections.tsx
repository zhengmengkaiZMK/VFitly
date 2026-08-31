"use client";

import { Hero } from "./hero";
import { GridFeatures } from "./grid-features";
import { Testimonials } from "./testimonials";
import { CTA } from "./cta";

export const HomeHero = () => {
  return (
    <div className="[&>div]:min-h-[85vh] [&>div]:pb-8 md:[&>div]:pb-12">
      <Hero />
    </div>
  );
};

export const HomeGridFeatures = () => {
  return (
    <div className="py-12 md:py-16">
      <GridFeatures />
    </div>
  );
};

export const HomeTestimonials = () => {
  return (
    <div className="[&>div]:py-12 [&>div]:md:py-20">
      <Testimonials />
    </div>
  );
};

export const HomeCTA = () => {
  return (
    <div className="[&>section]:py-16 [&>section]:md:py-24">
      <CTA />
    </div>
  );
};
