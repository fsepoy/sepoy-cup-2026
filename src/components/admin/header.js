export function renderAdminHeader(el) {
  el.innerHTML = ''
  el.style.cssText = 'border-bottom:2px solid var(--color-gold);padding-bottom:20px;margin-bottom:32px;'

  const title = document.createElement('h1')
  title.style.cssText = 'font-family:var(--font-display);font-size:32px;letter-spacing:2px;color:var(--color-gold-bright);text-transform:uppercase;'
  title.textContent = 'Sepoy Cup 2026 — Admin'

  const sub = document.createElement('p')
  sub.style.cssText = 'color:var(--color-text-muted);font-size:13px;margin-top:6px;'
  sub.textContent = 'Enter match scores and manage tournament data. Changes commit directly to GitHub.'

  const viewLink = document.createElement('a')
  viewLink.href = '/sepoy-cup-2026/'
  viewLink.style.cssText = 'color:var(--color-gold);font-size:12px;text-decoration:none;display:inline-block;margin-top:8px;letter-spacing:1px;'
  viewLink.textContent = '← View public site'

  el.appendChild(title)
  el.appendChild(sub)
  el.appendChild(viewLink)
}
