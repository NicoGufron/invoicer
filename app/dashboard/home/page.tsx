import { useAuthStore } from "@/app/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
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
                <p className="text-xl font-bold">Overview</p>
                <div className="grid grid-cols-4 mt-3 space-x-5">
                    <Item variant={"outline"} className="bg-white">
                        <ItemContent>
                            {/* <ItemTitle>Total Billed</ItemTitle> */}
                            <span className="flex flex-row items-center justify-between space-x-5">
                                <p className="text-muted-foreground">Total Billed</p>
                                <Banknote></Banknote>
                            </span>
                            <p className="text-2xl font-bold">$15,000</p>

                        </ItemContent>
                    </Item>
                    <Item variant={"outline"} className="bg-white">
                        <ItemContent>
                            {/* <ItemTitle>Total Collected</ItemTitle> */}
                            <p className="text-muted-foreground">Total Collected</p>
                            <p className="text-2xl font-bold">$1,500</p>
                        </ItemContent>
                    </Item>

                </div>
            </div>
            <hr className="my-5"></hr>
            <div className="">
                <p className="text-xl font-bold">Quick Links</p>
                <div className="grid grid-cols-3 mt-3 space-x-5">

                    <Item variant={"outline"} className="bg-white" asChild>
                        <Link href="/dashboard/invoice/create">
                            <ItemContent>
                                <ItemTitle>Create New Invoice</ItemTitle>
                                {/* <ItemDescription>This one speaks for itself</ItemDescription> */}
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