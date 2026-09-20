import "next-auth";
import type { Perfil } from "../app/generated/prisma/client";

declare module "next-auth" {
  interface User {
		id: string;
		perfil: string;
	}

  interface Session {
		user: {
			id: string;
			perfil: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    perfil: Perfil;
  }
}