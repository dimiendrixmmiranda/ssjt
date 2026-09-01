'use client'

import { DialogOptions } from '@/context/DialogContext'
import { Dialog } from 'primereact/dialog'

interface Props {
    dialog: DialogOptions | null
    onClose: () => void
}

export default function ConfirmDialog({
    dialog,
    onClose
}: Props) {
    if (!dialog) return null
    const possuiConfirmacao = !!dialog.onConfirm
    return (
        <Dialog
            visible={true}
            onHide={onClose}
            header={
                <h2 className="text-2xl font-bold">
                    {dialog.title}
                </h2>
            }
            className="w-full max-w-md bg-cinza p-4 rounded-xl text-white"
            draggable={false}
            resizable={false}
        >
            <div className="flex flex-col gap-6">
                <p className="text-lg">
                    {dialog.message}
                </p>
                <div className="flex justify-end gap-3">

                    {possuiConfirmacao && (
                        <button
                            className="px-4 py-2 rounded-lg border border-zinc-400"
                            onClick={onClose}
                        >
                            {dialog.cancelText ?? 'Cancelar'}
                        </button>
                    )}

                    {possuiConfirmacao && (
                        <button
                            className="px-4 py-2 rounded-lg bg-red-600 text-white"
                            onClick={async () => {
                                await dialog.onConfirm?.()
                                onClose()
                            }}
                        >
                            {dialog.confirmText ?? 'Confirmar'}
                        </button>
                    )}

                    {!possuiConfirmacao && (
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                            onClick={onClose}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </Dialog>
    )
}