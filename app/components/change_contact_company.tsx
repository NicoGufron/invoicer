"use client"

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import { Spinner } from "@/components/ui/spinner";

export default function ChangeContactCompanyDrawer() {

    const isUpdating = useCompanyStore((s) => s.isUpdating);
    const saveCompanyUpdate = useCompanyStore((s) => s.saveCompanyUpdate);
    const company = useCompanyStore((s) => s.company);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedPhonePrefix, setSelectedPhonePrefix] = useState("+1");

    const [openPhonePrefix, setOpenPhonePrefix] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);

    const getCountryPhonePrefix = useCompanyStore((s) => s.getCountryPhonePrefix);
    const phonePrefixes = useCompanyStore((s) => s.phonePrefix);

    const [companyContact, setCompanyContact] = useState<Partial<CompanyData>>();

    const handleChange = (key: keyof CompanyData, e : any) => {
        setCompanyContact(prev => ({
            ...prev,
            [key] : e
        }));
    }

    const handleUpdateCompany = async () => {
        if (!company) return;
        const res = await saveCompanyUpdate(company.id, companyContact!);

        if (res) setOpenDrawer(false);

    }

    useEffect(() => {
        setCompanyContact(company!);
    }, [])

    useEffect(() => {
        getCountryPhonePrefix();
    }, [])

    return (
        <Drawer direction="right" open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerTrigger asChild>
                <Button className="mt-5">Change Contact Information</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Change Contact Information</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar px-4">
                    <Field>
                        <FieldLabel>Company Email</FieldLabel>
                        <Input placeholder="" type="email" value={companyContact?.companyEmail ?? ""} onChange={(e) => handleChange('companyEmail', e.currentTarget.value)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Company Phone Number</FieldLabel>
                        <ButtonGroup>
                            {/* <Button variant={"outline"}>+62</Button> */}
                            <Popover open={openPhonePrefix} onOpenChange={setOpenPhonePrefix} modal={true}>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"}>{selectedPhonePrefix}<ChevronDown></ChevronDown></Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="p-0 w-[200px]">
                                    <Command>
                                        <CommandInput></CommandInput>
                                        <CommandList className="overflow-y-auto">
                                            <CommandEmpty>Not found</CommandEmpty>
                                            <CommandGroup heading="Available Phone Prefix">
                                                {phonePrefixes.map((e, index) => (
                                                    <CommandItem key={index} value={e.short_name} onSelect={() => {
                                                        setSelectedPhonePrefix(e.phone_prefix);
                                                        setOpenPhonePrefix(false);
                                                    }}><span className="border-r-1 pr-2">{e.short_name}</span>{e.phone_prefix}</CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Input type="text" defaultValue={companyContact?.companyPhoneNumber ?? ""} maxLength={12} onChange={(e) => {
                                // const num = e.currentTarget.value.replace(/\D/g, "");
                                // setPhoneNumber(num);
                                const num = e.currentTarget.value.replace(/\D/g, "");

                                handleChange('companyPhoneNumber', `${selectedPhonePrefix}${num}`)
                            }}></Input>
                        </ButtonGroup>
                    </Field>
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleUpdateCompany}>{isUpdating ? <Spinner></Spinner> : "Save Changes"}</Button>

                </div>
            </DrawerContent>

        </Drawer>
    )
}