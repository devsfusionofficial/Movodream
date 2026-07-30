/**
 * Ported behavior needs one bit of state shared across two homepage
 * sections: in the original single-file script.js, `cardExpanded` (set by
 * ImmersiveBooking's section-2 logic) is read directly by AdvantageArc's
 * mobile ScrollTrigger to pick its pin start position. Now that each
 * section is its own component, this tiny shared mutable object is the
 * bridge — simplest way to keep that cross-section dependency without
 * threading props through the whole page.
 */
export const homepageScrollState = {
  cardExpanded: false,
}
