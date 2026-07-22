"use client";

import { FeedbackData, useFeedbackStore } from "@/app/stores/feedback.store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedbackForm() {

    const submitFeedback = useFeedbackStore((s) => s.submitFeedback);
    const isLoading = useFeedbackStore((s) => s.isLoading);

    const [form, setForm] = useState<FeedbackData>({
        name: "",
        email: "",
        issuesEncountered: "",
        valuableFeatures: "",
        improvementsWanted: "",
        recommendWebsite: "",
    });


    const handleSubmit = async () => {
        try {
            const res = await submitFeedback(form);

            if (res) {
                toast.success("Thank you for your feedback!")
            }
        } catch (err) {

        }
    };

    const handleChange = (key: string, value: any) => {
        setForm(prev => ({
            ...prev,
            [key] : key === "recommendedWebsite" ? value === "yes" : value
        }))
    }

    return (
        <div className="p-6 h-full">
            <h1 className="text-2xl font-bold">Feedback</h1>
            <p>Any feedback is greatly appreaciated to improve this website</p>
            <div className="border border-input p-5 rounded-xl bg-[var(--background)] mt-5 mx-auto">
                <div className="flex flex-col">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Your email</FieldLabel>
                            <Input name="email" onChange={(e) => handleChange("email", e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Your name</FieldLabel>
                            <Input name="name" onChange={(e) => handleChange("name", e.currentTarget.value)}></Input>
                        </Field>
                        <Field>
                            <FieldLabel>Did you encounter any issues or bugs while using the website? If yes, please explain</FieldLabel>
                            <Textarea name="issuesEncountered" onChange={(e) => handleChange("issuesEncountered", e.currentTarget.value)}></Textarea>
                        </Field>

                        <Field>
                            <FieldLabel>Which features do you find most valuable?</FieldLabel>
                            <Input name="valuableFeatures" onChange={(e) => handleChange("valuableFeatures", e.currentTarget.value)}></Input>
                        </Field>

                        <Field>
                            <FieldLabel>What improvements would you like to see in the website?</FieldLabel>
                            <Textarea name="improvementsWanted" onChange={(e) => handleChange("improvementsWanted", e.currentTarget.value)}></Textarea>
                        </Field>
                       <RadioGroup onValueChange={(e) => handleChange('recommendWebsite', e)}>
                        <FieldLabel>Would you recommend this website for others?</FieldLabel>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="yes"></RadioGroupItem>
                            <Label>Yes</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="no"></RadioGroupItem>
                            <Label>No</Label>
                        </div>
                       </RadioGroup>
                    </FieldGroup>
                </div>
                <div className="mt-5">
                    <Button onClick={handleSubmit}>{isLoading ? <Spinner></Spinner> : "Submit Form"}</Button>
                </div>
            </div >
        </div >
    )
}