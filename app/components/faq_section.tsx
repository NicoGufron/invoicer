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
            question: "What are the products of Invoicer?",
            answer: "Invoicer only have a reguler invoicing, although several products are being developed."
        },
        {
            value: "customtax",
            question: "Can I customize taxes and discounts per line item?",
            answer: "Absolutely. Apply per-item percentage or fixed discounts, and configure multiple tax rates (VAT, GST, Sales Tax) with automatic sum calculation and custom tax identifiers."
        },
        {
            value: "freeinvoicer",
            question: "Is Invoicer really free to start?",
            answer: "Yes, generate up to unlimited invoices at zero cost with full PDF and JSON export features. No credit card is required when signing up."
        },
        {
            value: "multiplepartner",
            question: "Can I store multiple partner and client contacts?",
            answer: "Yes, partner management allows you to store client addresses, client phone numbers, and tax IDs."
        },
        {
            value: "startinvoicer",
            question: "How do I start using Invoicer?",
            answer: "Simple, you have to create a new free account, setup your profile, and use the features that are available that suited to your needs."
        },
    ]

    return (
        <section id="faq" className="pt-[148px] px-[5%] pb-[100px] m-auto bg-[#F2EFFF]">
            <div className="uppercase tracking-wide text-sm font-bold text-[var(--primary)] pb-5 text-center">Got questions?</div>
            <div className="text-3xl text-center font-bold">Frequently Asked Questions</div>
            <div className="mt-10">
                <Accordion type={"single"} collapsible className="max-w-[1200px] m-auto">
                    {
                        burningQuestionsAndAnswers.map((item, index) => {
                            return (
                                <AccordionItem className="bg-white rounded-xl my-2.5" key={index} value={item.value}>
                                    <AccordionTrigger className="text-lg my-2.5 px-5 font-bold">{item.question}</AccordionTrigger>
                                    <AccordionContent className="pl-0 text-lg px-5 text-md">
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