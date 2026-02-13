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

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
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
