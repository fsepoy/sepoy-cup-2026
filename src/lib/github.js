const OWNER = 'fsepoy'
const DATA_REPO = 'sepoy-cup-data'
const DATA_PATH = '2026/fc24/data.json'
const API_BASE  = 'https://api.github.com'

/**
 * Get the current SHA and content of the data file.
 * Returns { ok, sha, content, error }.
 * PAT is passed in — never stored in this module.
 */
export async function getFileMeta(pat) {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${OWNER}/${DATA_REPO}/contents/${DATA_PATH}`,
      { headers: authHeaders(pat) }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status} — check PAT scope`)
    const json = await res.json()
    const raw = atob(json.content.replace(/\s/g, ''))
    const bytes = Uint8Array.from(raw, c => c.charCodeAt(0))
    const content = JSON.parse(new TextDecoder().decode(bytes))
    return { ok: true, sha: json.sha, content }
  } catch (err) {
    return { ok: false, sha: null, content: null, error: err.message }
  }
}

/**
 * Commit updated tournament data back to the data repo.
 * Returns { ok, error }.
 */
export async function writeData(pat, newData, sha) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))))
    const body = JSON.stringify({
      message: `chore: update tournament data ${new Date().toISOString()}`,
      content: encoded,
      sha,
    })
    const res = await fetch(
      `${API_BASE}/repos/${OWNER}/${DATA_REPO}/contents/${DATA_PATH}`,
      { method: 'PUT', headers: authHeaders(pat), body }
    )
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.message ?? `HTTP ${res.status}`)
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

function authHeaders(pat) {
  return {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}
