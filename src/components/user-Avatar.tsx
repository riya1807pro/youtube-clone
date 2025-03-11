import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "w-10 h-10",
      xs: "w-4 h-4",
      sm: "w-6 h-6",
      lg: "w-10 h-10",
      xl: "w-[160px] h-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageURL: string;
  name: string;
  className?: string;
  onClick?: () => void;
}
export const UserAvatar = ({
  imageURL,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageURL} alt={name} className="rounded-full" />
    </Avatar>
  );
};
