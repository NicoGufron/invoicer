import { useAuthStore } from "@/app/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/server";
import { AlertCircle, AlertCircleIcon, ArrowRight, Banknote, Info } from "lucide-react";
import Link from "next/link";

export default async function Home() {

    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, {user.data.user?.user_metadata.fullName}</h1>
            <div className="flex flex-col items-start justify-start">
                {user?.data.user?.user_metadata.profileSetup === false ? (
                    <Item variant="outline" className="mt-3 bg-white">
                        <ItemMedia><Info size={16}></Info></ItemMedia>
                        <ItemContent>
                            <ItemTitle className="font-bold">Complete your profile setup</ItemTitle>
                            <ItemDescription>Add your details to unlock features and start sending invoices</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Link href={"./profile"}>
                                <Button size="sm" className="cursor-pointer">Setup Now</Button>
                            </Link>
                        </ItemActions>
                    </Item>
                ) : (
                    <></>
                )}

            </div>
            <div className="my-5">
                <p className="text-xl font-bold">Dashboard</p>
                <Tabs>
                    <TabsList defaultValue={"today"}>
                        <TabsTrigger value={"today"}>Today</TabsTrigger>
                        <TabsTrigger value={"weekly"}>7 Days</TabsTrigger>
                        <TabsTrigger value={"monthly"}>30 Days</TabsTrigger>
                        <TabsTrigger value={"threemonth"}>90 Days</TabsTrigger>
                    </TabsList>
                    <TabsContent value="today">
                        <div className="grid grid-cols-4 gap-5">
                            <div className="flex flex-col justify-between border border-white/8 rounded-lg p-5 bg-[var(--card)] shadow-md space-y-2.5 hover:-translate-y-1 transition-all hover:shadow-lg">
                                <p className="font-bold text-sm">Payments Due</p>
                                <p className="text-2xl font-bold">$18,101</p>
                            </div>
                            <div className="flex flex-col justify-between border border-white/8 rounded-lg p-5 bg-[var(--card)] shadow-md space-y-2.5 hover:-translate-y-1 transition-all hover:shadow-lg">
                                <p className="font-bold text-sm">Total to be paid</p>
                                <p className="text-2xl font-bold">$18,101</p>
                            </div>
                            <div className="flex flex-col justify-between border border-white/8 rounded-lg p-5 bg-[var(--card)] shadow-md space-y-2.5 hover:-translate-y-1 transition-all hover:shadow-lg">
                                <p className="font-bold text-sm">Total to be paid</p>
                                <p className="text-2xl font-bold">$18,101</p>
                            </div>
                            <div className="flex flex-col justify-between border border-white/8 rounded-lg p-5 bg-[var(--card)] shadow-md space-y-2.5 hover:-translate-y-1 transition-all hover:shadow-lg">
                                <p className="font-bold text-sm">Total to be paid</p>
                                <p className="text-2xl font-bold">$18,101</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <hr className="my-5"></hr>
            <div className="">
                <p className="text-xl font-bold">Quick Links</p>
                <div className="grid grid-cols-3 mt-3 space-x-5">

                    <Item variant={"outline"} className="bg-white" asChild>
                        <Link href="/dashboard/invoice/create">
                            <ItemContent>
                                <ItemTitle>Create New Invoice</ItemTitle>
                                <ItemDescription>Create and send invoice to your partner</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ArrowRight></ArrowRight>
                            </ItemActions>
                        </Link>
                    </Item>
                    <Item variant={"outline"} className="bg-white" asChild>
                        <Link href="/dashboard/partner/">
                            <ItemContent>
                                <ItemTitle>Add new Partner</ItemTitle>
                                <ItemDescription>Create a new partner and save for future use</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ArrowRight></ArrowRight>
                            </ItemActions>
                        </Link>
                    </Item>
                </div>
            </div>
        </div>
    )
}