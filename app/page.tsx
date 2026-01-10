import { ContentPlanForm } from "@/components/ContentPlanForm";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Plan Generator
          </h1>
          <p className="text-gray-600">
            Fill out the form below to generate a customized content plan for
            your needs.
          </p>
        </div>
        <ContentPlanForm />
      </div>
    </div>
  );
}

