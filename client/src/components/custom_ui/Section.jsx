import { cn } from "@/lib/utils";

const Section = ({ children, className }) => {
  return (
    <section className={cn("h-full overflow-y-auto", className)}>
      {children}
    </section>
  );
};

export default Section;
