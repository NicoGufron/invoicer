"use client"

import { useAuthStore } from "@/app/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Eye, EyeClosed, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePassword() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmCPassword] = useState("");

    const updateUserPassword = useAuthStore((s) => s.updateUserPassword);
    const isUpdatingProfile = useAuthStore((s) => s.isUpdatingProfile);

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            toast.error("Password must be same!")
        }

        const res = await updateUserPassword(password);

        if (res) {
            toast.success("Password changed successfully");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Change Password</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Change Password</DialogTitle>
                <div className="flex flex-col gap-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput onBlur={(e) => setPassword(e.currentTarget.value)} type={showPassword ? "text" : "password"}></InputGroupInput>
                                <InputGroupAddon align={"inline-end"}>
                                    <InputGroupButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff></EyeOff> : <Eye></Eye>}</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel>Confirm Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput onBlur={(e) => setConfirmCPassword(e.currentTarget.value)} type={showPassword ? "text" : "password"}></InputGroupInput>
                                <InputGroupAddon align={"inline-end"}>
                                    <InputGroupButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff></EyeOff> : <Eye></Eye>}</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                    <Item variant={"outline"}>
                        <ItemMedia><Info size="16"></Info></ItemMedia>
                        <ItemContent>
                            <ItemTitle>Password tip</ItemTitle>
                            <ItemDescription>Passwords should include:
                            </ItemDescription>
                        </ItemContent>
                    </Item>
                    <Button onClick={handleChangePassword} className="bg-green-500 hover:bg-green-600">Save Changes</Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}