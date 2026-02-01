import { useEffect, useRef } from "react";
import "./App.css";
import tidzhoy from "./assets/tidzhoy.jpg";
import sybau from "./assets/sybau.gif";
import creep from "./assets/creep.jpg";

function App() {
    const noBtnRef = useRef(null);
    const velocity = useRef({ x: 0, y: 0 });

    const hasInteracted = useRef(false);
    const idleTick = useRef(0);

    useEffect(() => {
        const btn = noBtnRef.current;
        if (!btn) return;

        btn.style.left = "40%";
        btn.style.top = "55%";

        const EDGE_MARGIN = 30;
        const ESCAPE_FORCE = 8;

        const handleMouseMove = (e) => {
            hasInteracted.current = true;

            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = cx - e.clientX;
            const dy = cy - e.clientY;

            const distance = Math.hypot(dx, dy) || 1;
            const radius = 260;

            if (distance < radius) {
                const force = (radius - distance) / radius;

                velocity.current.x += (dx / distance) * force * 7;
                velocity.current.y += (dy / distance) * force * 7;

                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                if (rect.left < EDGE_MARGIN) velocity.current.x += ESCAPE_FORCE;
                if (rect.left > maxX - EDGE_MARGIN) velocity.current.x -= ESCAPE_FORCE;
                if (rect.top < EDGE_MARGIN) velocity.current.y += ESCAPE_FORCE;
                if (rect.top > maxY - EDGE_MARGIN) velocity.current.y -= ESCAPE_FORCE;
            }
        };

        const handleTouch = (e) => {
            hasInteracted.current = true;

            const touch = e.touches[0];
            if (!touch) return;

            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = cx - touch.clientX;
            const dy = cy - touch.clientY;

            const distance = Math.hypot(dx, dy) || 1;
            const TAP_FORCE = 22;

            velocity.current.x += (dx / distance) * TAP_FORCE;
            velocity.current.y += (dy / distance) * TAP_FORCE;

            velocity.current.x += (Math.random() - 0.5) * 8;
            velocity.current.y += (Math.random() - 0.5) * 8;
        };

        const animate = () => {
            const maxX = window.innerWidth - btn.offsetWidth;
            const maxY = window.innerHeight - btn.offsetHeight;

            if (!hasInteracted.current) {
                idleTick.current += 1;

                velocity.current.x =
                    Math.sin(idleTick.current / 50) * 1.8 +
                    Math.sin(idleTick.current / 120) * 1.2;

                velocity.current.y =
                    Math.cos(idleTick.current / 65) * 1.6 +
                    Math.cos(idleTick.current / 140) * 1.1;
            }

            let x = btn.offsetLeft + velocity.current.x;
            let y = btn.offsetTop + velocity.current.y;

            const bounce = 0.98;

            if (x < 0) {
                x = 0;
                velocity.current.x = Math.abs(velocity.current.x) * bounce;
            } else if (x > maxX) {
                x = maxX;
                velocity.current.x = -Math.abs(velocity.current.x) * bounce;
            }

            if (y < 0) {
                y = 0;
                velocity.current.y = Math.abs(velocity.current.y) * bounce;
            } else if (y > maxY) {
                y = maxY;
                velocity.current.y = -Math.abs(velocity.current.y) * bounce;
            }

            if (hasInteracted.current) {
                velocity.current.x *= 0.92;
                velocity.current.y *= 0.92;
            }

            btn.style.left = `${x}px`;
            btn.style.top = `${y}px`;

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchstart", handleTouch, { passive: true });
        window.addEventListener("touchmove", handleTouch, { passive: true });

        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchstart", handleTouch);
            window.removeEventListener("touchmove", handleTouch);
        };
    }, []);

    return (
        <div className="scene">
            <img src={tidzhoy} className="decor decor-1"/>
            <img src={sybau} className="decor decor-2"/>
            <img src={creep} className="decor decor-3"/>

            <div className="container">
                <h1>Будешь моей свэговой валентинкой?</h1>

                <div className="buttons">
                    <button
                        className="yes"
                        onClick={() => alert("Конечно ты скажешь да))")}
                    >
                        Да
                    </button>

                    <button
                        className="no"
                        ref={noBtnRef}
                        onClick={(e) => e.preventDefault()}
                    >
                        Нет
                    </button>
                </div>
            </div>
        </div>

    );
}

export default App;
