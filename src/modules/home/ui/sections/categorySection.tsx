"use client";
import { trpc } from "@/trpc/client";

interface CategorySectionProps {
  categoryId: string;
}

export const CategorySection = ({ categoryId }: CategorySectionProps) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  return <div>{JSON.stringify(categories)}</div>;
};
