"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useCompanyStore } from "../stores/company.store";
import ChangeContactCompanyDrawer from "./change_contact_company";
import ChangeCompanyInfoDrawer from "./change_company_info";

export default function CompanyInfo() {

    const company = useCompanyStore((s) => s.company);
    const getCompany = useCompanyStore((s) => s.getCompany);

    useEffect(() => {
        getCompany();
    }, [getCompany])

    return (
        <div className="flex flex-col items-start justify-start py-5 gap-6">
            <Item variant={"outline"} className="bg-blue-50 w-full">
                <ItemMedia><Info size={16}></Info></ItemMedia>
                <ItemContent>
                    <ItemTitle>Company Profile Information</ItemTitle>
                    <ItemDescription className="text-black">Create invoices using your company's information</ItemDescription>
                </ItemContent>
            </Item>
            <div className="flex flex-col gap-5 rounded-xl w-full">
                <Accordion type="multiple" className="border rounded-lg px-5">
                    <AccordionItem value="compro" className="border-b last:border-b-0">
                        <AccordionTrigger className="text-md font-bold">Company Profile Information</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col">

                                <div className="grid grid-cols-2 gap-5 mb-5">
                                    <Field>
                                        <FieldLabel>Company Name</FieldLabel>
                                        <p>{company?.companyName ?? "-"}</p>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Company Type</FieldLabel>
                                        <p>{company?.companyType ?? "-"}</p>
                                    </Field>
                                    <Field className="col-span-1">
                                        <FieldLabel>Company Description</FieldLabel>
                                        <p>{company?.companyDescription ?? "-"}</p>
                                    </Field>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <Field>
                                        <FieldLabel>Country</FieldLabel>
                                        <p>{company?.country ?? "-"}</p>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Company Address</FieldLabel>
                                        <p>{company?.companyAddress ?? "-"}</p>
                                    </Field>
                                    <Field>
                                        <FieldLabel>City</FieldLabel>
                                        <p>{company?.city ?? "-"}</p>
                                    </Field>
                                </div>
                            </div>
                        <ChangeCompanyInfoDrawer></ChangeCompanyInfoDrawer>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="compcon">
                        <AccordionTrigger className="text-md font-bold">Company Contact Information</AccordionTrigger>
                        <AccordionContent className="space-y-5">
                            <Field>
                                <FieldLabel>Company Email</FieldLabel>
                                <p>{company?.companyEmail ?? "-"}</p>
                            </Field>
                            <Field>
                                <FieldLabel>Company Phone Number</FieldLabel>
                                <p>{company?.companyPhoneNumber}</p>
                            </Field>
                            {/* <Button>Change Contact Information</Button> */}
                            <ChangeContactCompanyDrawer></ChangeContactCompanyDrawer>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </div>
    )
}