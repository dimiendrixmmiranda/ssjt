"use client";

import { signOut } from "next-auth/react";
import Template from "./menu/Template";

export default function Page() {
    async function handleSair() {
        await signOut({
            redirectTo: "/",
        })
    }

    return (
        <Template>
            <button
                onClick={handleSair}
                className="cursor-pointer font-oswald"
            >
                Sair
            </button>
        </Template>
    )
}