export const spring = {
    type: "spring",
    stiffness: 400,
    damping: 30,
};

export const softSpring = {
    type: "spring",
    stiffness: 300,
    damping: 30,
};

export const bounce = {
    type: "spring",
    stiffness: 500,
    damping: 20,
};

export const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: softSpring,
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: softSpring,
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3, // Added slight delay to ensure question text is visible first
        },
    },
};

export const cardSwipe = (direction: number) => ({
    initial: { opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.9 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
});

export const float = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};
