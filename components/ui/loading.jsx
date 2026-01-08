import { Spinner } from "@/components/ui/spinner"

export function LoadingSpinner({ size = "default", className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner size={size} />
    </div>
  )
}

export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

export function LoadingButton({ children, isLoading, ...props }) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          <Spinner size="sm" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export function InlineLoader({ text = "Loading..." }) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
