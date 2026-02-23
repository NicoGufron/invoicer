import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
    isLoading: boolean,
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            isLoading: false,
            login: async (email, password) => {
                try {
                    // const res = await fetch("https://google.com");
                    if (email && password) {
                        toast.success("success login")
                    } else {
                        toast.error("missing credentials")
                    }

                } catch (err: any) {

                }
            },
            logout: async () => {
                try {

                } catch (err: any){
                    
                }
            }
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({

            })
        }
    )
)