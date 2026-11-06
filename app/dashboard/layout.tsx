import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

async function VerificarAutenticacao({
    children,
}: {
    children: React.ReactNode
}) {
    await connection()
    const sessao = await auth()
    if (!sessao?.user) {
        redirect("/")
    }
    return <>{children}</>
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Suspense fallback={<div className="flex justify-center items-center w-full min-h-screen text-3xl font-bold text-verde">Carregando...</div>}>
            <VerificarAutenticacao>
                {children}
            </VerificarAutenticacao>
        </Suspense>
    )
}