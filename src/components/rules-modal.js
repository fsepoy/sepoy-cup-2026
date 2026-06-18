export function mountRulesModal() {
  // ── Button in the top-actions bar ──────────────────────────────────────
  const btn = document.createElement('button')
  btn.className = 'rules-btn'
  btn.setAttribute('aria-label', 'View tournament rules')
  btn.setAttribute('title', 'Tournament Rules')
  btn.innerHTML = '📋 <span class="rules-btn__label">Rules</span>'

  // Prepend so it sits to the left of the theme toggle
  let bar = document.getElementById('top-actions')
  if (!bar) {
    bar = document.createElement('div')
    bar.id = 'top-actions'
    bar.className = 'top-actions'
    document.body.appendChild(bar)
  }
  bar.prepend(btn)

  // ── Modal ───────────────────────────────────────────────────────────────
  const overlay = document.createElement('div')
  overlay.className = 'rules-overlay'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'Tournament Rules')
  overlay.hidden = true
  overlay.innerHTML = buildModalHTML()
  document.body.appendChild(overlay)

  // Open / close
  function open() {
    overlay.hidden = false
    document.body.style.overflow = 'hidden'
    overlay.querySelector('.rules-modal__close').focus()
  }
  function close() {
    overlay.hidden = true
    document.body.style.overflow = ''
  }

  btn.addEventListener('click', open)
  document.addEventListener('open-rules-modal', open)

  overlay.querySelector('.rules-modal__close').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close() })
}

function buildModalHTML() {
  return `
  <div class="rules-modal">
    <button class="rules-modal__close" aria-label="Close rules">&times;</button>

    <div class="rules-modal__header">
      <div class="rules-modal__title">Tournament Rules</div>
      <div class="rules-modal__subtitle">A quick guide to how the Sepoy Cup works</div>
    </div>

    <div class="rules-modal__body">

      <!-- Tournament Format -->
      <section class="rules-section">
        <h3 class="rules-section__heading">🏟️ Tournament Format</h3>
        <div class="rules-flow">
          <div class="rules-flow__step">
            <div class="rules-flow__icon">6</div>
            <div class="rules-flow__label">Nations<br><span>2 groups of 3</span></div>
          </div>
          <div class="rules-flow__arrow">→</div>
          <div class="rules-flow__step">
            <div class="rules-flow__icon">⚽</div>
            <div class="rules-flow__label">Group Stage<br><span>Round robin</span></div>
          </div>
          <div class="rules-flow__arrow">→</div>
          <div class="rules-flow__step">
            <div class="rules-flow__icon">🗂️</div>
            <div class="rules-flow__label">Knockout Stage<br><span>Top 2 advance</span></div>
          </div>
          <div class="rules-flow__arrow">→</div>
          <div class="rules-flow__step">
            <div class="rules-flow__icon">🏆</div>
            <div class="rules-flow__label">Champion<br><span>Winner of Final</span></div>
          </div>
        </div>
      </section>

      <div class="rules-cols">

        <!-- Points System -->
        <section class="rules-section">
          <h3 class="rules-section__heading">📊 Points System</h3>
          <table class="rules-table">
            <tr><td>Win</td><td class="rules-table__val">3 pts</td></tr>
            <tr><td>Draw</td><td class="rules-table__val">1 pt</td></tr>
            <tr><td>Loss</td><td class="rules-table__val">0 pts</td></tr>
          </table>
          <p class="rules-note">Points are only awarded in the Group Stage. Knockout matches use extra time &amp; penalties if needed.</p>
        </section>

        <!-- Group Ranking Order -->
        <section class="rules-section">
          <h3 class="rules-section__heading">📋 Group Ranking Order</h3>
          <ol class="rules-list">
            <li>Points</li>
            <li>Goal Difference (GD = GF − GA)</li>
            <li>Tie-Break Match <em>(if two teams remain level)</em></li>
          </ol>
        </section>

      </div>

      <div class="rules-cols">

        <!-- Two-Team Tie -->
        <section class="rules-section">
          <h3 class="rules-section__heading">⚖️ Two-Team Tie</h3>
          <p class="rules-note" style="margin-bottom:10px;">If two teams are level on Points <em>and</em> Goal Difference:</p>
          <ol class="rules-list">
            <li>Full Match</li>
            <li>Extra Time <em>(if still tied)</em></li>
            <li>Penalty Shootout <em>(if still tied)</em></li>
          </ol>
          <p class="rules-note" style="margin-top:8px;">Winner finishes above the other team in the group.</p>
        </section>

        <!-- Three-Team Tie -->
        <section class="rules-section">
          <h3 class="rules-section__heading">⚖️⚖️ Three-Team Tie</h3>
          <p class="rules-note" style="margin-bottom:10px;">If all three teams are level on Points <em>and</em> Goal Difference:</p>
          <div class="rules-badge">Tie-Break Mini Tournament</div>
          <p class="rules-note" style="margin:8px 0;">Each team plays each other once (3 matches):</p>
          <table class="rules-table rules-table--compact">
            <tr><th>Match</th><th>Teams</th></tr>
            <tr><td>TM1</td><td>B vs C</td></tr>
            <tr><td>TM2</td><td>A vs B</td></tr>
            <tr><td>TM3</td><td>A vs C</td></tr>
          </table>
          <p class="rules-note" style="margin-top:8px;">Draw = 1 point. Still level after mini-tournament → <strong>Sudden-Death Penalty Shootout</strong>.</p>
        </section>

      </div>

      <!-- Knockout Rules -->
      <section class="rules-section">
        <h3 class="rules-section__heading">🗂️ Knockout Match Rules</h3>
        <p class="rules-note" style="margin-bottom:10px;">If a knockout match is tied after normal time:</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <div class="rules-step-pill">Full Match</div>
          <span style="color:var(--color-gold);">→</span>
          <div class="rules-step-pill">Extra Time</div>
          <span style="color:var(--color-gold);">→</span>
          <div class="rules-step-pill">Penalty Shootout<br><small>5 kicks per team</small></div>
        </div>
      </section>

      <!-- Spirit -->
      <section class="rules-section rules-section--spirit">
        <div class="rules-spirit">
          <span style="font-size:20px;">⚽</span>
          <div>
            <p><em>"Play with passion, Compete with respect, Enjoy the beautiful game."</em></p>
            <p style="margin-top:4px;opacity:0.7;font-size:12px;">This is legacy in the making. — Sepoy Cup 2026</p>
          </div>
        </div>
      </section>

    </div>
  </div>
  `
}
