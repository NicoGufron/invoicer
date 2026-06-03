import StepHow from "./step_how";

export default function HowToSection() {


    const step = [
        {
            title: "Create invoice",
            subtitle: "Start a new invoice from scratch or from a saved template in seconds."
        },
        {
            title: "Add line items",
            subtitle: "List your services, set quantities, add discounts and choose a currency."
        },
        {
            title: "Pick a partner",
            subtitle: "Select a saved client or add a new one — their details auto-fill instantly."
        },
        {
            title: "Export or send",
            subtitle: "Download as PDF, export as JSON, or send directly to your client's inbox."
        },
    ]

    return (
        <section className="bg-[var(--primary)] pt-[100px] px-[5%]" id="how">
            <div className="max-w-[1200px]" style={{ margin: "0 auto" }}>

                <div className="uppercase tracking-wide text-sm font-bold text-[var(--green)] pb-5">How It Works</div>
                <div className="text-3xl font-bold text-white">From blank to sent <br></br>in four steps.</div>

                <div className="steps">
                    {
                        step.map((e, index) => (
                            <StepHow key={index} index={"0" + (index + 1)} title={e.title} subtitle={e.subtitle}></StepHow>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}