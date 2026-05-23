import { useState } from 'react'

interface WaitlistModalProps {
  onClose: () => void
  stageName: string
}

export default function WaitlistModal({ onClose, stageName }: WaitlistModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed')
      }
      setStatus('success')
    } catch (e: any) {
      setErrorMsg(e.message || 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white text-xl"
        >
          ✕
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-white text-xl font-bold mb-2">You're on the list.</h2>
            <p className="text-[#6b7280] text-sm">
              We'll notify you when Pro drops. Go ship something.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-xs font-semibold tracking-widest text-[#7c3aed] uppercase">
                Pro Feature
              </span>
              <h2 className="text-white text-xl font-bold mt-2 mb-1">
                Unlock{' '}
                <span className="text-[#a78bfa]">{stageName}</span>
              </h2>
              <p className="text-[#6b7280] text-sm">
                Shoot Plan, Edit Notes, and Publish Strategy are Pro-only. Join the waitlist — we'll ping you when it opens.
              </p>
            </div>

            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrorMsg('')
                setStatus('idle')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] mb-3 placeholder-[#6b7280]"
            />

            {errorMsg && (
              <p className="text-red-400 text-xs mb-3">{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              {status === 'loading' ? 'Joining...' : 'Join Pro Waitlist →'}
            </button>

            <p className="text-[#6b7280] text-xs text-center mt-3">
              No spam. No credit card. Just a ping.
            </p>
          </>
        )}
      </div>
    </div>
  )
}