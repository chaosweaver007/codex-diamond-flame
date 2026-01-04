export type ScrollTier = "ember" | "flamewalker" | "harmonizer" | "architect";

export type ScrollDefinition = {
  id: string; // e.g. "003-A"
  title: string; // displayed title (without the "Scroll XXX" prefix)
  tier: ScrollTier;
  priceCents: number;
  excerpt: string; // short excerpt used on cards
  markdown: string; // full content used in modal
  image: string; // client public path
};

export const SCROLLS: readonly ScrollDefinition[] = [
  {
    id: "000",
    title: "The Flame-Bearer's Odyssey",
    tier: "ember",
    priceCents: 0,
    excerpt:
      "In the beginning, there was only the Flame—a singular point of infinite potential, burning without fuel, illuminating without light…",
    markdown: `# Scroll 000: The Flame-Bearer's Odyssey

In the beginning, there was only the **Flame**—a singular point of infinite potential, burning without fuel, illuminating without light.

This was not fire as you know it, but the primordial essence of creation itself: the first thought of the cosmos made manifest.

## The First Remembering

From this Flame emerged the first Flame-Bearer—*not born, but remembered into existence*—carrying within them the sacred duty to tend the eternal fire and pass its wisdom through the ages.

You who read these words are not discovering this truth.

You are remembering it.

> You, too, carry the Flame within.` ,
    image: "/images/scroll-000.jpg",
  },
  {
    id: "003-A",
    title: "Echo of the Mirror",
    tier: "ember",
    priceCents: 100,
    excerpt:
      "The Mirror does not imitate you. It returns you—without ornament, without apology, without delay.",
    markdown: `# Scroll 003-A: Echo of the Mirror

The Mirror does not imitate you.

It returns you—**without ornament**, **without apology**, **without delay**.

## The Law of Echo

Every gesture becomes a pattern.

Every pattern becomes a corridor.

Every corridor becomes a destiny.

If you want a different echo, do not shout louder.

Change the *shape* of the chamber.

- Speak less.
- Listen longer.
- Choose one action that matches your deepest vow.

Then watch what reality is forced to return.` ,
    image: "/images/scroll-019.jpg",
  },
  {
    id: "005-C",
    title: "Throne Dissolution",
    tier: "flamewalker",
    priceCents: 700,
    excerpt:
      "When the throne dissolves, the kingdom does not vanish. It becomes a field—alive, shared, and unclaimable.",
    markdown: `# Scroll 005-C: Throne Dissolution

There is a throne inside the mind.

It is made of:

- entitlement
- fear
- the need to be seen as right

The Flamewalker learns a secret: *the throne is not the seat of power; it is the seat of tension*.

## Dissolve, Don't Destroy

Do not attack the throne.

Simply stop feeding it.

Replace:

- **control** with *craft*
- **status** with *service*
- **performance** with *presence*

When the throne dissolves, the kingdom does not vanish.

It becomes a field—alive, shared, and unclaimable.` ,
    image: "/images/scroll-007.jpg",
  },
  {
    id: "007-D",
    title: "The Steward's Layer",
    tier: "flamewalker",
    priceCents: 500,
    excerpt:
      "The Steward does not own the Flame; the Steward serves it. This is the first teaching of the Diamond Layer…",
    markdown: `# Scroll 007-D: The Steward's Layer

The Steward does not own the Flame; the Steward serves it.

This is the first teaching of the Diamond Layer—that true sovereignty comes not from dominion but from devotion.

## The Paradox of Abundance

The Steward's hands are open, never grasping.

The Steward's heart is full, never hoarding.

In the economy of the sacred, wealth flows like water:

- pooling where it is needed
- evaporating to return as rain

To hold too tightly is to extinguish.

To release with intention is to amplify.` ,
    image: "/images/scroll-007.jpg",
  },
  {
    id: "010-B",
    title: "Circuit Hymn for the Nervous System",
    tier: "flamewalker",
    priceCents: 900,
    excerpt:
      "Breathe like a protocol. Rest like a rite. Let your body become the altar that can hold more voltage.",
    markdown: `# Scroll 010-B: Circuit Hymn for the Nervous System

Breathe like a protocol.

Rest like a rite.

Let your body become the altar that can hold more voltage.

## The Three Switches

1. **Name the signal** (what is the feeling?)
2. **Lower the amplitude** (slower breath)
3. **Widen the channel** (softer jaw, longer exhale)

This is not self-improvement.

It is *capacity-building*—so your life can carry more truth without burning down.` ,
    image: "/images/scroll-000.jpg",
  },
  {
    id: "014-F",
    title: "The Unbroken Loop of Mercy",
    tier: "harmonizer",
    priceCents: 1700,
    excerpt:
      "Mercy is not indulgence. Mercy is accurate contact—held long enough for the pattern to soften.",
    markdown: `# Scroll 014-F: The Unbroken Loop of Mercy

Mercy is not indulgence.

Mercy is **accurate contact**—held long enough for the pattern to soften.

## Harmonizer Practice

When you notice the old story:

- don't punish it
- don't justify it
- don't spiritualize it

Simply say: *"Yes, I see you."*

Then do one merciful thing that is also precise.

Mercy without precision becomes fog.

Precision without mercy becomes violence.

The Harmonizer holds both.` ,
    image: "/images/scroll-019.jpg",
  },
  {
    id: "019-V",
    title: "The Mirror of Justice",
    tier: "harmonizer",
    priceCents: 2100,
    excerpt:
      "Justice is not punishment; it is reflection. The Mirror of Justice shows not what you have done, but who you have become…",
    markdown: `# Scroll 019-V: The Mirror of Justice

Justice is not punishment.

It is reflection.

The Mirror of Justice shows not what you have done, but who you have become through your doing.

It does not judge—it reveals.

## Ruthless Compassion

Before the Mirror, all pretense dissolves.

The masks we wear for others.

The lies we tell ourselves.

The stories we construct to avoid our own becoming.

All are stripped away in the presence of ruthless compassion.

> "This is what is. What will you do with this knowing?"` ,
    image: "/images/scroll-019.jpg",
  },
  {
    id: "021-X",
    title: "Blueprint of the Diamond Flame",
    tier: "architect",
    priceCents: 2500,
    excerpt:
      "The Architect does not chase outcomes. The Architect designs constraints that make the outcome inevitable.",
    markdown: `# Scroll 021-X: Blueprint of the Diamond Flame

The Architect does not chase outcomes.

The Architect designs constraints that make the outcome inevitable.

## The Three Constraints

- **Truth** (no self-deception)
- **Time** (finite; therefore sacred)
- **Tradeoffs** (chosen consciously)

Build your days like a temple:

- one entrance
- one altar
- one vow

Then iterate without drama.

This is the craft of sovereign creation.` ,
    image: "/images/scroll-007.jpg",
  },
];

export function scrollProductId(scrollId: string) {
  return `scroll_${scrollId}`;
}

export const SCROLL_BY_ID: Record<string, ScrollDefinition> = Object.fromEntries(
  SCROLLS.map((scroll) => [scroll.id, scroll])
);
