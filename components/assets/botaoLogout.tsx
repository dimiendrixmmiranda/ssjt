"use client";

import { signOut } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";

export default function BotaoLogout() {
	return (
		<button
			type="button"
			onClick={() => signOut({ callbackUrl: "/" })}
			className="w-[40px] h-[40px] bg-red-500 font-bold text-xl py-1 rounded-lg flex items-center justify-center gap-1 border border-red-500 transition-all duration-300 cursor-pointer hover:bg-white hover:text-red-500"
		>
			<HiOutlineLogout />
		</button>
	);
}