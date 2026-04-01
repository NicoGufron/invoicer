import { useAuthStore } from "@/app/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { createClient } from "@/lib/server";
import { AlertCircle, AlertCircleIcon, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

export default async function Home() {

    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, {user.data.user?.user_metadata.fullName}</h1>
            <div className="flex flex-col items-start justify-start">
                {user?.data.user?.user_metadata.profileSetup === false || user?.data.user?.user_metadata.profileSetup === undefined ? (
                    <Item variant="outline" className="mt-3 bg-white">
                        <ItemMedia><Info size={16}></Info></ItemMedia>
                        <ItemContent>
                            <ItemTitle>Set up your profile</ItemTitle>
                            <ItemDescription>You need to set up your profile to access more features</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Link href={"./profile"}>
                                <Button size="sm" variant={"outline"} className="cursor-pointer">Setup</Button>
                            </Link>
                        </ItemActions>
                    </Item>
                ) : (
                    <></>
                )}

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