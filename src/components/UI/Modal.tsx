import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      dialog.showModal()
    } else {
      dialog.close()
      previousFocusRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) onClose() }}
      className="backdrop:bg-black/50 bg-transparent p-0 m-0 max-w-lg w-full fixed inset-0 flex items-center justify-center"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer la modal"
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </dialog>
  )
}
