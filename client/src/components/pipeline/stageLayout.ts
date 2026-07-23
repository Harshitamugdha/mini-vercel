export interface StageLayout {
  section: string;
  content: string;
  fromX: number;
  fromY: number;
  fromScale: number;
  rotate: number;
}

export const STAGE_LAYOUTS: readonly StageLayout[] = [
  {
    section: "relative z-20 flex h-screen flex-col items-center justify-center px-6",
    content: "mx-auto w-full max-w-3xl text-center",
    fromX: 0,
    fromY: 16,
    fromScale: 0.98,
    rotate: 0,
  },
  {
    section: "relative z-20 flex min-h-[76vh] flex-col justify-center px-6 py-14 lg:pl-24 lg:pr-[8vw]",
    content: "ml-auto w-full max-w-[520px]",
    fromX: 46,
    fromY: 18,
    fromScale: 0.95,
    rotate: -1.4,
  },
  {
    section: "relative z-20 flex min-h-[72vh] flex-col justify-center px-6 py-12 lg:pl-[8vw] lg:pr-32",
    content: "w-full max-w-[560px]",
    fromX: -42,
    fromY: 24,
    fromScale: 0.95,
    rotate: 1.2,
  },
  {
    section: "relative z-20 flex min-h-[74vh] flex-col justify-center px-6 py-12 lg:pl-32 lg:pr-[10vw]",
    content: "ml-auto w-full max-w-[580px]",
    fromX: 38,
    fromY: 20,
    fromScale: 0.95,
    rotate: -1,
  },
  {
    section: "relative z-20 flex min-h-[70vh] flex-col justify-center px-6 py-12 lg:pl-[10vw] lg:pr-32",
    content: "w-full max-w-[500px]",
    fromX: -34,
    fromY: 22,
    fromScale: 0.96,
    rotate: 1,
  },
  {
    section: "relative z-20 flex min-h-[74vh] flex-col justify-center px-6 py-12 lg:pl-28 lg:pr-[7vw]",
    content: "ml-auto w-full max-w-[600px]",
    fromX: 48,
    fromY: 22,
    fromScale: 0.95,
    rotate: -1.2,
  },
  {
    section: "relative z-20 flex min-h-[86vh] flex-col items-center justify-center px-6 py-16 lg:px-16",
    content: "mx-auto w-full max-w-4xl text-center",
    fromX: 0,
    fromY: 28,
    fromScale: 0.94,
    rotate: 0,
  },
] as const;
