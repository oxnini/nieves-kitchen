import { Courier_Prime } from 'next/font/google';

/**
 * The passport cancellation face (CancellationMark): it needs a real bold
 * weight, and Cutive Mono only ships at 400, so the date/title read at small
 * sizes. Loaded only by the layouts whose pages draw cancellations
 * (app/journal, app/dev), not the root layout, so other pages don't download
 * it (audit F21, spec §4.1). Apply `stampCancel.variable` to a wrapper there.
 */
export const stampCancel = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-stamp-cancel',
  weight: ['400', '700'],
  display: 'swap',
});
