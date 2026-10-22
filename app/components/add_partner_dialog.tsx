"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreatePartnerPayload, usePartnerStore } from "../stores/partner.store";
import { useState } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DialogProps = {
    id: string,
}

export default function AddPartnerDialog({id} : DialogProps) {

    const { isLoadingCreatePartner, createPartner } = usePartnerStore();

    const handleAddPartner = async () => {
        const res = await createPartner(payload)

        if (res) toast.success("Partner successfully added");
    }

    const [payload, setPayload] = useState<CreatePartnerPayload>({
        user_id: 1,
        name: "",
        email: "",
        phone: "",
        address: "",
        type: "Client"
    });

    const handleChange = (key: keyof CreatePartnerPayload, value: any) => {
        setPayload(prev => ({
            ...prev,
            [key]: value
        }))
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Add New Partner</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Add New Partner
                </DialogTitle>
                <DialogDescription>Added partner can be used in invoices</DialogDescription>
                <div className="flex flex-col gap-5">
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input placeholder="Company Name" defaultValue={payload.name} onBlur={(e) => handleChange('name', e.currentTarget.value)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Company Email</FieldLabel>
                        <Input placeholder="Company Email" defaultValue={payload.email} onBlur={(e) => handleChange('email', e.currentTarget.value)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Company Type</FieldLabel>
                        <Select value={payload.type} onValueChange={(value) => handleChange('type', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Client">Client</SelectItem>
                                <SelectItem value="Supplier">Supplier</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>Company Phone Number</FieldLabel>
                        <ButtonGroup>
                            <Button variant={"outline"}>+62</Button>
                            <Input type="text" placeholder="Company Number" defaultValue={payload.phone} maxLength={12} onChange={(e) => {
                                const num = e.currentTarget.value.replace(/\D/g, "");
                                handleChange('phone', num);
                            }}></Input>
                        </ButtonGroup>
                    </Field>
                    <Field>
                        <FieldLabel>Company Address</FieldLabel>
                        <Textarea placeholder="Company Address" defaultValue={payload.address} onBlur={(e) => handleChange('address', e.currentTarget.value)}></Textarea>
                    </Field>
                    <Button className="bg-[var(--primary)]" onClick={handleAddPartner}>{isLoadingCreatePartner ? <Spinner/> : "Add Partner"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}