import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, user</h1>
            <hr className="my-5"></hr>
            <div className="">
                <p className="text-xl font-bold">Quick Links</p>
                <div className="grid grid-cols-3 mt-3 space-x-5">

                    <Item variant={"outline"} className="bg-white" asChild>
                        <Link href="/dashboard/generate">
                            <ItemContent>
                                <ItemTitle>Generate Invoice</ItemTitle>
                                {/* <ItemDescription>This one speaks for itself</ItemDescription> */}
                            </ItemContent>
                            <ItemActions>
                                <ArrowRight></ArrowRight>
                            </ItemActions>
                        </Link>
                    </Item>
                    <Item variant={"outline"} className="bg-white" asChild>
                        <Link href="/dashboard/partner/create">
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