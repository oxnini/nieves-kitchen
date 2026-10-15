import type { Metadata } from 'next';
import { stampCancel } from '@/lib/fonts';

// The page is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "Your cook's journal · Nieves's Kitchen",
};

// The journal's stamps carry cancellation postmarks, drawn in Courier Prime,
// which loads only here and on /dev (audit F21). `contents`: no box of its own.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`contents ${stampCancel.variable}`}>{children}</div>;
}
