export const metadata = {
  title: "About — Nieves' Kitchen",
  description: "Learn about the story behind Nieves' Kitchen — halal recipes from around the world.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brown-dark mb-8 text-center">
        About Nieves&#39; Kitchen
      </h1>

      <div className="space-y-6 text-brown-dark leading-relaxed">
        <p>
          Having lived in different places and grown up around diverse cuisines, I&apos;ve collected
          these recipes over the years. Every dish you find here is{' '}
          <strong>100% halal</strong>, personally tried, tested, and deeply loved.
        </p>
        <p>
          I&apos;m ethnically Chinese, born and raised in Spain, and I&apos;ve lived across Asia and Europe.
          Food has always been the thread that connects the cultures I&apos;ve been part of. Whether it&apos;s
          my grandmother&apos;s dumpling technique meeting Italian pasta, or Moroccan spices finding their
          way into a weeknight supper — these recipes are a reflection of that journey.
        </p>
        <p>
          I believe that to understand a culture, you need to understand its food. And to truly
          understand food, you need to cook it yourself — to smell the spices, feel the dough, and
          taste as you go. I built this space to share the warmth of those experiences with you.
        </p>
        <p>
          Whether you&apos;re looking for a quick weeknight meal, a macro-friendly prep, or a slow-cooked
          weekend feast, I hope you find something here that brings joy to your table.
        </p>
      </div>

      <hr className="mt-20 mb-10 border-0 h-px bg-brown-light/30 w-24 mx-auto" />
      <p className="text-center text-sm sm:text-base tracking-[0.22em] uppercase text-brown-medium leading-loose">
        100% Halal &nbsp;·&nbsp; Globally Inspired
        <br className="sm:hidden" />
        <span className="hidden sm:inline"> &nbsp;·&nbsp; </span>
        Macro-Friendly &nbsp;·&nbsp; Tried &amp; Tested
      </p>
    </div>
  );
}
