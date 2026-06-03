import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { EyeClosed } from "lucide-react";

interface Props {
    title: string,
    subtitle: string,
    icon: any,
    dark: boolean,
}

export default function FeatureCard({title, subtitle, icon, dark} : Props) {

    return (
        <Item variant={"outline"} className="bg-[var(--surface)] hover:bg-[var(--white)] hover:shadow-lg hover:-translate-y-2 transition-all">
            <ItemHeader>
                <div className={`${dark ? "bg-[var(--primary)]" : "bg-[var(--green-tint)]"} text-white text-xl p-2.5 rounded-lg`}>
                    {icon}
                </div>
            </ItemHeader>
            <ItemContent>
                <ItemTitle className="pb-2.5 text-md font-bold">{title}</ItemTitle>
                <ItemContent>{subtitle}</ItemContent>
            </ItemContent>
        </Item>
    );
}