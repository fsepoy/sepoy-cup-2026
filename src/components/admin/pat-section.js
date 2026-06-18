const PAT_KEY = 'sc2026_pat'

export function getPat() {
  return localStorage.getItem(PAT_KEY) ?? ''
}

function savePat(value) {
  if (value) localStorage.setItem(PAT_KEY, value)
  else localStorage.removeItem(PAT_KEY)
}

export function renderPatSection(el) {
  el.style.cssText =
    'background:var(--color-navy-mid);border:2px solid var(--color-gold);border-radius:8px;padding:20px;margin-bottom:32px;'

  function rebuild() {
    el.innerHTML = ''

    const title = document.createElement('h2')
    title.style.cssText =
      'font-family:var(--font-display);font-size:18px;letter-spacing:1px;color:var(--color-gold);text-transform:uppercase;margin-bottom:12px;'
    title.textContent = 'GitHub Connection'

    const pat = getPat()
    const statusDot = document.createElement('span')
    statusDot.style.cssText =
      `display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:${pat ? 'var(--color-success)' : 'var(--color-text-muted)'};`

    const statusText = document.createElement('span')
    statusText.style.cssText = 'font-size:13px;color:var(--color-text-muted);'
    statusText.textContent = pat ? 'Connected — PAT stored in browser' : 'Not connected — enter a GitHub PAT with repo scope'

    const statusRow = document.createElement('div')
    statusRow.style.cssText = 'display:flex;align-items:center;margin-bottom:14px;'
    statusRow.appendChild(statusDot)
    statusRow.appendChild(statusText)

    const formRow = document.createElement('div')
    formRow.style.cssText = 'display:flex;gap:8px;align-items:center;'

    const input = document.createElement('input')
    input.type = 'password'
    input.className = 'input'
    input.placeholder = 'ghp_xxxxxxxxxxxxxxxxxxxx'
    input.value = pat
    input.autocomplete = 'off'
    input.style.cssText =
      'flex:1;background:var(--color-navy-dark);border:1px solid var(--color-gold-dark);border-radius:4px;padding:10px 12px;color:var(--color-text-light);font-size:13px;outline:none;'
    input.addEventListener('focus', () => { input.style.borderColor = 'var(--color-gold-bright)' })
    input.addEventListener('blur',  () => { input.style.borderColor = 'var(--color-gold-dark)' })

    const saveBtn = document.createElement('button')
    saveBtn.className = 'btn btn-primary'
    saveBtn.textContent = 'Save'
    saveBtn.style.cssText =
      'background:var(--color-gold-bright);color:var(--color-navy-dark);border:none;padding:10px 18px;border-radius:4px;font-weight:700;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;'
    saveBtn.addEventListener('click', () => {
      savePat(input.value.trim())
      rebuild()
    })

    const clearBtn = document.createElement('button')
    clearBtn.className = 'btn btn-danger'
    clearBtn.textContent = 'Clear'
    clearBtn.style.cssText =
      'background:transparent;border:2px solid var(--color-danger);color:#d47070;padding:10px 14px;border-radius:4px;font-weight:700;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;'
    clearBtn.addEventListener('click', () => {
      if (confirm('Remove stored PAT from browser?')) { savePat(''); rebuild() }
    })

    formRow.appendChild(input)
    formRow.appendChild(saveBtn)
    if (pat) formRow.appendChild(clearBtn)

    const note = document.createElement('p')
    note.style.cssText = 'font-size:11px;color:var(--color-text-muted);margin-top:8px;'
    note.textContent = 'PAT is stored only in your browser localStorage. It is never committed or sent anywhere except the GitHub API.'

    el.appendChild(title)
    el.appendChild(statusRow)
    el.appendChild(formRow)
    el.appendChild(note)
  }

  rebuild()
}
