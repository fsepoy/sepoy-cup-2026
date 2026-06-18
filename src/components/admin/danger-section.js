import { getPat } from './pat-section.js'
import { getFileMeta, writeData } from '../../lib/github.js'
import { showToast } from './toast.js'

export function renderDangerSection(el, data) {
  el.innerHTML = ''
  el.style.cssText =
    'border:2px solid rgba(138,42,42,0.5);border-radius:8px;padding:20px;margin-top:48px;'

  const title = document.createElement('h2')
  title.style.cssText =
    'font-family:var(--font-display);font-size:18px;letter-spacing:1px;color:#d47070;text-transform:uppercase;margin-bottom:8px;'
  title.textContent = 'Danger Zone'

  const desc = document.createElement('p')
  desc.style.cssText = 'font-size:13px;color:var(--color-text-muted);margin-bottom:16px;'
  desc.textContent = 'These actions modify tournament data and cannot be undone without a manual GitHub edit.'

  const clearBtn = document.createElement('button')
  clearBtn.style.cssText =
    'background:transparent;border:2px solid var(--color-danger);color:#d47070;padding:10px 18px;border-radius:4px;font-weight:700;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;'
  clearBtn.textContent = 'Clear All Scores'
  clearBtn.addEventListener('click', async () => {
    if (!confirm('This will clear every match score and reset the bracket. Are you sure?')) return
    await clearAllScores()
  })

  el.appendChild(title)
  el.appendChild(desc)
  el.appendChild(clearBtn)
}

async function clearAllScores() {
  const pat = getPat()
  if (!pat) { showToast('Enter your GitHub PAT first', 'error'); return }

  const { ok, sha, content, error } = await getFileMeta(pat)
  if (!ok) { showToast(`Read failed: ${error}`, 'error'); return }

  const reset = {
    ...content,
    champion: null,
    fixtures: content.fixtures.map(fx => ({
      ...fx,
      homeScore: null,
      awayScore: null,
      ...(fx.stage !== 'group' ? { home: 'TBD', away: 'TBD' } : {}),
    })),
  }

  const { ok: writeOk, error: writeErr } = await writeData(pat, reset, sha)
  if (!writeOk) { showToast(`Reset failed: ${writeErr}`, 'error'); return }

  showToast('All scores cleared — reload the page to refresh.', 'success')
}
