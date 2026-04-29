export type PassportOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let origin: PassportOrigin | null = null;

export function setPassportOrigin(next: PassportOrigin | null): void {
  origin = next;
}

export function getPassportOrigin(): PassportOrigin | null {
  return origin;
}
