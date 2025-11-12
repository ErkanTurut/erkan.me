"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Magnetic } from "./ui/magnetic";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

// Configuration constants - easy to customize
const CARD_CONFIG = {
  magneticIntensity: 0.5,
  magneticRange: 200,
  tiltDegrees: 8,
  hideDelay: 800, // milliseconds to wait before hiding the card
} as const;

interface PatrickBatemanCardProps {
  className?: string;
  /** Additional CSS classes for the card content */
  contentClassName?: string;
  /** Magnetic effect intensity (0-1) */
  magneticIntensity?: number;
  /** Magnetic effect range in pixels */
  magneticRange?: number;
  /** Enable/disable 3D tilt effect */
  enableTilt?: boolean;
  /** Tilt intensity in degrees */
  tiltDegrees?: number;
}

export function PatrickBatemanCard({
  className,
  contentClassName,
  magneticIntensity = CARD_CONFIG.magneticIntensity,
  magneticRange = CARD_CONFIG.magneticRange,
  enableTilt = true,
  tiltDegrees = CARD_CONFIG.tiltDegrees,
}: PatrickBatemanCardProps = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine dimensions
  const dimensions = { width: "400px", height: "226px" };

  // Motion values for smooth position transitions
  // Start in hidden position (approximate offset based on card size)
  const translateX = useMotionValue(360);
  const translateY = useMotionValue(186);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Apply spring animation to all transforms
  const springConfig = { stiffness: 100, damping: 20, mass: 0.8 };
  const springTranslateX = useSpring(translateX, springConfig);
  const springTranslateY = useSpring(translateY, springConfig);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  // Debounced callback to hide the card after a delay
  const debouncedHide = useDebouncedCallback(() => {
    setIsHovered(false);
  }, CARD_CONFIG.hideDelay);

  const handleMouseEnter = () => {
    debouncedHide.cancel(); // Cancel any pending hide operation
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    debouncedHide(); // Start the debounced hide timer
  };

  // Update position based on hover state
  useEffect(() => {
    if (isHovered) {
      translateX.set(0);
      translateY.set(0);
    } else {
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const offsetX = rect.width - 40;
        const offsetY = rect.height - 40;
        translateX.set(offsetX);
        translateY.set(offsetY);
      }
    }
  }, [isHovered, translateX, translateY]);

  // Handle tilt effect
  useEffect(() => {
    if (!enableTilt) return;

    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -tiltDegrees;
      const rotY = ((x - centerX) / centerX) * tiltDegrees;

      rotateX.set(rotX);
      rotateY.set(rotY);
    };

    const handleMouseLeaveCard = () => {
      rotateX.set(0);
      rotateY.set(0);
    };

    if (isHovered) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeaveCard);
    }

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeaveCard);
    };
  }, [isHovered, enableTilt, tiltDegrees, rotateX, rotateY]);

  return (
    <div className={cn("fixed z-50", "bottom-5 right-7", className)}>
      <div className="relative">
        {/* Card Container */}
        <motion.div
          ref={cardRef}
          style={{
            x: springTranslateX,
            y: springTranslateY,
            rotateX: springRotateX,
            rotateY: springRotateY,
            width: `min(90vw, ${dimensions.width})`,
            height: `min(calc(90vw * 0.565), ${dimensions.height})`,
            transformStyle: "preserve-3d",
            transformPerspective: 1200,
            pointerEvents: isHovered ? "auto" : "none",
          }}
        >
          <Magnetic
            intensity={magneticIntensity}
            range={magneticRange}
            actionArea="parent"
          >
            {/* The Business Card */}
            <div
              className={cn(
                "relative w-full h-full p-6 overflow-hidden",
                "bg-background border-[1.5px] border-border",
                "font-serif shadow-md",
                contentClassName
              )}
              style={{
                pointerEvents: "auto",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: `url('/img/texture.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Card Content */}
              <div className="relative h-full flex flex-col justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start text-xs text-muted-foreground">
                  <div className="tracking-wider font-light leading-tight">
                    212 555 6342
                  </div>
                  <div className="text-right">
                    <div className="tracking-[0.15em] font-light leading-none mb-0.5 ">
                      Pierce & Pierce
                    </div>
                    <div className="font-light">Mergers & Acquisitions</div>
                  </div>
                </div>

                {/* Center Section */}
                <div className="text-center my-10">
                  <div className="mb-3">
                    <div className="text-xl tracking-[0.12em] leading-none mb-1 text-muted-foreground">
                      Erkan Turut
                    </div>
                    <div className="text-sm tracking-[0.18em] font-light italic text-muted-foreground">
                      Vice President
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div>
                  <div className="text-[0.50rem] tracking-wider font-light leading-relaxed text-muted-foreground">
                    <span className="inline-block">
                      358 Exchange Place, New York, N.Y. 100099
                    </span>
                    <span className="mx-2">FAX</span>
                    <span className="inline-block">212 555 6390</span>
                    <span className="mx-2">TELEX</span>
                    <span className="inline-block">10 4534</span>
                  </div>
                </div>
              </div>
            </div>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
