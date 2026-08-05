/**
 * Static text now — previously this ran its own SplitText-style
 * char-by-char reveal on a delay. That was a real bug: this span sits
 * *inside* the `<h1>` that Hero.tsx's own SplitText splits into
 * lines/chars, and SplitText rebuilds that DOM subtree as a layout
 * effect, which runs before this component's own effect could populate
 * it — a race that made the text sometimes never render, and always
 * added a redundant delay on top of Hero's own reveal. Hero's SplitText
 * already animates this text in as part of the full headline; it needs
 * nothing of its own.
 */
export function ChangingText() {
  return <span className="changing-text">AI Precision</span>
}
