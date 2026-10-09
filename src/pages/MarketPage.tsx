import { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/store/AppContext'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { DemoBadge } from '@/components/ui/DemoBadge'
import type { Reward } from '@/types'

interface ShopMeta {
  icon: string
  label: string
  color: string
}

const REWARD_META: Record<string, ShopMeta> = {
  r1: { icon: '☕', label: 'Food', color: '#ffb800' },
  r2: { icon: '🍶', label: 'Sustainability', color: '#00c2c8' },
  r3: { icon: '👕', label: 'Merch', color: '#ff00ff' },
  r4: { icon: '🌱', label: 'Sustainability', color: '#00c853' },
}

const CATEGORY_META: Record<Reward['category'], ShopMeta> = {
  food: { icon: '🍴', label: 'Food', color: '#ffb800' },
  sustainability: { icon: '♻️', label: 'Sustainability', color: '#00c853' },
  merch: { icon: '🎁', label: 'Merch', color: '#ff00ff' },
}

const RARITY: Record<
  string,
  { label: string; className: string }
> = {
  common: { label: 'Common', className: 'bg-surface text-ink-900 border-ink-900' },
  rare: { label: 'Rare', className: 'bg-tone-teal text-[#00736b] border-ink-900' },
  epic: { label: 'Epic', className: 'bg-tone-magenta text-[#b800b8] border-ink-900' },
  mythic: { label: 'Mythic', className: 'bg-tone-yellow text-[#8a5200] border-ink-900' },
}

function rarityFor(cost: number): keyof typeof RARITY {
  if (cost >= 1200) return 'mythic'
  if (cost >= 800) return 'epic'
  if (cost >= 450) return 'rare'
  return 'common'
}

function useTimeToMidnight() {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const next = new Date(now)
      next.setHours(24, 0, 0, 0)
      const diff = Math.max(0, next.getTime() - now.getTime())
      const h = Math.floor(diff / 3.6e6)
      const m = Math.floor((diff % 3.6e6) / 6e4)
      const s = Math.floor((diff % 6e4) / 1000)
      const pad = (n: number) => String(n).padStart(2, '0')
      setLabel(`${pad(h)}:${pad(m)}:${pad(s)}`)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return label
}

function metaFor(r: Reward): ShopMeta {
  return REWARD_META[r.id] ?? CATEGORY_META[r.category]
}

export function MarketPage() {
  const { state, redeemReward, pushToast } = useApp()
  const student = state.students.find((s) => s.id === state.currentStudentId)
  const points = student?.points ?? 0
  const countdown = useTimeToMidnight()

  const [selected, setSelected] = useState<Reward | null>(null)
  const [flashId, setFlashId] = useState<string | null>(null)

  const rewards = state.rewards
  const dailyDrops = useMemo(() => rewards.filter((r) => r.category !== 'merch'), [rewards])

  const affordable = (r: Reward) => points >= r.cost && r.stock > 0
  const alreadyRedeemed = (r: Reward) => state.redeemedRewardIds.includes(r.id)

  const redeem = (r: Reward) => {
    const result = redeemReward(r.id)
    pushToast({
      variant: result.ok ? 'success' : 'error',
      title: result.ok ? 'Reward redeemed' : 'Redemption failed',
      description: result.message,
    })
    if (result.ok) {
      setFlashId(r.id)
      window.setTimeout(() => setFlashId((cur) => (cur === r.id ? null : cur)), 3000)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-display uppercase tracking-wide text-ink-900">Black Market</h1>
          <DemoBadge label="Demo rewards" />
        </div>
        <p className="mt-1 text-sm font-medium text-ink-600">Trade GreenPoints for real-world campus loot</p>
      </div>

      <section aria-label="Your wallet" className="rounded-xl border-2 border-ink-950 bg-ink-900 p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-white/25 bg-white/10 text-xl" aria-hidden>
              💰
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">Your Wallet</p>
              <p className="mt-0.5 text-sm font-medium text-white/85">Live GreenPoints balance</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display text-neon-teal tabular-nums">{formatNumber(points)}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">GP</span>
          </div>
        </div>
        <p className="mt-3 border-t-2 border-white/10 pt-3 text-[11px] font-medium text-white/55">
          Earn GP by scanning bins. Rewards are demo items — no real fulfilment occurs.
        </p>
      </section>

      <section aria-label="Daily drops">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-ink-900 bg-status-critical" aria-hidden />
            <h2 className="text-base font-display uppercase tracking-wide text-ink-900">Daily Drops</h2>
          </div>
          <span className="rounded-lg border-2 border-ink-900 bg-surface px-2.5 py-1 text-[11px] font-bold tabular-nums text-ink-700 shadow-brutal-sm">
            ⏰ Resets in {countdown}
          </span>
        </div>

        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
          {dailyDrops.map((r) => {
            const meta = metaFor(r)
            const canAfford = affordable(r)
            const redeemed = flashId === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className={cn(
                  'relative min-w-[230px] flex-1 snap-start rounded-xl border-2 border-ink-900 bg-surface p-4 text-left shadow-brutal-sm transition-transform hover:-translate-y-0.5',
                  redeemed && 'bg-tone-teal',
                )}
              >
                {r.stock <= 5 && (
                  <span
                    className="absolute top-0 right-0 rounded-bl-lg border-b-2 border-l-2 border-ink-900 bg-status-critical px-2 py-0.5 text-[10px] font-display uppercase text-white"
                    style={{ borderRadius: '0 8px 0 6px' }}
                  >
                    HOT
                  </span>
                )}
                <span
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl"
                  style={{ borderColor: meta.color, background: `${meta.color}20`, borderRadius: 6 }}
                  aria-hidden
                >
                  {meta.icon}
                </span>
                <h3 className="text-sm font-bold text-ink-900">{r.title}</h3>
                <p className="mt-0.5 mb-3 line-clamp-2 text-xs font-medium text-ink-600">{r.description}</p>
                <div className="flex items-end justify-between gap-2">
                  <span className={cn('font-display text-base tabular-nums', canAfford ? 'text-ink-900' : 'text-ink-500')}>
                    {formatNumber(r.cost)} <span className="text-[11px] font-bold uppercase text-ink-500">GP</span>
                  </span>
                  <span className="text-[11px] font-bold text-ink-500">{r.stock} left</span>
                </div>
                {redeemed && (
                  <span className="mt-3 block rounded-lg border-2 border-ink-900 bg-surface px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#00736b]">
                    ✓ Redeemed — Check Inbox
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-label="Full catalogue">
        <h2 className="mb-3 text-base font-display uppercase tracking-wide text-ink-900">Full Catalogue</h2>
        <div className="space-y-3">
          {rewards.map((r) => {
            const meta = metaFor(r)
            const rarity = RARITY[rarityFor(r.cost)]
            const canAfford = affordable(r)
            const redeemedEver = alreadyRedeemed(r)
            const redeemed = flashId === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-xl border-2 border-ink-900 bg-surface p-4 text-left shadow-brutal-sm transition-transform hover:-translate-y-0.5',
                  redeemed && 'bg-tone-teal',
                  redeemedEver && !flashId && 'bg-surface-muted',
                )}
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 text-2xl"
                  style={{ borderColor: meta.color, background: `${meta.color}20`, borderRadius: 6 }}
                  aria-hidden
                >
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-ink-900">{r.title}</h3>
                    <span className={cn('rounded-md border-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', rarity.className)}>
                      {rarity.label}
                    </span>
                    {redeemedEver && !flashId && (
                      <span className="rounded-md border-2 border-ink-900 bg-tone-teal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00736b]">
                        Redeemed
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs font-medium text-ink-600">{r.description}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className={cn('font-display text-sm tabular-nums', canAfford ? 'text-ink-900' : 'text-ink-500')}>
                      {formatNumber(r.cost)} <span className="text-[10px] font-bold uppercase text-ink-500">GP</span>
                    </span>
                    <span className="text-[11px] font-bold text-ink-500">{r.stock} left</span>
                    <span className="hidden text-[10px] font-bold uppercase tracking-wider text-ink-500 sm:inline">{meta.label}</span>
                  </div>
                </div>
                <span className="shrink-0 font-display text-xl text-ink-900" aria-hidden>
                  {canAfford && !redeemedEver ? '→' : '🔒'}
                </span>
                {redeemed && (
                  <span className="shrink-0 rounded-lg border-2 border-ink-900 bg-surface px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00736b]">
                    ✓ Redeemed
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-xs font-medium text-ink-600">
          Not enough GP? Head over to the scan page and start earning — every bin counts.
        </p>
      </section>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={`Redeem ${selected?.title ?? ''}?`}
        description="Demo rewards are not real and no fulfilment occurs."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selected || !affordable(selected)}
              onClick={() => {
                if (selected) redeem(selected)
                setSelected(null)
              }}
            >
              Redeem for {formatNumber(selected?.cost ?? 0)} GP
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 rounded-lg border-2 border-ink-900 bg-surface p-3 shadow-brutal-sm">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl"
                style={{ borderColor: metaFor(selected).color, background: `${metaFor(selected).color}20` }}
                aria-hidden
              >
                {metaFor(selected).icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink-900">{selected.title}</p>
                <p className="truncate text-xs text-ink-500">{selected.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-600">Cost</span>
              <span className="font-bold text-ink-900 tabular-nums">{formatNumber(selected.cost)} GP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-600">Your balance</span>
              <span className="font-bold text-ink-900 tabular-nums">{formatNumber(points)} GP</span>
            </div>
            <div className="flex items-center justify-between border-t-2 border-ink-900 pt-2">
              <span className="text-ink-600">After redemption</span>
              <span className={cn('font-bold tabular-nums', points >= selected.cost ? 'text-ink-900' : 'text-status-critical')}>
                {formatNumber(Math.max(0, points - selected.cost))} GP
              </span>
            </div>
            {!affordable(selected) && (
              <p className="rounded-lg bg-tone-danger p-2 text-center text-xs font-bold uppercase tracking-wide text-[#d90429]">
                Not enough GreenPoints
              </p>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}