'use client'

import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import {
    createContext,
    ReactNode,
    useContext,
    useState
} from 'react'

export interface DialogOptions {
    title: string
    message: string

    confirmText?: string
    cancelText?: string

    onConfirm?: () => void | Promise<void>
}

interface DialogContextData {
    abrirDialog: (options: DialogOptions) => void
    fecharDialog: () => void
}

const DialogContext = createContext<DialogContextData | undefined>(undefined)

export function DialogProvider({
    children
}: {
    children: ReactNode
}) {
    const [dialog, setDialog] = useState<DialogOptions | null>(null)
    const abrirDialog = (options: DialogOptions) => {
        setDialog(options)
    }
    const fecharDialog = () => {
        setDialog(null)
    }
    return (
        <DialogContext.Provider
            value={{
                abrirDialog,
                fecharDialog
            }}
        >
            {children}

            <ConfirmDialog
                dialog={dialog}
                onClose={fecharDialog}
            />
        </DialogContext.Provider>
    )
}

export function useDialog() {
    const context = useContext(DialogContext)
    if (!context) {
        throw new Error(
            'useDialog deve ser utilizado dentro de um DialogProvider'
        )
    }
    return context
}