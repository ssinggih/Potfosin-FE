const R2_BASE = 'pub-3a7d8dbbcc014b04a39701b84884e71c.r2.dev'

export function proxyR2Url(url: string | undefined | null): string {
  if (!url) return ''
  if (!url.includes(R2_BASE)) return url
  const path = url.replace(`https://${R2_BASE}/`, '').replace(`http://${R2_BASE}/`, '')
  return `/images/${path}`
}
