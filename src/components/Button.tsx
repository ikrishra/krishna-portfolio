import classNames from "classnames";

type ButtonType = {
  buttonText: string;
  rounded?: "none" | "md" | "full";
  size?: "sm" | "md" | "lg";
  color?: "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
};

const Button = ({
  buttonText = "Button",
  rounded = "none",
  size = "md",
  color = "cyan",
  disabled,
  className,
  onClick,
  href,
}: ButtonType) => {
  const baseClasses = classNames(
    "border-black border-2 font-bold transition-all duration-200 cursor-pointer inline-block text-center",
    {
      "bg-violet-200 hover:bg-violet-300 active:bg-violet-400":
        color === "violet" && !disabled,
    },
    {
      "bg-pink-200 hover:bg-pink-300 active:bg-pink-400":
        color === "pink" && !disabled,
    },
    {
      "bg-red-200 hover:bg-red-300 active:bg-red-400":
        color === "red" && !disabled,
    },
    {
      "bg-orange-200 hover:bg-orange-300 active:bg-orange-400":
        color === "orange" && !disabled,
    },
    {
      "bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-400":
        color === "yellow" && !disabled,
    },
    {
      "bg-lime-200 hover:bg-lime-300 active:bg-lime-400":
        color === "lime" && !disabled,
    },
    {
      "bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400":
        color === "cyan" && !disabled,
    },
    {
      "bg-gray-200 text-gray-500 cursor-not-allowed": disabled,
    },
    {
      "rounded-none": rounded === "none",
    },
    {
      "rounded-md": rounded === "md",
    },
    {
      "rounded-full": rounded === "full",
    },
    {
      "px-3 py-2 text-sm": size === "sm",
    },
    {
      "px-4 py-3 text-base": size === "md",
    },
    {
      "px-6 py-4 text-lg": size === "lg",
    },
    {
      "hover:shadow-brutal": !disabled,
    },
    className
  );

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//');
    return (
      <a href={href} className={baseClasses} target={isExternal ? "_blank" : "_self"} rel={isExternal ? "noopener noreferrer" : ""}>
        {buttonText}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default Button;