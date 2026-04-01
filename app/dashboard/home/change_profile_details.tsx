"use client";

import { useAuthStore } from "@/app/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

interface Props {
    user: any
}

export default function ChangeProfileDetails({user} : Props) {

    const isUpdatingProfile = useAuthStore((s) => s.isUpdatingProfile);

    const updateUserProfile = useAuthStore((s) => s.updateUserProfile);

    const [userData, setUserData] = useState({
        fullName : "",
        email : "",
        phoneNumber: "",
    })

    const handleChange = (key: string, value: any) => {
        setUserData(prev => ({
            ...prev,
            [key] : value
        }))
    }

    const handleSaveProfile = () => {
        updateUserProfile(userData)
    }

    useEffect(() => {
        if (!user) return;

        setUserData({
            fullName: user.user_metadata.fullName,
            email: user.email,
            phoneNumber: user.user_metadata.phoneNumber,    
        });
    }, [user])

    console.log(user);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Change Profile Details</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Change Profile Details</DialogTitle>
                <div className="flex flex-col gap-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Full Name</FieldLabel>
                            <Input value={userData.fullName ?? "-"} name="fullName" placeholder="Full Name" onChange={(e) => handleChange("fullName", e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input value={userData.email ?? "-"} name="email" placeholder="Email" onChange={(e) => handleChange("email", e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <Input value={userData.phoneNumber ?? "-"} name="phoneNumber" placeholder="Phone Number" onChange={(e) => handleChange("phoneNumber", e.currentTarget.value)}></Input>
                        </Field>
                    </FieldGroup>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleSaveProfile}>{isUpdatingProfile ? <Spinner></Spinner> : "Save Changes"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}