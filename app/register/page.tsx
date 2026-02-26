"use client"

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { EyeOffIcon, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../stores/auth.store";
import Link from "next/link";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";

export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const {isLoading, createUser} = useAuthStore();

    const handleRegister = async () => {
        if (email && password && phoneNumber && fullName) {
            const res = await createUser(email, password, {
                fullName,
                phoneNumber
            })

            if (res) {
                toast.success("Account created successfully, please check your email");
                setEmail("");
                setPassword("");
                setPhoneNumber("");
                setFullName("");
            }
        } else {
            toast.error("Please fill out necessary information");
        }
    }

    return (
        <div className="h-screen p-2">
            <div className="grid grid-cols-2 h-full">
                <div className="p-10 flex items-center justify-center">
                    <div className="p-5 flex flex-col w-1/2 justify-center gap-5">
                        <p className="text-3xl font-bold pb-5 text-center">Register Account</p>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input placeholder="Your email" defaultValue={email} onBlur={(e) => setEmail(e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput type={showPassword ? "text" : "password"} placeholder="Your password" defaultValue={password} onBlur={(e) => setPassword(e.currentTarget.value)}></InputGroupInput>
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
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input defaultValue={fullName} placeholder="Your Full Name" onBlur={(e) => setFullName(e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <ButtonGroup>
                                <Button variant={"outline"}>+62</Button>
                                <Input type="text" defaultValue={phoneNumber} maxLength={12} onChange={(e) => {
                                    const num = e.currentTarget.value.replace(/\D/g, "");
                                    setPhoneNumber(num);
                                }}></Input>
                            </ButtonGroup>
                        </Field>
                        <Button onClick={handleRegister} className="bg-[#25343F] w-full cursor-pointer">{isLoading ? <Spinner></Spinner> : "Create Account"}</Button>
                        <p>Already have an account? <Link href="/login" className="border-b-1 border-[#101010]">Click here</Link></p>
                    </div>
                </div>
                <div className="bg-[#FF9B51] rounded-xl py-20 px-25 flex flex-col">
                    <p className="text-2xl uppercase font-bold text-white tracking-widest">Invoicer</p>
                    <p>Design. Build. Repeat.</p>
                </div>
            </div>
        </div>
    );
}