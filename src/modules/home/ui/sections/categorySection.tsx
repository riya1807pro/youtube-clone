"use client";
import { FilterCorousal } from "@/components/filterCaursal";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CategorySectionProps {
  categoryId: string;
}

const CategorySection = ({ categoryId }: CategorySectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error....</p>}>
        <CategorySectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionSuspense = ({ categoryId }: CategorySectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const data = categories.map((categories) => ({
    value: categories.id,
    label: categories.name,
  }));
  console.log({ data });
  return (
    <FilterCorousal
      onSelect={(X) => console.log(X)}
      value={categoryId}
      data={data}
      isLoading={false}
    />
  );
};

export default CategorySection;
