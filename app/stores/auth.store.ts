import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";

type UserMetadata = {
    fullName: string,
    phoneNumber: string,
}

type AuthStore = {
    user: any,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
    initialize: () => void;
    createUser: (email: string, password: string, metadata: UserMetadata) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
    (set, get) => ({
        user: null,
        isLoading: false,

        login: async (email, password) => {
            const supabase = createClient();
            set({ isLoading: true });
            try {

                const { error, data: { user } } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    throw new Error(error.message);
                }

                set({ user: user })

                return true;

            } catch (err: any) {
                toast.error(err.message);
                return false;
            } finally {
                set({ isLoading: false })
            }
        },
        logout: async () => {
            const supabase = createClient();
            set({ isLoading: true });
            try {
                await supabase.auth.signOut();

                return true;

            } catch (err: any) {
                toast.error(err.message);
                return false;
            } finally {
                set({ isLoading: false });
            }
        },

        createUser: async (email, password, metadata) => {
            const supabase = createClient();
            set({ isLoading: true });
            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            fullName: metadata.fullName,
                            phoneNumber: metadata.phoneNumber,
                            profileSetup: false,
                        }
                    }
                })

                if (error) {
                    toast.error(error.message);
                    return false;
                }

                return true
            } catch (err:any) {
                return false;
            } finally {
                set({ isLoading: false});
            }
        },

        initialize: async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            set({ user })
        }
    }),
)