/**
 * Phone layout (below MOBILE_MAX px wide): the boot lives in a band at the
 * top of the screen, from under the nav + product bar down to the zone line;
 * the copy sits below it and fades out (see .stage__veil) before it can scroll
 * up into the boot.
 */
export const MOBILE_MAX = 820
/** Top of the boot band: nav (64) + sticky product bar (46). */
export const BAND_TOP = 110
/** Zone line in px from the top: the bottom of the boot band. */
export const zoneLine = (h) => Math.round(h * 0.5)
