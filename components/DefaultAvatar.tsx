'use client';

interface DefaultAvatarProps {
    name: string;
    size?: number;
    className?: string;
}

const COLORS = [
    'bg-[#0071E3]', 'bg-[#34C759]', 'bg-[#FF9500]', 'bg-[#AF52DE]',
    'bg-[#FF3B30]', 'bg-[#5AC8FA]', 'bg-[#FF2D55]', 'bg-[#5856D6]',
];

export default function DefaultAvatar({ name, size = 40, className = '' }: DefaultAvatarProps) {
    const initials = name
        ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    // Deterministic color from name
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const color = COLORS[hash % COLORS.length];

    const fontSize = size < 30 ? 'text-xs' : size < 50 ? 'text-sm' : 'text-lg';

    return (
        <div
            className={`${color} rounded-full flex items-center justify-center text-white font-semibold ${fontSize} ${className}`}
            style={{ width: size, height: size, minWidth: size }}
        >
            {initials}
        </div>
    );
}
