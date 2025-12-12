import { useMemo } from 'react';
import "./Background.css"

export default function Background({ count = 60 }) {
    const comp = [
        { icon: "}", color: "rgba(6, 182, 212, 1)" }, // Cyan
        { icon: ">", color: "rgba(59, 130, 246, 1)" }, // Blue
        { icon: "+", color: "rgba(34, 197, 94, 1)" }, // Green
        { icon: "]", color: "rgba(168, 85, 247, 1)" }, // Purple
        { icon: ")", color: "rgba(236, 72, 153, 1)" }, // Pink
        { icon: "<", color: "rgba(99, 102, 241, 1)" }, // Indigo
        { icon: "{", color: "rgba(14, 165, 233, 1)" }, // Sky
        { icon: "=", color: "rgba(139, 92, 246, 1)" }, // Violet
    ];

    const drops = useMemo(() => {
        const rand = (min, max) => Math.random() * (max - min) + min;

        return Array.from({ length: count }).map(() => ({
            left: rand(0, 100).toFixed(2) + '%',
            delay: rand(0, 10).toFixed(2) + 's',
            duration: rand(3, 7).toFixed(2) + 's',
            comp: comp[Math.floor(Math.random() * comp.length)]
        }));
    }, [count]);

    return (
        <div className="rain-container">
            {drops.map((d, i) => (
                <div key={i} className="drop" style={{ color: d.comp.color, left: d.left, animationDelay: d.delay, animationDuration: d.duration }}>{d.comp.icon}</div>
            ))}
        </div>
    );
}
