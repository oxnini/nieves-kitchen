import Link from 'next/link';

export const metadata = {
  title: "About — Nieves' Kitchen",
  description: "Learn about the story behind Nieves' Kitchen — halal recipes from around the world.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brown-dark mb-10 sm:mb-14 text-center tracking-tight">
        About Nieves&#39; Kitchen
      </h1>

      <article className="text-brown-dark leading-relaxed text-base sm:text-lg max-w-[65ch] mx-auto">
        <p className="first-letter:font-heading first-letter:text-[3.2rem] first-letter:sm:text-[3.8rem] first-letter:font-bold first-letter:text-terracotta first-letter:float-left first-letter:leading-[0.8] first-letter:mr-2 first-letter:mt-1 mb-6">
          Having lived in different places and grown up around diverse cuisines, I&apos;ve collected
          these recipes over the years. Every dish you find here is{' '}
          <strong>100% halal</strong>, personally tried, tested, and deeply loved.
        </p>
        <p className="mb-6">
          I&apos;m ethnically Chinese, born and raised in Spain, and I&apos;ve lived across Asia and Europe.
          Food has always been the thread that connects the cultures I&apos;ve been part of. Whether it&apos;s
          my grandmother&apos;s dumpling technique meeting Italian pasta, or Moroccan spices finding their
          way into a weeknight supper — these recipes are a reflection of that journey.
        </p>

        {/* Pull quote */}
        <blockquote className="relative my-10 sm:my-14 py-6 border-y border-brown-light/25">
          <p className="font-heading text-xl sm:text-2xl text-brown-dark text-center italic leading-snug">
            To understand a culture, you need to understand its food.
          </p>
        </blockquote>

        <p className="mb-6">
          And to truly understand food, you need to cook it yourself — to smell the spices, feel the
          dough, and taste as you go. I built this space to share the warmth of those experiences with you.
        </p>
        <p>
          Whether you&apos;re looking for a quick weeknight meal, a macro-friendly prep, or a slow-cooked
          weekend feast, I hope you find something here that brings joy to your table.
        </p>
      </article>

      <div className="mt-12 flex flex-col items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta/90 transition-colors shadow"
        >
          Explore the map
        </Link>
        <Link
          href="/recipes"
          className="text-sm text-brown-medium hover:text-brown-dark transition-colors underline underline-offset-4 decoration-brown-light/40"
        >
          Or browse all recipes
        </Link>
      </div>

      <hr className="mt-16 mb-10 border-0 h-px bg-brown-light/30 w-24 mx-auto" />
      <p className="text-center text-sm sm:text-base tracking-[0.22em] uppercase text-brown-medium leading-loose">
        100% Halal &nbsp;·&nbsp; Globally Inspired
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> &nbsp;·&nbsp; </span>
        Macro-Friendly &nbsp;·&nbsp; Tried &amp; Tested
      </p>
    </div>
  );
}
