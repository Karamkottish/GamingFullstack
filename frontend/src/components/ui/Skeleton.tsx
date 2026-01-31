interface SkeletonProps {
    className?: string
    width?: string
    height?: string
    variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({
    className = '',
    width = '100%',
    height = '20px',
    variant = 'rectangular'
}: SkeletonProps) {
    const variantStyles = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    }

    return (
        <div
            className={`bg-white/5 animate-shimmer ${variantStyles[variant]} ${className}`}
            style={{ width, height }}
        />
    )
}

// Shimmer keyframe animation
export const shimmerAnimation = `
@keyframes shimmer {
    0% {
        background-position: -1000px 0;
    }
    100% {
        background-position: 1000px 0;
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
}
`
