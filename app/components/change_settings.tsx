"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function Settings() {

    const company = useCompanyStore((s) => s.company);
    const getCompany = useCompanyStore((s) => s.getCompany);
    const saveCompanyUpdate = useCompanyStore((s) => s.saveCompanyUpdate);
    const isUpdating = useCompanyStore((s) => s.isUpdating);

    const [companyTermsAndNotes, setCompanyTermsAndNotes] = useState<Partial<CompanyData>>();

    useEffect(() => {
        getCompany();
    }, [getCompany])

    const handleChange = (key: keyof CompanyData, e: any) => {
        setCompanyTermsAndNotes(prev => ({
            ...prev,
            [key] : e,
        }));
    }

    const handleUpdateCompany = async () => {
        if (!company) return;

        const res = await saveCompanyUpdate(company.id, companyTermsAndNotes!);

        if (res) toast.success("Changes saved", )
    }

    useEffect(() => {
        setCompanyTermsAndNotes(company!);
    }, [])

    return (
        <div className="py-5">
            <Item variant={"outline"} className="bg-blue-50 w-full ">
                <ItemMedia><Info size={16}></Info></ItemMedia>
                <ItemContent>
                    <ItemTitle>Attention</ItemTitle>
                    <ItemDescription className="text-black">Changes will be saved and applied to future invoices automatically</ItemDescription>
                </ItemContent>
            </Item>
            <div>
                <div className="flex flex-col gap-5 mt-5">
                    <Field>
                        <FieldLabel>Notes</FieldLabel>
                        <Textarea rows={3} defaultValue={company?.default_notes} onChange={(e) => handleChange('default_notes', e.currentTarget.value)}></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Terms</FieldLabel>
                        <Textarea rows={3} defaultValue={company?.default_terms} onChange={(e) => handleChange('default_terms', e.currentTarget.value)}></Textarea>
                    </Field>
                </div>
                <Button className="mt-5" onClick={handleUpdateCompany}>{isUpdating ? <Spinner></Spinner> : "Save changes"}</Button>
            </div>
        </div>
    )
}