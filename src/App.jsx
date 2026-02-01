import { useEffect, useRef } from "react";
import "./App.css";

function App() {
    const noBtnRef = useRef(null);
    const velocity = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const btn = noBtnRef.current;
        if (!btn) return;

        // стартовая позиция
        btn.style.left = "50%";
        btn.style.top = "60%";

        const EDGE_MARGIN = 20;
        const ESCAPE_FORCE = 8;

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = cx - e.clientX;
            const dy = cy - e.clientY;

            const distance = Math.hypot(dx, dy) || 1;
            const radius = 240;

            if (distance < radius) {
                const force = (radius - distance) / radius;

                velocity.current.x += (dx / distance) * force * 6;
                velocity.current.y += (dy / distance) * force * 6;

                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                // анти-зажим у стен
                if (rect.left < EDGE_MARGIN) velocity.current.x += ESCAPE_FORCE;
                if (rect.left > maxX - EDGE_MARGIN) velocity.current.x -= ESCAPE_FORCE;
                if (rect.top < EDGE_MARGIN) velocity.current.y += ESCAPE_FORCE;
                if (rect.top > maxY - EDGE_MARGIN) velocity.current.y -= ESCAPE_FORCE;

                // небольшая случайность
                velocity.current.x += (Math.random() - 0.5) * 1.2;
                velocity.current.y += (Math.random() - 0.5) * 1.2;
            }
        };

        const handleTouch = (e) => {
            const touch = e.touches[0];
            if (!touch) return;

            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = cx - touch.clientX;
            const dy = cy - touch.clientY;

            const distance = Math.hypot(dx, dy) || 1;
            const TAP_FORCE = 20;

            velocity.current.x += (dx / distance) * TAP_FORCE;
            velocity.current.y += (dy / distance) * TAP_FORCE;

            velocity.current.x += (Math.random() - 0.5) * 6;
            velocity.current.y += (Math.random() - 0.5) * 6;
        };

        const animate = () => {
            const maxX = window.innerWidth - btn.offsetWidth;
            const maxY = window.innerHeight - btn.offsetHeight;

            let x = btn.offsetLeft + velocity.current.x;
            let y = btn.offsetTop + velocity.current.y;

            const bounce = 0.95;

            // отскоки от стен
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

            // трение
            velocity.current.x *= 0.92;
            velocity.current.y *= 0.92;

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
        <div className="container">
            <h1>Ты будешь моей валентинкой? 💘</h1>

            <div className="buttons">
                <button
                    className="yes"
                    onClick={() => alert("💖 УРААА! Я знал(а)!")}
                >
                    Да 💕
                </button>

                <button
                    className="no"
                    ref={noBtnRef}
                    onClick={(e) => e.preventDefault()}
                >
                    Нет 💔
                </button>
            </div>
        </div>
    );
}

export default App;
