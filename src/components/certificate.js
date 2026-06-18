import html2canvas from 'html2canvas'

/**
 * Renders a championship certificate to canvas and triggers PNG download.
 */
export async function renderCertificate(data) {
  const champion = data.champion
  const team = data.teams[champion]
  if (!team || !champion) return

  const el = buildCertificateDOM(team, data.meta)
  document.body.appendChild(el)

  try {
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#f5f1e8' })
    const link = document.createElement('a')
    link.download = `sepoy-cup-2026-champion-${champion}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    el.remove()
  }
}

function buildCertificateDOM(team, meta) {
  const wrap = document.createElement('div')
  wrap.style.cssText = `
    position:absolute; left:-9999px;
    width:800px; height:566px;
    background:#f5f1e8;
    padding:36px 48px;
    font-family:'Inter', sans-serif;
    text-align:center;
    color:#1a2e5a;
    box-sizing:border-box;
  `

  // Outer double border via box-shadow
  wrap.style.boxShadow = `inset 0 0 0 4px #d4a574, inset 0 0 0 8px #f5f1e8, inset 0 0 0 10px #c9a340`

  wrap.innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;">
      <div style="font-family:'Bebas Neue','Anton',sans-serif;font-size:42px;letter-spacing:4px;color:#1a2e5a;text-transform:uppercase;line-height:1;">
        Sepoy Cup ${meta?.year ?? 2026}
      </div>
      <div style="font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#c9a340;">
        Certificate of Championship
      </div>
      <div style="font-size:32px;margin:4px 0;">🌿</div>
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4a4a6a;margin-top:4px;">
        This Certifies That
      </div>
      <div style="font-family:'Bebas Neue','Anton',sans-serif;font-size:52px;letter-spacing:2px;color:#1a2e5a;line-height:1;">
        ${team.flag} ${team.name}
      </div>
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#4a4a6a;">
        Has Been Crowned
      </div>
      <div style="font-family:'Bebas Neue','Anton',sans-serif;font-size:28px;letter-spacing:3px;color:#1a2e5a;text-transform:uppercase;">
        Sepoy Cup ${meta?.year ?? 2026} Champion
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:6px;color:#c9a340;font-size:11px;letter-spacing:2px;">
        <span>🌿</span>
        <span>EDITION I · ${meta?.game ?? 'FC24'} · ${meta?.year ?? 2026}</span>
        <span>🌿</span>
      </div>
      <div style="margin-top:8px;">
        <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#1a2e5a;border:3px solid #d4a574;box-shadow:inset 0 0 0 5px #1a2e5a,inset 0 0 0 7px #c9a340;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:22px;">🏆</span>
        </div>
      </div>
    </div>
  `

  return wrap
}
