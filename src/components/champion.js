import { gsap } from 'gsap'
import { renderCertificate } from './certificate.js'
import { flagIcon } from '../lib/utils.js'

export function renderChampion(el, data) {
  if (!data.champion) return

  const team = data.teams[data.champion]
  el.removeAttribute('hidden')
  el.className = 'section section--dark'
  el.style.textAlign = 'center'

  el.innerHTML = `
    <div class="container">
      <div class="champion-flag" style="margin-bottom:16px;">${flagIcon(data.champion, team?.flag, 'xl')}</div>
      <div class="display" style="font-family:var(--font-display);font-size:clamp(40px,8vw,72px);color:var(--color-gold-bright);letter-spacing:3px;text-transform:uppercase;line-height:1;">
        ${team?.name ?? data.champion}
      </div>
      <div style="font-size:14px;letter-spacing:4px;color:var(--color-gold);text-transform:uppercase;margin-top:12px;">
        Sepoy Cup 2026 Champion
      </div>
      <div style="margin-top:32px;">
        <button id="cert-download-btn" style="background:var(--color-gold-bright);color:var(--color-navy-dark);border:none;padding:14px 28px;border-radius:4px;font-weight:700;font-size:13px;letter-spacing:2px;cursor:pointer;text-transform:uppercase;">
          🏅 Download Certificate
        </button>
      </div>
      <div id="confetti-container" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>
    </div>
  `

  spawnConfetti(el.querySelector('#confetti-container'))

  // Entrance animation
  gsap.from(el, { opacity: 0, duration: 0.8, ease: 'power2.out' })
  gsap.from(el.querySelector('.champion-flag'), { scale: 0, duration: 0.6, delay: 0.3, ease: 'back.out(1.7)' })
  gsap.from(el.querySelector('.display'), { y: 30, opacity: 0, duration: 0.6, delay: 0.5, ease: 'power3.out' })

  el.querySelector('#cert-download-btn').addEventListener('click', () => {
    renderCertificate(data)
  })
}

function spawnConfetti(container) {
  const colors = ['#f0c060', '#d4a574', '#ffffff', '#c9a340', '#f5f1e8']
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div')
    const size  = Math.random() * 8 + 4
    piece.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      top:-20px;
      border-radius:${Math.random() > 0.5 ? '50%' : '0'};
      opacity:${Math.random() * 0.8 + 0.2};
    `
    container.appendChild(piece)
    gsap.to(piece, {
      y: container.offsetHeight + 40,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 1.5,
      ease: 'power1.in',
      repeat: -1,
      repeatDelay: Math.random() * 3,
    })
  }
}
