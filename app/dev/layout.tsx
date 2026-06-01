import { notFound } from 'next/navigation';

/**
 * Gate all `/dev/*` scratch routes behind NODE_ENV.
 *
 * These routes are visual iteration playgrounds (stamp previews, A/B
 * compositions, etc.) and must not be reachable in production. This
 * Server Component layout calls `notFound()` at request time when the
 * build is a production build, causing every `/dev/*` route to 404.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <>{children}</>;
}
