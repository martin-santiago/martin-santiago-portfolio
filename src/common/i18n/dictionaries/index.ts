import type { Locale } from "../locales";
import { en } from "./en";
import { type Dictionary, es } from "./es";

export type { Dictionary };

export const DICTIONARIES: Record<Locale, Dictionary> = { es, en };
