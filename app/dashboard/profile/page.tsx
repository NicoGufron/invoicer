import CompanyInfo from "@/app/components/company_info";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/server";
import { Info } from "lucide-react";
import ChangeProfileDetails from "../home/change_profile_details";
import ChangePassword from "../home/change_password";

export default async function ProfilePage() {

    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    
    return (
        <section className="p-6">
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-xs">Change your personal and company profile settings.</p>
            <div className="bg-white border-1 rounded-lg shadow-sm mt-5 p-5">
                <Tabs defaultValue="personal">
                    <TabsList variant={"line"}>
                        <TabsTrigger value="personal">Personal Profile</TabsTrigger>
                        <TabsTrigger value="company">Company Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                        <div className="flex flex-col items-start justify-start py-5 gap-6">
                            <Item variant={"outline"} className="bg-blue-50 w-full">
                                <ItemMedia><Info size={16}></Info></ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Personal Profile Information</ItemTitle>
                                    <ItemDescription className="text-black">Login Invoicer using <b>Email</b> and <b>Password</b></ItemDescription>
                                </ItemContent>
                            </Item>
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <p>{data.user?.user_metadata.fullName}</p>
                            </Field>
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <p>{data.user?.user_metadata.email}</p>
                            </Field>
                            <Field>
                                <FieldLabel>Phone Number</FieldLabel>
                                <p>{data.user?.user_metadata.phoneNumber}</p>
                            </Field>
                        </div>
                        <hr></hr>
                        <span className="flex flex-row gap-5 my-5">
                            {/* <Button>Change Password</Button> */}
                            <ChangePassword></ChangePassword>
                            {/* <Button>Change Profile Details</Button> */}
                            <ChangeProfileDetails user={data.user}></ChangeProfileDetails>
                        </span>
                    </TabsContent>

                    <TabsContent value="company">
                        <CompanyInfo></CompanyInfo>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}