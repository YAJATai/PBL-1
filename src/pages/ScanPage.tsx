import {
  Camera,
  CameraOff,
  CheckCircle2,
  MapPin,
  QrCode,
  Recycle,
  RefreshCw,
  ScanLine,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { CATEGORY_LABELS } from '@/lib/category'
import { POINTS_PER_CATEGORY, type WasteCategory } from '@/types'
import { uid } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
import { cn } from '@/lib/cn'

type Step = 'idle' | 'identified' | 'done'

const CATEGORY_ICON: Record<WasteCategory, typeof Recycle> = {
  recyclable: Recycle,
  organic: Sparkles,
  general: QrCode,
}

export function ScanPage() {
  const { state, submitWaste, pushToast } = useApp()
  const [step, setStep] = useState<Step>('idle')
  const [binId, setBinId] = useState<string | null>(null)
  const [scanId, setScanId] = useState<string | null>(null)
  const [category, setCategory] = useState<WasteCategory>('recyclable')
  const [cameraState, setCameraState] = useState<'off' | 'on' | 'denied' | 'unsupported'>('off')
  const [earned, setEarned] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const activeBins = useMemo(
    () => state.bins.filter((b) => b.status !== 'collected'),
    [state.bins],
  )
  const bin = state.bins.find((b) => b.id === binId) ?? null

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
      setCameraState('on')
    } catch {
      setCameraState('denied')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraState('off')
  }

  const identify = (id: string) => {
    setBinId(id)
    setScanId(uid('scan'))
    setStep('identified')
  }

  const simulateScan = () => {
    const target = activeBins[Math.floor(Math.random() * activeBins.length)] ?? state.bins[0]
    if (target) identify(target.id)
  }

  const reset = () => {
    setStep('idle')
    setBinId(null)
    setScanId(null)
    setEarned(0)
  }

  const confirm = () => {
    if (!binId || !scanId) return
    const result = submitWaste(binId, category, scanId)
    if (!result.ok) {
      pushToast({ variant: 'error', title: 'Submission not recorded', description: result.message })
      return
    }
    setEarned(result.points)
    setStep('done')
    pushToast({ variant: 'success', title: 'Points awarded', description: result.message })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display uppercase tracking-tight text-ink-900">Scan &amp; Earn</h2>
          <p className="text-sm text-ink-600">
            Identify a campus bin, choose a waste category, and log a responsible disposal.
          </p>
        </div>
        <Badge tone="brand" dot>
          Simulation Mode
        </Badge>
      </div>

      {step === 'done' ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink-900 bg-tone-success text-[#007a3d] shadow-card animate-scale-in">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h3 className="mt-4 text-xl font-semibold text-ink-900">Submission verified</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-600">
            Your {CATEGORY_LABELS[category].toLowerCase()} item at {bin?.zone} was recorded. Points are
            awarded once per scan.
          </p>
          <p className="mt-4 text-3xl font-bold tabular-nums text-ink-900">+{earned}</p>
          <p className="text-xs text-ink-500">GreenPoints added to your balance</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="h-4 w-4" /> Scan another
            </Button>
            <Link
              to="/student"
              className="inline-flex h-10 items-center rounded-xl border-2 border-ink-900 bg-ink-900 px-5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
            >
              Back to dashboard
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-xl border-2 border-ink-900 bg-ink-950">
              <div className="relative aspect-[4/3] w-full">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  className={cn(
                    'h-full w-full object-cover',
                    cameraState === 'on' ? 'block' : 'hidden',
                  )}
                />
                {cameraState !== 'on' && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-white/60">
                    {cameraState === 'off' && <Camera className="h-8 w-8" />}
                    {cameraState === 'denied' && <CameraOff className="h-8 w-8" />}
                    <p className="max-w-xs px-6 text-sm">
                      {cameraState === 'denied'
                        ? 'Camera permission denied. Use the simulated scan or manual bin selector below.'
                        : cameraState === 'unsupported'
                          ? 'Camera APIs unavailable in this browser. Use the simulated scan or manual bin selector.'
                          : 'Camera preview is optional. Use the simulated scan for a reliable demo.'}
                    </p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-3/5 w-3/5 max-w-[240px]">
                    <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-lg border-l-[3px] border-t-[3px] border-neon-teal" />
                    <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-lg border-r-[3px] border-t-[3px] border-neon-teal" />
                    <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-lg border-b-[3px] border-l-[3px] border-neon-teal" />
                    <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-lg border-b-[3px] border-r-[3px] border-neon-teal" />
                    <span className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-neon-teal shadow-[0_0_12px_2px_rgba(0,194,200,0.7)] motion-safe:animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {cameraState === 'on' ? (
                <Button variant="outline" onClick={stopCamera}>
                  <CameraOff className="h-4 w-4" /> Stop camera
                </Button>
              ) : (
                <Button variant="outline" onClick={startCamera}>
                  <Camera className="h-4 w-4" /> Enable camera preview
                </Button>
              )}
              <Button onClick={simulateScan}>
                <ScanLine className="h-4 w-4" /> Simulate QR scan
              </Button>
            </div>

            <div className="mt-5 border-t-2 border-ink-900/20 pt-5">
              <label htmlFor="manual-bin" className="text-sm font-medium text-ink-700">
                Manual demo bin selector
              </label>
              <p className="mb-2 mt-0.5 text-xs text-ink-500">
                Fallback for the presentation — pick a bin directly instead of scanning.
              </p>
              <Select
                id="manual-bin"
                value={binId ?? ''}
                onChange={(e) => (e.target.value ? identify(e.target.value) : reset())}
              >
                <option value="">Select a demo bin…</option>
                {activeBins.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} — {b.zone} ({b.category})
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            {step === 'idle' || !bin ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-ink-500">
                  <QrCode className="h-6 w-6" />
                </span>
                <p className="text-sm font-semibold text-ink-700">No bin identified yet</p>
                <p className="max-w-xs text-sm text-ink-600">
                  Scan a QR code or choose a demo bin to begin. Sample identifier:{' '}
                  <code className="rounded bg-surface-sunken px-1.5 py-0.5 text-xs">GP-CAMPUS-001</code>
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-display uppercase tracking-wide text-ink-900">
                    Bin identified
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink-900">{bin.code}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-600">
                    <MapPin className="h-3.5 w-3.5" /> {bin.zone} · fill {Math.round(bin.fill)}%
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-ink-700">Waste category</p>
                  <div className="mt-2 grid gap-2">
                    {(Object.keys(POINTS_PER_CATEGORY) as WasteCategory[]).map((cat) => {
                      const Icon = CATEGORY_ICON[cat]
                      const selected = category === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          aria-pressed={selected}
                          className={cn(
                            'flex items-center justify-between rounded-xl border-2 px-3.5 py-3 text-left transition',
                            selected
                              ? 'border-ink-900 bg-tone-yellow shadow-brutal-sm'
                              : 'border-ink-900 bg-surface hover:bg-paper',
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink-900',
                                selected ? 'bg-ink-900 text-white shadow-brutal-sm shadow-ink-900' : 'bg-paper text-ink-600',
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-ink-800">
                                {CATEGORY_LABELS[cat]}
                              </span>
                              <span className="block text-xs text-ink-500">
                                Est. weight {cat === 'organic' ? '1.1' : cat === 'recyclable' ? '0.7' : '0.4'} kg
                              </span>
                            </span>
                          </span>
                          <span className="text-sm font-bold tabular-nums text-ink-900">
                            +{POINTS_PER_CATEGORY[cat]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={confirm}>
                  Confirm submission
                </Button>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full text-center text-xs font-medium text-ink-500 hover:text-ink-600"
                >
                  Cancel and reset
                </button>
                <p className="text-center text-[11px] text-ink-500">
                  Points are awarded once per scan. Duplicate or cancelled submissions award nothing.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      <Card className="border-dashed bg-surface-muted">
        <p className="text-xs text-ink-600">
          <strong className="font-semibold text-ink-700">Prototype note:</strong> QR decoding and IoT
          fill levels are simulated for this demo. The camera preview uses your browser’s media APIs
          when permitted, but no live bin hardware or scanning service is connected.
        </p>
      </Card>
    </div>
  )
}
