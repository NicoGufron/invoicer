import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import { useState } from "react";

export default function ChangeCompanyInfoDialog() {

    const updateCompany = useCompanyStore((s) => s.updateCompany);
    const company = useCompanyStore((s) => s.company);

    const [companyData, setCompanyData] = useState<Partial<CompanyData>>();

    const handleChange = (key: keyof CompanyData, e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyData({
            ...companyData,
            [key]: e.currentTarget.value
        })
    }

    const countries = ["United States", "Indonesia"];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-5">Change Company Information</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Change Company Information</DialogTitle>
                <div className="flex flex-col gap-5">
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input placeholder="Your company name" name="name" value={company?.companyName} onChange={(e) => handleChange("companyName", e)}></Input>
                        <FieldDescription>Your company name will be displayed in all invoices</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel>Company Type</FieldLabel>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select company type"></SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value='service'>Service</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>Company Description</FieldLabel>
                        <Textarea placeholder="Your company name"></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Company Address</FieldLabel>
                        <Textarea placeholder="Your company address"></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Country</FieldLabel>
                        {/* <Input placeholder="Your company country"></Input> */}
                        <Select>
                            <SelectTrigger>
                                <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    {countries.map((e) => (
                                        <SelectItem value={e}>{e}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>City</FieldLabel>
                        {/* <Input placeholder="Your "></Input> */}
                    </Field>
                    <Button className="bg-green-500">Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}