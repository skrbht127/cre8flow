import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-[#7c3aed] rounded text-sm mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
