'use client'

import Image from 'next/image'
import Atropos from 'atropos/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'atropos/css'
import { useMediaQuery } from '@/lib/use-media-query'

const MOBILE_QUERY = '(max-width: 768px)'

/**
 * Ported from script.js lines 909–977: cards "deal" in with a
 * rotate+translate+fade entrance, then — once dealt — card2/card3 animate
 * on scroll toward card1's on-screen center (computed via
 * getBoundingClientRect after the deal completes), matching the original's
 * exact scrub/easing values for mobile vs desktop.
 *
 * Atropos init (highlight/shadow disabled) matches script.js line 1130:
 * `Atropos({ el, highlight: false, shadow: false })`.
 */
export function HeroCards() {
  // Which layout applies is tracked live via matchMedia, not read once from
  // window.innerWidth inside the animation effect below. A one-time read
  // locks in whichever branch matched at first paint — resizing the
  // viewport afterward (DevTools' responsive mode without a reload is the
  // common way to hit this) never re-evaluated it, so the page stayed on
  // the desktop GSAP animation permanently once it had loaded at desktop
  // width, even though the CSS had already switched to mobile layout. GSAP
  // writes inline transform/opacity styles, which beat every CSS rule
  // including the mobile fan, so nothing in the stylesheet could have
  // masked that. null is "not yet known" (first paint, before the browser
  // APIs useSyncExternalStore needs are available to compare against).
  const isMobile = useMediaQuery(MOBILE_QUERY)

  useGSAP(() => {
    // Breakpoint not yet known (first render, before the effect above runs)
    // — wait rather than guess, so nothing animates in on the wrong layout.
    if (isMobile === null) return

    gsap.registerPlugin(ScrollTrigger)

    const card1 = document.querySelector<HTMLElement>('.card1')
    const card2 = document.querySelector<HTMLElement>('.card2')
    const card3 = document.querySelector<HTMLElement>('.card3')
    if (!card1 || !card2 || !card3) return

    // useGSAP reverts everything this callback created — tweens, their
    // inline style writes, and ScrollTriggers — whenever `isMobile` flips
    // and the effect reruns, and also calls whatever cleanup function is
    // returned below. That revert is what makes crossing the breakpoint
    // safe: switching from desktop to mobile clears GSAP's inline styles
    // before the mobile branch's CSS classes take over, and switching back
    // removes the click handlers/slot classes before the desktop tweens
    // start fresh.

    // Small screens lay the cards out as a fanned hand in CSS (see the
    // max-width: 560px block in homepage.css) and let a tap bring one to the
    // front. The deal/collapse below is skipped there: its tweens write
    // inline transforms, which would win over the fan and strand the cards
    // wherever the scrub happened to leave them.
    if (isMobile) {
      // Three CSS slots (front / back1 / back2 — see the max-width: 560px
      // block in homepage.css) get assigned to whichever card is playing
      // that role, tracked as a back-to-front stack. This is deliberate:
      // an earlier version hard-coded card3 as "always front" with only
      // card1/card2 having a back position, so tapping card2 promoted it
      // on top of card3 with nowhere for card3 to retreat to — it just sat
      // there, fully covered, and there was nothing left to tap. Rotating
      // the stack instead guarantees the same one-front-two-peeking
      // arrangement after every tap, regardless of tap order.
      const SLOTS = ['card-slot-back1', 'card-slot-back2', 'card-slot-front']
      let stack = [card1, card2, card3]

      const applySlots = () => {
        stack.forEach((card, i) => {
          card.classList.remove(...SLOTS)
          card.classList.add(SLOTS[i])
        })
      }
      applySlots()

      const activate = (target: HTMLElement) => {
        if (stack[stack.length - 1] === target) return
        stack = [...stack.filter((c) => c !== target), target]
        applySlots()
      }

      const cards = [card1, card2, card3]
      const teardown = cards.map((card) => {
        const onClick = () => activate(card)
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          e.preventDefault()
          activate(card)
        }
        // These are operable now, so they need a role and a tab stop.
        card.setAttribute('role', 'button')
        card.setAttribute('tabindex', '0')
        card.addEventListener('click', onClick)
        card.addEventListener('keydown', onKeyDown)
        return () => {
          card.removeAttribute('role')
          card.removeAttribute('tabindex')
          card.removeEventListener('click', onClick)
          card.removeEventListener('keydown', onKeyDown)
          card.classList.remove(...SLOTS)
        }
      })

      return () => teardown.forEach((fn) => fn())
    }

    gsap.set(card1, { opacity: 0, rotation: 0, y: 20, x: -30 })
    gsap.set(card2, { opacity: 0, rotation: 0, y: 30, x: 40 })
    gsap.set(card3, { opacity: 0, rotation: 0, y: 40, x: -20 })

    const deal = gsap.timeline({ delay: 0.25 })

    deal
      .to(card1, { opacity: 1, rotation: 3, y: 0, x: 0, duration: 1.15, ease: 'expo.out' }, 0.1)
      .to(card2, { opacity: 1, rotation: -6, y: 0, x: 0, duration: 1.25, ease: 'expo.out' }, 1)
      .to(card3, { opacity: 1, rotation: 6, y: 0, x: 0, duration: 1.2, ease: 'expo.out' }, 2)

    deal.eventCallback('onComplete', () => {
      const r1 = card1.getBoundingClientRect()
      const r2 = card2.getBoundingClientRect()
      const r3 = card3.getBoundingClientRect()

      const cx = r1.left + r1.width / 2
      const cy = r1.top + r1.height / 2

      const dx2 = cx - (r2.left + r2.width / 2)
      const dy2 = cy - (r2.top + r2.height / 2)
      const dx3 = cx - (r3.left + r3.width / 2)
      const dy3 = cy - (r3.top + r3.height / 2)

      gsap.to(card1, {
        rotation: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          scroller: document.body,
          start: isMobile ? 'top -70%' : 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.5 : 2,
        },
      })

      gsap.to(card2, {
        x: dx2,
        y: dy2,
        rotation: -2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          scroller: document.body,
          start: isMobile ? 'top -70%' : 'top top',
          end: isMobile ? 'top -100%' : 'bottom 85%',
          scrub: isMobile ? 0.5 : 1.4,
        },
      })

      gsap.to(card3, {
        x: dx3,
        y: dy3,
        rotation: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          scroller: document.body,
          start: isMobile ? 'top -70%' : 'top top',
          end: isMobile ? 'top -100%' : 'bottom 85%',
          scrub: isMobile ? 0.5 : 2.6,
        },
      })
    })
    // revertOnUpdate is required, not optional, here: without it useGSAP
    // defers cleanup to unmount instead of reverting on each dependency
    // change, so re-running this effect after isMobile flips would layer
    // the new branch's listeners/classes on top of the previous branch's
    // still-live GSAP tweens and ScrollTriggers rather than replacing them
    // — silently reintroducing the exact bug this state is meant to fix.
  }, { dependencies: [isMobile], revertOnUpdate: true })

  return (
    <div className="cards-wrapper">
      <Atropos className="card1" highlight={false} shadow={false}>
        <div className="card">
          <div data-atropos-offset="3" className="card-header">
            <Image src="/assets/icons/hero-card1-live-travel.svg" alt="" width={40} height={40} style={{ width: 'auto', height: 'auto' }} />
            <div className="text">
              <h3>Live Travel Mode</h3>
              <p className="sub">ACTIVE</p>
            </div>
          </div>
          <div data-atropos-offset="4" className="m2">
            Real food near me. Not tourist traps.
          </div>
          <div data-atropos-offset="4" className="m1">
            Three expert-verified spots within 2 minutes. Ride Inn Cafe (4.9⭐) — view shows the kitchen. Open now.
            Walk with AR?
          </div>
          <div data-atropos-offset="4" className="m2 last">
            Let&apos;s go.
          </div>
          <div data-atropos-offset="3" className="process" />
        </div>
      </Atropos>

      <Atropos className="card2" highlight={false} shadow={false}>
        <span data-atropos-offset="2" className="tag">
          <Image src="/assets/icons/hero-card2-tag.svg" alt="" width={14} height={14} style={{ width: 'auto', height: 'auto' }} />
          See Before You Go
        </span>
        <Image
          data-atropos-offset="-2"
          src="/assets/images/ar-guide.jpeg.webp"
          draggable={false}
          alt="Travel Planner AI Lake"
          width={288}
          height={200}
          style={{ width: '100%', height: 'auto' }}
        />
        <h2 data-atropos-offset="0">
          <i style={{ fontSize: '0.9em' }} className="fa-solid fa-vr-cardboard" /> AR/VR interface overlay
        </h2>
        <p data-atropos-offset="0" className="desc">
          Preview hotel room <span className="dot">·</span> Walk the trail <span className="dot">·</span> Stand at
          landmark
        </p>
        <p data-atropos-offset="0" className="sub">
          What you see is what you get.
        </p>
        <div data-atropos-offset="4" className="card-bottom">
          <div className="circles">
            <span className="circle circle1" />
            <span className="circle circle2" />
          </div>
          <button type="button" className="icon">
            <Image src="/assets/icons/hero-card2-expand.svg" alt="" width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
          </button>
        </div>
      </Atropos>

      <Atropos className="card3" highlight={false} shadow={false}>
        <Image
          data-atropos-offset="2"
          className="green-tick-stamp"
          src="/assets/images/green-tick.webp"
          alt="Green Tick"
          width={60}
          height={60}
          style={{ width: '60px', height: '60px' }}
        />
        <div data-atropos-offset="2" className="header">
          <h3>Journey Intelligence</h3>
          <Image src="/assets/icons/hero-card3-dots.svg" alt="" width={16} height={4} style={{ width: '16px', height: '4px' }} />
          <Image src="/assets/images/expert-verified-badge.webp" alt="expert verified" width={80} height={24} style={{ width: '80px', height: '24px' }} />
        </div>

        <p data-atropos-offset="2" className="sub">
          Delhi → Manali | 7h 20m
        </p>
        <div data-atropos-offset="3" className="points">
          <div className="p1">
            <div className="circle" />
            <div className="text">
              <span className="time">Traffic</span>
              <h3>Clear</h3>
            </div>
          </div>
          <div className="p2">
            <div className="circle" />
            <div className="text">
              <span className="time">Expert-Verified stops en route</span>
              <h3>6</h3>
            </div>
          </div>
          <div className="p3">
            <div className="circle" />
            <div className="text">
              <span className="time">Your guide</span>
              <h3>Active</h3>
            </div>
          </div>
          <div className="p1">
            <div className="circle" />
            <div className="text">
              <span className="time">Next alert</span>
              <h3>Scenic point in 18 min</h3>
            </div>
          </div>
        </div>
      </Atropos>
    </div>
  )
}
