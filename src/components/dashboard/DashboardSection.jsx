import React from "react";
import { motion } from "framer-motion";

const ReactForwardRef = React.forwardRef;

const DashboardSection = ReactForwardRef(function DashboardSection({ id, icon: Icon, title, description, children }, ref) {
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="scroll-mt-32"
    >
      <div className="mb-3 flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
});

export default DashboardSection;