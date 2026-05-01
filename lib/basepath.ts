export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prepend the static export base path to a public asset URL. */
export const publicUrl = (path: string) =>
  `${BASE_PATH}${path}`;
