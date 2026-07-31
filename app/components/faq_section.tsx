import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqSection() {

    const burningQuestionsAndAnswers = [
        {
            value: "whatisinvoicer",
            question: "What is Invoicer?",
            answer: "Invoicer is a free software for helping small teams to be able to create invoices."
        },
        {
            value: "products",
            question: "What are the products of Invoicer ?",
            answer: "Invoicer only have a reguler invoicing, although several products are being developed."
        },
        {
            value: "freeinvoicer",
            question: "Is Invoicer free?",
            answer: "Currently, yes, Invoicer is free to use for all."
        },
        {
            value: "startinvoicer",
            question: "How do I start using Invoicer?",
            answer: "Simple, you have to create a new free account, setup your profile, and use the features that are available that suited to your needs."
        },
    ]

    return (
        <section className="max-w-[1200px] pt-[148px] px-[5%] pb-[100px] m-auto">
            <div className="text-3xl text-center font-bold">Frequently Asked Questions</div>
            <div className="mt-10">
                <Accordion type={"single"} collapsible className="">
                    {
                        burningQuestionsAndAnswers.map((item, index) => {
                            return (
                                <AccordionItem key={index} value={item.value}>
                                    <AccordionTrigger className="text-xl border-b-1 my-10">{item.question}</AccordionTrigger>
                                    <AccordionContent className="p-5 pl-0 text-lg">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
            </div>
        </section>
    );
}