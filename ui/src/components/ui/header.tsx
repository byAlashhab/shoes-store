import { twMerge } from "tailwind-merge";

function Header({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        "text-xl font-thin border border-black py-1 px-4 rounded w-fit",
        className
      )}
    >
      {children}
    </h2>
  );
}

export default Header;
