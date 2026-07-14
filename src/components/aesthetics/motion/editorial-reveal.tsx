"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import {
  editorialReveal,
  editorialStagger,
  fadeUp,
  fadeUpReduced,
} from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "./use-reduced-motion";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  as?: "div" | "section" | "article";
  stagger?: boolean;
};

export function EditorialReveal({
  children,
  className,
  stagger = true,
  as = "div",
  ...rest
}: RevealProps) {
  const reduced = useAesReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -40px 0px" }}
      variants={stagger && !reduced ? editorialStagger : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function EditorialItem({
  children,
  className,
  as = "div",
  ...rest
}: RevealProps) {
  const reduced = useAesReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={cn(className)}
      variants={reduced ? fadeUpReduced : editorialReveal}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Convenience for a heading + paragraphs block */
export function EditorialBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useAesReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={reduced ? undefined : editorialStagger}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={reduced ? fadeUpReduced : fadeUp}>
              {child}
            </motion.div>
          ))
        : (
          <motion.div variants={reduced ? fadeUpReduced : fadeUp}>{children}</motion.div>
        )}
    </motion.div>
  );
}
