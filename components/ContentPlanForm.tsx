"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { generateMockContentPlan } from "@/lib/mockDataGenerator";
import {
  GenerationFormData,
  SpecializationOption,
  PurposeOption,
  ContentTypeOption,
} from "@/lib/types";

const specializationOptions: { value: SpecializationOption; label: string }[] =
  [
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "SaaS", label: "SaaS" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Finance", label: "Finance" },
    { value: "Technology", label: "Technology" },
    { value: "Real Estate", label: "Real Estate" },
  ];

const purposeOptions: { value: PurposeOption; label: string }[] = [
  { value: "Lead Generation", label: "Lead Generation" },
  { value: "Brand Awareness", label: "Brand Awareness" },
  { value: "Thought Leadership", label: "Thought Leadership" },
  { value: "Customer Education", label: "Customer Education" },
  { value: "Product Launch", label: "Product Launch" },
  { value: "Customer Retention", label: "Customer Retention" },
  { value: "Community Building", label: "Community Building" },
];

const contentTypeOptions: { value: ContentTypeOption; label: string }[] = [
  { value: "Educational", label: "Educational" },
  { value: "Promotional", label: "Promotional" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Case Study", label: "Case Study" },
  { value: "How-to Guide", label: "How-to Guide" },
  { value: "News & Updates", label: "News & Updates" },
  { value: "Comparison", label: "Comparison" },
  { value: "Review", label: "Review" },
];

export const ContentPlanForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<GenerationFormData>({
    specialization: "",
    purpose: "",
    contentType: "",
    numberOfPublications: 5,
    context: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GenerationFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GenerationFormData, string>> = {};

    if (!formData.specialization) {
      newErrors.specialization = "Specialization is required";
    }
    if (!formData.purpose) {
      newErrors.purpose = "Purpose of publication is required";
    }
    if (!formData.contentType) {
      newErrors.contentType = "Type of content is required";
    }
    if (
      !formData.numberOfPublications ||
      formData.numberOfPublications < 1 ||
      formData.numberOfPublications > 15
    ) {
      newErrors.numberOfPublications =
        "Number of publications must be between 1 and 15";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const generatedItems = generateMockContentPlan(formData);
    
    // Store in sessionStorage to persist across navigation
    sessionStorage.setItem("contentPlanItems", JSON.stringify(generatedItems));
    
    router.push("/plan");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Specialization"
          options={specializationOptions}
          value={formData.specialization}
          onValueChange={(value) =>
            setFormData({ ...formData, specialization: value })
          }
          error={errors.specialization}
          required
        />

        <Select
          label="Purpose of publication"
          options={purposeOptions}
          value={formData.purpose}
          onValueChange={(value) =>
            setFormData({ ...formData, purpose: value })
          }
          error={errors.purpose}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Type of content"
          options={contentTypeOptions}
          value={formData.contentType}
          onValueChange={(value) =>
            setFormData({ ...formData, contentType: value })
          }
          error={errors.contentType}
          required
        />

        <Input
          label="Number of publications"
          type="number"
          min={1}
          max={15}
          value={formData.numberOfPublications.toString()}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfPublications: parseInt(e.target.value) || 0,
            })
          }
          error={errors.numberOfPublications}
          required
        />
      </div>

      <Textarea
        label="Context / wishes"
        value={formData.context}
        onChange={(e) =>
          setFormData({ ...formData, context: e.target.value })
        }
        placeholder="Enter any additional context, specific requirements, or wishes for your content plan..."
      />

      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full md:w-auto">
          Generate content plan
        </Button>
      </div>
    </form>
  );
};

