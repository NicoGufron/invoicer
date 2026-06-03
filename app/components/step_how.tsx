interface Props {
    index: string,
    title: string,
    subtitle: string,
}

export default function StepHow({index, title, subtitle} : Props) {
    return (
        <div className="step pr-[32px] py-10">
            <div className="step-connector"></div>
            <div className="step-number">{index}</div>
            <div className="step-title font-bold pt-5">{title}</div>
            <div className="step-desc">{subtitle}</div>
        </div>
    )
}