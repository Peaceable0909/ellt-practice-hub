import { useState } from 'react'

// Which test a skill hub currently has open.
//
//  - In Practice the URL decides: Practice passes selectedId (from /practice/:skill/:testId)
//    and onSelect(id | null), so a test has its own link and the browser Back button
//    returns to the list.
//  - Inside a plan session there is no URL for it: the hub keeps its own state and starts
//    on preselectedId, the exact test the plan assigned for that task.
//
// Returns [selectedTest | null, open(test), close()].
export default function useTestSelection(pool, { selectedId, onSelect, preselectedId } = {}) {
  const controlled = typeof onSelect === 'function'
  const [local, setLocal] = useState(() => pool.find(t => t.id === preselectedId) || null)
  const selected = controlled ? (pool.find(t => t.id === selectedId) || null) : local
  const open = test => (controlled ? onSelect(test.id) : setLocal(test))
  const close = () => (controlled ? onSelect(null) : setLocal(null))
  return [selected, open, close]
}
