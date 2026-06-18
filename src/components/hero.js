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

      <!-- Trophy — ghost behind text when no transparency; replace with transparent PNG for crisp foreground -->
      <img
        class="hero__trophy-bg"
        src="assets/trophy-cup.png"
        alt=""
        aria-hidden="true"
        style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);height:88%;max-height:640px;object-fit:contain;opacity:0.55;pointer-events:none;z-index:0;mix-blend-mode:multiply;"
      />

      <!-- Foreground content -->
      <div class="hero__content" style="position:relative;z-index:1;text-align:center;padding:clamp(60px,10vw,100px) 16px clamp(40px,6vw,80px);">
        <div class="hero__title" style="font-family:var(--font-display);font-size:clamp(52px,10vw,88px);letter-spacing:3px;color:var(--color-gold-bright);text-transform:uppercase;line-height:1;">
          Sepoy Cup 2026
        </div>
        <div class="hero__subtitle" style="font-size:13px;letter-spacing:4px;color:var(--color-gold);text-transform:uppercase;margin-top:12px;">
          FC24 · Family Cup
        </div>
        <div style="margin-top:28px;">
          <div class="hero__status" style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:2px solid var(--color-gold);border-radius:20px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${stageColor};">
            <span style="width:6px;height:6px;border-radius:50%;background:${stageColor};${!complete ? 'animation:pulse 2s infinite;' : ''}display:inline-block;"></span>
            ${stageLabel}
          </div>
        </div>
      </div>
    </div>
  `

  // GSAP entrance
  const bg     = el.querySelector('.hero__trophy-bg')
  const title  = el.querySelector('.hero__title')
  const sub    = el.querySelector('.hero__subtitle')
  const status = el.querySelector('.hero__status')

  gsap.set([title, sub, status], { opacity: 0 })
  gsap.set(bg,     { opacity: 0, scale: 1.1 })
  gsap.set(title,  { y: -30 })
  gsap.set([sub, status], { y: 20 })

  const tl = gsap.timeline({ delay: 0.15 })
  tl.to(bg,     { opacity: 0.55, scale: 1, duration: 1.2, ease: 'power2.out' })
    .to(title,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.7')
    .to(sub,    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to(status, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')

  // Gentle breathe on the background trophy
  gsap.to(bg, { y: -14, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 })
}
