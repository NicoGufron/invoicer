"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const { isLoading, login } = useAuthStore();

    const handleLogin = async () => {
        if (email && password) {
            const res = await login(email, password);
            if (res) router.push("/dashboard/home");

        } else {
            toast.error("Please input credentials to continue")
        }
    }

    return (
        <div className="h-screen p-2">
            <div className="grid grid-cols-2 h-full">
                <div className="p-10 flex flex-col items-center justify-center">
                    <div className="p-5 flex flex-col w-1/2 justify-center gap-5 rounded-xl">
                        <p className="text-3xl font-bold pb-5 text-center text-[var(--primary)]">Login</p>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input placeholder="Your email" onBlur={(e) => setEmail(e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput type={showPassword ? "text" : "password"} placeholder="Your password" onBlur={(e) => setPassword(e.currentTarget.value)}></InputGroupInput>
                                <InputGroupAddon align={"inline-end"}>
                                    <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                                        {
                                            showPassword ? <EyeOffIcon></EyeOffIcon> :
                                                <Eye></Eye>

                                        }
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Button onClick={handleLogin} className="bg-[#25343F] w-full cursor-pointer">{isLoading ? <Spinner></Spinner> : "Login"}</Button>
                        <p className="text-sm text-center">Don't have any account? <Link href="/register" className="border-b-1 border-[#101010] hover:text-[var(--primary)] font-bold transition">Click here</Link></p>
                    </div>
                </div>
                <div className="bg-[var(--primary)] h-full rounded-xl py-10 px-15 flex flex-col">
                    <p className="text-2xl uppercase font-bold text-white tracking-widest">Invoicer</p>
                    <p className="text-white">Design. Build. Repeat.</p>
                </div>
            </div>
        </div>

    );
}