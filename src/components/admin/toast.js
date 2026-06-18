let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
  return container
}

/**
 * Display a transient toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration ms before auto-dismiss
 */
export function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div')
  toast.className = `toast toast--${type}`
  toast.textContent = message
  getContainer().appendChild(toast)
  setTimeout(() => toast.remove(), duration)
}
