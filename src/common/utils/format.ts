import { CLOSE_DATE_TIME_ZONE } from "../constants/market";
import { INTL_LOCALES, type Locale } from "../i18n/locales";

export function formatUsd(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], { style: "currency", currency: "USD" }).format(amount);
}

export function formatShares(shares: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], { maximumFractionDigits: 4 }).format(shares);
}

export function formatPercentage(percentage: number, locale: Locale, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], { style: "percent", maximumFractionDigits }).format(percentage / 100);
}

export function formatCloseDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], {
    month: "short",
    day: "numeric",
    timeZone: CLOSE_DATE_TIME_ZONE,
  }).format(new Date(isoDate));
}

export function formatRank(rank: number): string {
  return String(rank).padStart(2, "0");
}

export function formatPercentagePoints(points: number, locale: Locale): string {
  const signedPoints = new Intl.NumberFormat(INTL_LOCALES[locale], {
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(points);
  return `${signedPoints}\u00a0pp`;
}

const SIGN_PART_TYPES: Intl.NumberFormatPartTypes[] = ["minusSign", "plusSign"];

// es-CL writes the sign after the symbol (US$-2.515,21); moving it to the front reads as a difference.
export function formatSignedUsd(amount: number, locale: Locale): string {
  const amountParts = new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: "currency",
    currency: "USD",
    signDisplay: "exceptZero",
  }).formatToParts(amount);
  const sign = amountParts.filter(({ type }) => SIGN_PART_TYPES.includes(type));
  const magnitude = amountParts.filter(({ type }) => !SIGN_PART_TYPES.includes(type));
  return [...sign, ...magnitude].map(({ value }) => value).join("");
}
