import { CategorySection } from "../sections/categorySection";

interface HomeViewProps {
  categoryId: string;
}
export const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 mx-auto pt-2.5 flex flex-col ">
      <CategorySection categoryId={categoryId} />
    </div>
  );
};
