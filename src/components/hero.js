import { gsap } from 'gsap'
import { isTournamentComplete, isGroupStageComplete } from '../lib/knockout.js'

export function renderHero(el, data) {
  const complete   = isTournamentComplete(data.fixtures)
  const knockouts  = !complete && isGroupStageComplete(data.fixtures)
  const stageLabel = complete ? 'Complete' : knockouts ? 'Knockout Stage' : 'Group Stage'
  const stageColor = complete ? 'var(--color-gold-bright)' : 'var(--color-success)'

  el.innerHTML = `
    <div style="text-align:center;padding:clamp(60px,10vw,120px) 16px clamp(48px,8vw,96px);position:relative;overflow:hidden;">
      <div class="hero-bg-glow" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(240,192,96,0.08) 0%,transparent 70%);pointer-events:none;"></div>
      <div class="hero__trophy-wrap" style="margin-bottom:24px;">
        <img
          class="hero__trophy"
          src="assets/trophy-legacy.png"
          alt="The Legacy Cup"
          style="height:clamp(120px,20vw,200px);margin:0 auto;filter:drop-shadow(0 8px 32px rgba(240,192,96,0.4));display:block;"
          onerror="this.style.fontSize='80px';this.style.height='auto';this.outerHTML='<div style=&quot;font-size:80px;text-align:center;margin:0 auto 24px;&quot;>🏆</div>'"
        />
      </div>
      <div class="hero__title display" style="font-family:var(--font-display);font-size:clamp(48px,10vw,80px);letter-spacing:3px;color:var(--color-gold-bright);text-transform:uppercase;line-height:1;">
        Sepoy Cup 2026
      </div>
      <div class="hero__subtitle" style="font-size:13px;letter-spacing:4px;color:var(--color-gold);text-transform:uppercase;margin-top:12px;">
        Edition I · FC24 · Family Cup
      </div>
      <div class="hero__status" style="display:inline-flex;align-items:center;gap:8px;margin-top:24px;padding:8px 20px;border:2px solid var(--color-gold);border-radius:20px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${stageColor};">
        <span style="width:6px;height:6px;border-radius:50%;background:${stageColor};${!complete ? 'animation:pulse 2s infinite;' : ''}display:inline-block;"></span>
        ${stageLabel}
      </div>
    </div>
  `

  // GSAP entrance animations
  const trophy = el.querySelector('.hero__trophy-wrap')
  const title  = el.querySelector('.hero__title')
  const sub    = el.querySelector('.hero__subtitle')
  const status = el.querySelector('.hero__status')

  gsap.set([trophy, title, sub, status], { opacity: 0 })
  gsap.set(trophy, { scale: 0.5, y: 30 })
  gsap.set(title,  { y: -30 })
  gsap.set([sub, status], { y: 20 })

  const tl = gsap.timeline({ delay: 0.2 })
  tl.to(trophy, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' })
    .to(title,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .to(sub,    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to(status, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')

  // Idle float loop on trophy
  gsap.to(trophy, {
    y: -10,
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 1,
  })
}
