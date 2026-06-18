import { gsap } from 'gsap'
import { isTournamentComplete, isGroupStageComplete } from '../lib/knockout.js'

export function renderHero(el, data) {
  const complete   = isTournamentComplete(data.fixtures)
  const knockouts  = !complete && isGroupStageComplete(data.fixtures)
  const stageLabel = complete ? 'Complete' : knockouts ? 'Knockout Stage' : 'Group Stage'
  const stageColor = complete ? 'var(--color-gold-bright)' : 'var(--color-success)'

  el.innerHTML = `
    <div class="hero__inner" style="position:relative;overflow:hidden;min-height:clamp(480px,70vh,720px);display:flex;align-items:center;justify-content:center;">

      <!-- Background glow -->
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(240,192,96,0.10) 0%,transparent 65%);pointer-events:none;z-index:0;"></div>

      <!-- Trophy — transparent PNG, foreground element right of text -->
      <img
        class="hero__trophy"
        src="assets/trophy-cup.png"
        alt="The Sepoy Cup"
        style="position:absolute;bottom:0;right:clamp(2%,8vw,12%);height:92%;max-height:660px;object-fit:contain;pointer-events:none;z-index:0;filter:drop-shadow(0 0 40px rgba(212,165,116,0.35)) drop-shadow(0 20px 60px rgba(0,0,0,0.6));"
      />

      <!-- Foreground content — left-aligned on wide screens, centred on mobile -->
      <div class="hero__content" style="position:relative;z-index:1;text-align:left;padding:clamp(80px,12vw,120px) clamp(24px,8vw,100px);max-width:640px;">
        <div class="hero__title" style="font-family:var(--font-hero);font-weight:700;font-size:clamp(56px,9vw,100px);letter-spacing:2px;color:var(--color-gold-bright);text-transform:uppercase;line-height:0.95;">
          Sepoy<br>Cup 2026
        </div>
        <div class="hero__subtitle" style="font-family:var(--font-hero);font-weight:600;font-size:clamp(16px,2.4vw,22px);letter-spacing:5px;color:var(--color-gold);text-transform:uppercase;margin-top:18px;">
          FC24 · Family Cup
        </div>
        <div style="margin-top:32px;">
          <div class="hero__status" style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:2px solid var(--color-gold);border-radius:20px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${stageColor};">
            <span style="width:6px;height:6px;border-radius:50%;background:${stageColor};${!complete ? 'animation:pulse 2s infinite;' : ''}display:inline-block;"></span>
            ${stageLabel}
          </div>
        </div>
      </div>
    </div>
  `

  // GSAP entrance
  const trophy = el.querySelector('.hero__trophy')
  const title  = el.querySelector('.hero__title')
  const sub    = el.querySelector('.hero__subtitle')
  const status = el.querySelector('.hero__status')

  gsap.set([title, sub, status], { opacity: 0 })
  gsap.set(trophy, { opacity: 0, x: 60, scale: 0.92 })
  gsap.set(title,  { y: -20 })
  gsap.set([sub, status], { y: 16 })

  const tl = gsap.timeline({ delay: 0.15 })
  tl.to(trophy, { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' })
    .to(title,  { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.7')
    .to(sub,    { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.35')
    .to(status, { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.25')

  // Float
  gsap.to(trophy, { y: -16, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 })
}
