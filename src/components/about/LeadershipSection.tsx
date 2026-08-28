'use client'

import { useState } from 'react'
import Image from 'next/image'
import { LinkedInIcon } from '@/components/about/icons'

export type TeamMember = {
  name: string
  role: string
  image: string
  linkedin: string
}

interface LeadershipSectionProps {
  founders: TeamMember[]
  managementTeam: TeamMember[]
}

export function LeadershipSection({ founders, managementTeam }: LeadershipSectionProps) {
  const allMembers = [...founders, ...managementTeam]
  const [mobileIndex, setMobileIndex] = useState(0)

  const handlePrev = () => {
    setMobileIndex((prev) => (prev - 1 + allMembers.length) % allMembers.length)
  }

  const handleNext = () => {
    setMobileIndex((prev) => (prev + 1) % allMembers.length)
  }

  const activeMember = allMembers[mobileIndex]

  return (
    <section className="about-leadership">
      <div className="about-center">
        <span className="about-eyebrow">Leadership</span>
        <h2>Meet the Minds Behind Movodream</h2>
        <p>The visionaries, technologists, and builders shaping the future of AI-powered travel.</p>
      </div>

      {/* Desktop Grid Layout (2 by 3) */}
      <div className="about-leadership-desktop">
        <div className="about-leadership-container">
          {/* Row 1: Founders (2 cards) */}
          <div className="about-leadership-row about-leadership-row--founders">
            {founders.map((member) => (
              <article className="about-member-card" key={member.name}>
                <div className="about-member-photo-wrap">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={420}
                    className="about-member-photo"
                    sizes="(max-width: 980px) 50vw, 33vw"
                  />
                </div>
                <div className="about-member-info">
                  <div className="about-member-title-group">
                    <h3 className="about-member-name">{member.name}</h3>
                    <p className="about-member-role">{member.role}</p>
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-member-linkedin"
                    aria-label={`${member.name} on LinkedIn`}
                    title={`Connect with ${member.name} on LinkedIn`}
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Row 2: Management Team (3 cards) */}
          <div className="about-leadership-row about-leadership-row--team">
            {managementTeam.map((member) => (
              <article className="about-member-card" key={member.name}>
                <div className="about-member-photo-wrap">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={420}
                    className="about-member-photo"
                    sizes="(max-width: 980px) 33vw, 25vw"
                  />
                </div>
                <div className="about-member-info">
                  <div className="about-member-title-group">
                    <h3 className="about-member-name">{member.name}</h3>
                    <p className="about-member-role">{member.role}</p>
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-member-linkedin"
                    aria-label={`${member.name} on LinkedIn`}
                    title={`Connect with ${member.name} on LinkedIn`}
                  >
                    <LinkedInIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Slider Layout (Clean Photo with Overlay Arrows + Name, Role and Connect Now Below Photo) */}
      <div className="about-leadership-mobile">
        <div className="about-mobile-card-container">
          <article className="about-mobile-card" key={activeMember.name}>
            {/* Top Photo Box with Next/Prev Arrows */}
            <div className="about-mobile-photo-box">
              <Image
                src={activeMember.image}
                alt={activeMember.name}
                width={400}
                height={440}
                className="about-mobile-photo"
                priority
                sizes="(max-width: 640px) 85vw, 340px"
              />

              {/* Prev Navigation Arrow Overlay */}
              <button
                type="button"
                className="about-mobile-overlay-arrow about-mobile-overlay-arrow--prev"
                onClick={handlePrev}
                aria-label="Previous team member"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Next Navigation Arrow Overlay */}
              <button
                type="button"
                className="about-mobile-overlay-arrow about-mobile-overlay-arrow--next"
                onClick={handleNext}
                aria-label="Next team member"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Bottom Content Area: Clean Name & Designation on Left, LinkedIn Icon on Right */}
            <div className="about-mobile-content-box">
              <div className="about-mobile-title-group">
                <h3 className="about-mobile-name">{activeMember.name}</h3>
                <p className="about-mobile-role">{activeMember.role}</p>
              </div>

              <a
                href={activeMember.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="about-member-linkedin"
                aria-label={`${activeMember.name} on LinkedIn`}
                title={`Connect with ${activeMember.name} on LinkedIn`}
              >
                <LinkedInIcon />
              </a>
            </div>
          </article>

          {/* Pagination Indicators Below Card */}
          <div className="about-mobile-pagination">
            <span className="about-mobile-counter">
              <strong>0{mobileIndex + 1}</strong> / 0{allMembers.length}
            </span>
            <div className="about-mobile-dots">
              {allMembers.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`about-mobile-dot ${idx === mobileIndex ? 'active' : ''}`}
                  onClick={() => setMobileIndex(idx)}
                  aria-label={`Go to member ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
