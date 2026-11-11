import { useInView } from "../lib/hooks";

export default function Reveal({ children, className = "", delay = 0, as: Tag = "div", variant = "up", threshold = 0.15, enabled = true, style, ...rest }) {
  const [ref, seen] = useInView({ threshold });
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={`${seen && enabled ? "is-in" : ""} ${className}`.trim()}
      style={{ ...(delay ? { "--d": `${delay}ms` } : null), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
