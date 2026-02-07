import {
  ContentPlanItem,
  GenerationFormData,
  SpecializationOption,
  PurposeOption,
  ContentTypeOption,
  InstagramFormat,
} from "./types";

const formats: InstagramFormat[] = [
  "Reels",
  "Carrossel",
  "Post Estático",
  "Stories",
  "Live/Collab",
];

const statuses: ContentPlanItem["status"][] = ["draft"];

const generateTitle = (
  specialization: string,
  purpose: string,
  contentType: string,
  index: number
): string => {
  const templates = [
    `10 ${specialization} ${purpose} Strategies for 2024`,
    `How to Master ${purpose} in ${specialization}`,
    `The Ultimate Guide to ${contentType} Content for ${specialization}`,
    `${specialization} ${purpose}: Best Practices and Tips`,
    `Transform Your ${specialization} Strategy with ${contentType} Content`,
    `Why ${purpose} Matters for ${specialization} Businesses`,
    `${specialization} ${contentType} Content That Converts`,
    `The Future of ${purpose} in ${specialization}`,
    `5 ${specialization} ${contentType} Ideas That Drive Results`,
    `${purpose}: A ${specialization} Success Story`,
    `Breaking Down ${purpose} Strategies for ${specialization}`,
    `Essential ${contentType} Templates for ${specialization}`,
    `${specialization} Trends: ${purpose} Edition`,
    `From Idea to Impact: ${contentType} Content for ${specialization}`,
    `Maximizing ${purpose} ROI in ${specialization}`,
  ];

  return templates[index % templates.length];
};

const generatePainPoint = (
  specialization: string,
  purpose: string
): string => {
  const painPoints: Record<string, Record<string, string[]>> = {
    "Lead Generation": {
      "Digital Marketing": [
        "Struggling to attract qualified leads that convert",
        "Low conversion rates from traffic to leads",
        "Difficulty identifying ideal customer profiles",
      ],
      SaaS: [
        "Long sales cycles preventing consistent lead flow",
        "High customer acquisition costs",
        "Challenges in demonstrating product value quickly",
      ],
      "E-commerce": [
        "Cart abandonment rates affecting revenue",
        "Difficulty in personalizing shopping experiences",
        "Competition from larger marketplaces",
      ],
    },
    "Brand Awareness": {
      "Digital Marketing": [
        "Limited visibility in a crowded market",
        "Difficulty standing out from competitors",
        "Low brand recognition among target audience",
      ],
      SaaS: [
        "Technical complexity makes brand messaging unclear",
        "Competing with established players for attention",
        "Educating market about new category",
      ],
      "E-commerce": [
        "Building trust with new customers",
        "Establishing brand identity in saturated markets",
        "Creating memorable brand experiences online",
      ],
    },
    "Thought Leadership": {
      "Digital Marketing": [
        "Establishing credibility in fast-evolving industry",
        "Generating original insights that resonate",
        "Building authority among industry peers",
      ],
      SaaS: [
        "Positioning as innovation leader",
        "Translating technical expertise into accessible insights",
        "Shaping industry conversations",
      ],
      Healthcare: [
        "Communicating complex medical information clearly",
        "Building trust with patients and professionals",
        "Navigating regulatory constraints in messaging",
      ],
    },
  };

  const specializationPainPoints =
    painPoints[purpose]?.[specialization] ||
    painPoints[purpose]?.["Digital Marketing"] || [
      `Challenges in achieving ${purpose.toLowerCase()} goals`,
      `Difficulty measuring ${purpose.toLowerCase()} effectiveness`,
      `Standing out in competitive ${specialization.toLowerCase()} landscape`,
    ];

  return (
    specializationPainPoints[
    Math.floor(Math.random() * specializationPainPoints.length)
    ] || `Key challenges in ${specialization} for ${purpose}`
  );
};

const generateOutline = (
  specialization: string,
  purpose: string,
  contentType: string
): string => {
  const outlines = [
    `Introduction to ${purpose} in ${specialization} • Key principles and frameworks • Real-world examples and case studies • Best practices and actionable tips • Common pitfalls to avoid • Future trends and opportunities`,
    `Understanding the ${specialization} landscape • Why ${purpose} matters now • Step-by-step implementation guide • Tools and resources needed • Measuring success and KPIs • Next steps for your strategy`,
    `The problem: Current challenges in ${specialization} • The solution: ${contentType} approach • Implementation strategies • Success metrics • Case studies and examples • Getting started checklist`,
    `Overview of ${purpose} strategies • ${specialization}-specific considerations • Content creation framework • Distribution channels • Engagement tactics • ROI measurement`,
    `Defining your ${purpose} objectives • ${specialization} audience analysis • Content planning and calendar • Execution framework • Optimization techniques • Scaling your efforts`,
  ];

  return outlines[Math.floor(Math.random() * outlines.length)];
};

const generateCTA = (purpose: string, contentType: string): string => {
  const ctas: Record<string, string[]> = {
    "Lead Generation": [
      "Download our free guide to get started",
      "Book a consultation to discuss your strategy",
      "Try our tool free for 14 days",
      "Get your personalized content plan",
      "Schedule a demo to see how it works",
    ],
    "Brand Awareness": [
      "Follow us for more insights",
      "Join our community of innovators",
      "Subscribe to our newsletter",
      "Share this with your network",
      "Explore more resources",
    ],
    "Thought Leadership": [
      "Connect with us on LinkedIn",
      "Download the full research report",
      "Join our upcoming webinar",
      "Read our latest industry analysis",
      "Get in touch to collaborate",
    ],
    "Customer Education": [
      "Access our resource library",
      "Enroll in our free course",
      "Watch our tutorial series",
      "Download the complete guide",
      "Join our learning community",
    ],
  };

  const purposeCTAs =
    ctas[purpose] || [
      "Learn more about our solutions",
      "Get started today",
      "Contact us for more information",
      "Explore our resources",
    ];

  return purposeCTAs[Math.floor(Math.random() * purposeCTAs.length)];
};

export function generateMockContentPlan(
  formData: GenerationFormData
): ContentPlanItem[] {
  const items: ContentPlanItem[] = [];
  const count = Math.min(formData.numberOfPublications, 15);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  for (let i = 0; i < count; i++) {
    const format = formats[Math.floor(Math.random() * formats.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const publishDate = new Date(startDate);
    publishDate.setDate(startDate.getDate() + i);
    const publishDateValue = publishDate.toISOString().slice(0, 10);

    items.push({
      id: `plan-item-${Date.now()}-${i}`,
      format,
      title: generateTitle(
        formData.specialization,
        formData.purpose,
        formData.contentType,
        i
      ),
      pain_point: generatePainPoint(
        formData.specialization,
        formData.purpose
      ),
      content_outline: generateOutline(
        formData.specialization,
        formData.purpose,
        formData.contentType
      ),
      cta: generateCTA(formData.purpose, formData.contentType),
      status,
      publish_date: publishDateValue,
    });
  }

  return items;
}
