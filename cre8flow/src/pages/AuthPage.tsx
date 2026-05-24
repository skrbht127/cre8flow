import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const { signIn } = useAuth()

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-white text-3xl font-bold">Cre8Flow</h1>
      <p className="text-[#6b7280] text-sm mt-2">Your AI content pipeline.</p>
      <div className="mt-12">
        <button
          onClick={signIn}
          className="bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-3"
        >
          {/* Simple Google icon placeholder */}
          <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full">G</span>
          Continue with Google
        </button>
      </div>
      <p className="text-[#6b7280] text-xs mt-4">Free to start. No credit card.</p>
    </div>
  )
}
