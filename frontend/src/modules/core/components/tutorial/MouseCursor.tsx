import { MousePointer2, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";

export const MouseCursor = () => {
    const [animate, setAnimate] = useState(false);
    const [click, setClick] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setAnimate(true);
        }, 1000);

        const timer2 = setTimeout(() => {
            setClick(true);
        }, 2300);

        const timer3 = setTimeout(() => {
            setVisible(false);
        }, 3300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <>
            {visible && (
                <>
                    {!click ? (
                        <MousePointer2
                            size={40}
                            className={`absolute right-5 top-1/3 text-primary transform transition-all duration-1000 ${
                                animate ? "animate-move-right" : "opacity-0"
                            }`}
                            fill="hsl(var(--primary))"
                        />
                    ) : (
                        <MousePointerClick
                            size={40}
                            className="absolute right-5 top-1/3 translate-x-[500px] translate-y-[100px] scale-125 text-primary"
                            fill="hsl(var(--primary))"
                        />
                    )}
                </>
            )}
        </>
    );
};

export default MouseCursor;
