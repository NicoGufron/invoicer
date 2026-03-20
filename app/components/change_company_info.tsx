import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import React, { useEffect, useState } from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ChangeCompanyInfoDialog() {

    const getCountries = useCompanyStore((s) => s.getCountries);
    const countries = useCompanyStore((s) => s.countries);
    const saveCompanyUpdate = useCompanyStore((s) => s.saveCompanyUpdate);
    const company = useCompanyStore((s) => s.company);

    const isUpdating = useCompanyStore((s) => s.isUpdating);

    const [companyData, setCompanyData] = useState<Partial<CompanyData>>();

    const [openCountryPopover, setOpenCountryPopover] = useState(false);
 
    const handleChange = (key: keyof CompanyData, e: any) => {
        setCompanyData(prev => ({
            ...prev,
            [key] : e
        }));
    }

    const handleUpdateCompany = async () => {
        if (!company) return;

        const res = await saveCompanyUpdate(company.id, companyData!)
    }

    useEffect(() => {
        setCompanyData(company!)
    }, [])

    useEffect(() => {
        getCountries();
    }, [getCountries])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mt-5">Change Company Information</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Change Company Information</DialogTitle>
                <div className="flex flex-col gap-5 overflow-y-auto">
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input placeholder="Your company name" name="name" value={companyData?.companyName ?? ""} onChange={(e) => handleChange("companyName", e.currentTarget.value)}></Input>
                        <FieldDescription>Your company name will be displayed in all invoices</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel>Company Type</FieldLabel>
                        <Select onValueChange={(e) => handleChange('companyType', e)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select company type">{companyData?.companyType ?? ""}</SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper" >
                                <SelectGroup>
                                    <SelectItem value='service'>Service</SelectItem>
                                    <SelectItem value='product'>Product</SelectItem>
                                    <SelectItem value='pns'>Product & Service</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel>Company Description</FieldLabel>
                        <Textarea name="companyDescription" placeholder="Your company name" value={companyData?.companyDescription ?? ""} onChange={(e) => handleChange("companyDescription", e.currentTarget.value)}></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Company Address</FieldLabel>
                        <Textarea placeholder="Your company address" value={companyData?.companyAddress ?? ""} onChange={(e) => handleChange('companyAddress', e.currentTarget.value)}></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Country</FieldLabel>
                        {/* <Input placeholder="Your company country"></Input> */}
                        {/* <Select>
                            <SelectTrigger>
                                <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    {countries.map((e, index) => (
                                        <SelectItem key={index} value={e}>{e}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}
                        <Popover open={openCountryPopover} onOpenChange={setOpenCountryPopover}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between">
                                    {companyData?.country === "" ? "Select a country" : companyData?.country }
                                    <ChevronDown></ChevronDown>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="PopoverContent">
                                <Command>
                                    <CommandInput placeholder="Please select a country"></CommandInput>
                                    <CommandList>
                                        <CommandGroup>
                                            {countries.map((e, index) => (
                                                <CommandItem key={index} value={e.country_name} onSelect={() => {
                                                    handleChange('country', e.country_name)
                                                    setOpenCountryPopover(false);
                                                }}><b>{e.short_name}</b> {e.country_name}</CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <Field>
                        <FieldLabel>City</FieldLabel>
                        <Input placeholder="Your city" value={companyData?.city ?? ""} onChange={(e) => handleChange('city', e.currentTarget.value)}></Input>
                    </Field>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleUpdateCompany}>{isUpdating ? <Spinner></Spinner> : "Save Changes"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}