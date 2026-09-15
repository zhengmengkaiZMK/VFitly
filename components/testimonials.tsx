"use client";

import { useState } from "react";
import { Heading } from "./heading";
import { cn } from "@/lib/utils";
import { InViewDiv } from "./in-view-div";
import { useMemo } from "react";
import { TestimonialColumnContainer } from "./testimonial-column-container";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Testimonials = () => {
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh");

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">
        {isZh
          ? "为爱美女性打造的 AI 试衣体验"
          : "Why Shoppers Use Virtual Try On"}
      </Heading>
      <p className="text-sm md:text-base my-4 text-muted font-normal dark:text-muted-dark text-center max-w-lg mx-auto">
        <span className="block text-balance">
          {isZh
            ? "在下单前预览衣服穿在自己身上的真实效果，轻松比较搭配、版型和风格，买衣服更安心。"
            : "Preview how clothes look on you before checkout, compare styles with confidence, and make every purchase feel easier. These previews cannot guarantee fit or replace an in-person fitting."}
        </span>
      </p>
      <TestimonialGrid />
    </div>
  );
};

interface Testimonial {
  name: string;
  quote: string;
  src: string;
  designation?: string;
}

const testimonials = [
  {
    name: "Emma Williams",
    quote:
      "I used to hesitate before buying dresses online. Now I can preview how the outfit looks on me first, and it makes checkout feel so much more confident.",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    designation: "Fashion Lover",
  },
  {
    name: "Sophia Miller",
    quote:
      "Seeing the clothes on my own photo helped me compare styles before ordering. It feels like having a fitting room on my phone.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    designation: "Online Shopper",
  },
  {
    name: "Olivia Taylor",
    quote:
      "The 360° outfit video is my favorite feature. I can see how a look moves from different angles instead of guessing from product photos.",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    designation: "Style Creator",
  },
  {
    name: "Ava Johnson",
    quote:
      "Before buying a blazer, I tested it with several outfits in my wardrobe. It helped me choose the one that actually matched my style.",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    designation: "Working Professional",
  },
  {
    name: "Mia Anderson",
    quote:
      "This makes online shopping less stressful. I can check the overall vibe, color match, and silhouette before placing an order.",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    designation: "Everyday Fashion Buyer",
  },
  {
    name: "Isabella Brown",
    quote:
      "I saved so much time comparing outfits for a trip. The AI try-on previews made it easy to decide what was worth buying.",
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
    designation: "Travel & Lifestyle Shopper",
  },
  {
    name: "Charlotte Davis",
    quote:
      "Product photos never show how something might look on my body. This gives me a much clearer idea before I spend money.",
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    designation: "Boutique Customer",
  },
  {
    name: "Amelia Wilson",
    quote:
      "I love being able to build looks from different pieces and see the result instantly. It turns outfit planning into something fun.",
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80",
    designation: "Outfit Planner",
  },
  {
    name: "Harper Moore",
    quote:
      "The virtual try-on helped me avoid impulse buys. If the outfit does not look right on me, I know before it arrives at my door.",
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
    designation: "Smart Shopper",
  },
  {
    name: "Ella Martin",
    quote:
      "I can finally see whether a dress, coat, or top fits the look I want before ordering. It makes fashion decisions much easier.",
    src: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=300&q=80",
    designation: "Occasionwear Shopper",
  },
  {
    name: "Grace Lee",
    quote:
      "For social content, the dynamic outfit video is perfect. It shows the styling effect in motion, not just as a flat image.",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    designation: "Fashion Content Creator",
  },
  {
    name: "Lily Clark",
    quote:
      "I use it before almost every online clothing purchase now. It helps me feel sure that the item works with my wardrobe and my personal style.",
    src: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=300&q=80",
    designation: "Wardrobe Builder",
  },
];

function Testimonial({
  name,
  quote,
  src,
  designation,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"figure">, keyof Testimonial> &
  Testimonial) {
  let animationDelay = useMemo(() => {
    let possibleAnimationDelays = [
      "0s",
      "0.1s",
      "0.2s",
      "0.3s",
      "0.4s",
      "0.5s",
    ];
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ];
  }, []);

  const boxStyle = {};
  return (
    <figure
      className={cn(
        "animate-fade-in rounded-3xl bg-transparent p-8 opacity-0 shadow-derek dark:bg-neutral-900",
        className
      )}
      style={{
        animationDelay,
      }}
      {...props}
    >
      <div className="flex flex-col items-start">
        <div className="flex gap-2">
          <Image
            src={src}
            width={150}
            height={150}
            className="h-10 w-10 rounded-full"
             alt="VFitly，AI virtual try-on，generate try-on image and try-on video"
          />
          <div>
            <h3 className="text-sm  font-medium text-neutral-500 dark:text-neutral-300">
              {name}
            </h3>
            <p className="text-sm font-normal text-neutral-500 dark:text-neutral-300">
              {designation}
            </p>
          </div>
        </div>
        <p className="text-base text-muted mt-4 dark:text-muted-dark">
          {quote}
        </p>
      </div>
    </figure>
  );
}

function TestimonialColumn({
  testimonials,
  className,
  containerClassName,
  shift = 0,
}: {
  testimonials: Testimonial[];
  className?: string;
  containerClassName?: (reviewIndex: number) => string;
  shift?: number;
}) {
  return (
    <TestimonialColumnContainer className={cn(className)} shift={shift}>
      {testimonials
        .concat(testimonials)
        .map((testimonial, testimonialIndex) => (
          <Testimonial
            name={testimonial.name}
            quote={testimonial.quote}
            src={testimonial.src}
            designation={testimonial.designation}
            key={testimonialIndex}
            className={containerClassName?.(
              testimonialIndex % testimonials.length
            )}
          />
        ))}
    </TestimonialColumnContainer>
  );
}

function splitArray<T>(array: Array<T>, numParts: number) {
  let result: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i++) {
    let index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
}

function TestimonialGrid() {
  let columns = splitArray(testimonials, 3);
  let column1 = columns[0];
  let column2 = columns[1];
  let column3 = splitArray(columns[2], 2);
  return (
    <InViewDiv className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
      <TestimonialColumn
        testimonials={[...column1, ...column3.flat(), ...column2]}
        containerClassName={(tIndex) =>
          cn(
            tIndex >= column1.length + column3[0].length && "md:hidden",
            tIndex >= column1.length && "lg:hidden"
          )
        }
        shift={10}
      />
      <TestimonialColumn
        testimonials={[...column2, ...column3[1]]}
        className="hidden md:block"
        containerClassName={(tIndex) =>
          tIndex >= column2.length ? "lg:hidden" : ""
        }
        shift={15}
      />
      <TestimonialColumn
        testimonials={column3.flat()}
        className="hidden lg:block"
        shift={10}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black" />
    </InViewDiv>
  );
}
