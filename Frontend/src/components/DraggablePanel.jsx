import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const DraggablePanel = ({ isVisible, children, maxHeight = "70%" }) => {
  const panelRef = useRef(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const [collapsed, setCollapsed] = useState(!isVisible);
  const dragging = useRef(false);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      transform: isVisible ? "translateY(0%)" : "translateY(calc(100% - 40px))",
      duration: 0.5,
      ease: "power2.out",
    });
    setCollapsed(!isVisible);
  }, [isVisible]);

  const onDragStart = (e) => {
    dragging.current = true;
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    gsap.killTweensOf(panelRef.current);
  };

  const onDragMove = (e) => {
    if (!dragging.current) return;
    dragCurrentY.current = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = dragCurrentY.current - dragStartY.current;
    if (panelRef.current && diff > 0) {
      panelRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const diff = dragCurrentY.current - dragStartY.current;
    if (!panelRef.current) return;

    if (diff > 100) {
      gsap.to(panelRef.current, { transform: "translateY(calc(100% - 40px))", duration: 0.3 });
      setCollapsed(true);
    } else {
      gsap.to(panelRef.current, { transform: "translateY(0%)", duration: 0.3 });
      setCollapsed(false);
    }
  };

  const onReopen = () => {
    gsap.to(panelRef.current, { transform: "translateY(0%)", duration: 0.3 });
    setCollapsed(false);
  };

  return (
    <div
      ref={panelRef}
      className="fixed left-0 right-0 bottom-0 z-30 bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.15)] p-5"
      style={{
        transform: "translateY(calc(100% - 40px))",
        maxHeight: maxHeight,
      }}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}>
      {/* Drag handle */}
      <div
        className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 cursor-pointer"
        onClick={collapsed ? onReopen : null}
      />
      {children}
    </div>
  );
};

export default DraggablePanel;