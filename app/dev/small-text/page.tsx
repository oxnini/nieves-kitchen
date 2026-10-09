import SmallTextLab from './SmallTextLab';

/**
 * /dev/small-text: audit F6. The one part of the small-text sweep that is a
 * taste call rather than a fix: the colophon lines that close /about and
 * /promise. Every functional label moved to Hanken in the F6 branch; these two
 * are editorial sign-offs, so production only lifted their ink from
 * brown-light (2.5:1) to brown-medium and kept Cutive Mono until the user
 * picks. Design sandbox only (404s in production via app/dev/layout.tsx).
 */
export default function DevSmallTextPage() {
  return <SmallTextLab />;
}
