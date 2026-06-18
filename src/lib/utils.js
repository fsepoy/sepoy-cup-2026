export function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Maps team IDs from data.json to flag-icons ISO codes
const FLAG_CODES = {
  croatia:   'hr',
  belgium:   'be',
  germany:   'de',
  england:   'gb-eng',
  france:    'fr',
  argentina: 'ar',
}

/**
 * Returns an <span> with the correct flag-icons class for a given teamId.
 * Falls back to the team's emoji flag if no code is mapped.
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
export function flagIcon(teamId, fallbackEmoji = '', size = 'md') {
  const code = FLAG_CODES[teamId]
  if (!code) return `<span style="font-size:${size === 'lg' ? '32px' : size === 'xl' ? '56px' : '18px'};">${escapeHtml(fallbackEmoji)}</span>`
  const title = escapeHtml(teamId)
  return `<span class="fi fi-${code} fi--${size}" title="${title}"></span>`
}
