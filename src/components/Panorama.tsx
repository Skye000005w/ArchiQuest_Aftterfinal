"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { SelectionArea } from "./SelectImageRegion";

export default function Panorama({
  img,
  onSelect,
  immersive = true,
}: {
  img: string;
  onSelect: (imgUrl: string) => void;
  immersive: boolean;
}) {
  const [fov, setFov] = useState(100);
  const [selection, setSelection] = useState<SelectionArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [finalSelection, setFinalSelection] = useState<SelectionArea | null>(
    null
  );
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleWheel = (deltaY: number) => {
    setFov((prevFov) => {
      let newFov = prevFov + deltaY * 0.05;
      newFov = Math.max(10, Math.min(newFov, 150));
      return newFov;
    });
  };

  const handleMouseDown = (e: any) => {
    if (e.shiftKey) {
      setIsSelecting(true);
      const { offsetX, offsetY } = e.nativeEvent;
      setSelection({ x: offsetX, y: offsetY, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e: any) => {
    if (isSelecting) {
      const { offsetX, offsetY } = e.nativeEvent;
      setSelection((prevSelection) => ({
        ...prevSelection,
        width: offsetX - prevSelection.x,
        height: offsetY - prevSelection.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setFinalSelection(selection);
  };

  useEffect(() => {
    if (isSelecting && selectionBoxRef.current && canvasRef.current) {
      const { x, y, width, height } = selection;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      selectionBoxRef.current.style.left = `${canvasRect.left + x}px`;
      selectionBoxRef.current.style.top = `${canvasRect.top + y}px`;
      selectionBoxRef.current.style.width = `${width}px`;
      selectionBoxRef.current.style.height = `${height}px`;
      selectionBoxRef.current.style.display = "block";
    } else if (selectionBoxRef.current) {
      selectionBoxRef.current.style.display = "none";
    }
  }, [isSelecting, selection]);

  return (
    <>
      <Canvas
        ref={canvasRef}
        onWheel={(e) => handleWheel(e.deltaY)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        tabIndex={0}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Environment files={img} background />
        <OrbitControls
          target={[1, 0, 0]}
          maxPolarAngle={immersive ? Math.PI : Math.PI - Math.PI / 3}
          minPolarAngle={immersive ? 0 : Math.PI / 3}
          minAzimuthAngle={immersive ? -Infinity : -Math.PI}
          maxAzimuthAngle={immersive ? Infinity : 0}
          minZoom={immersive ? 0 : 0.5}
          autoRotate={immersive ? false : true}
          autoRotateSpeed={0.2}
        />
        <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={fov} />
        <SelectionHandler selectionArea={finalSelection} onSelect={onSelect} />
      </Canvas>
      <div
        ref={selectionBoxRef}
        style={{
          position: "absolute",
          border: "2px dashed white",
          pointerEvents: "none",
          display: "none",
        }}
      ></div>
    </>
  );
}

const SelectionHandler = ({
  selectionArea,
  onSelect,
}: {
  selectionArea: SelectionArea | null;
  onSelect: (imgUrl: string) => void;
}) => {
  const { gl } = useThree();

  useEffect(() => {
    if (!selectionArea) return;

    const { x, y, width, height } = selectionArea;
    if (width === 0 || height === 0) {
      console.error("Invalid selection area");
      return;
    }

    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = Math.abs(width);
    offScreenCanvas.height = Math.abs(height);
    const offScreenContext = offScreenCanvas.getContext("2d");
    if (!offScreenContext) return;
    offScreenContext.drawImage(
      gl.domElement,
      selectionArea.x,
      selectionArea.y,
      selectionArea.width,
      selectionArea.height,
      0,
      0,
      Math.abs(selectionArea.width),
      Math.abs(selectionArea.height)
    );
    //call the callback function and provide the image
    onSelect(offScreenCanvas.toDataURL("image/png"));
  }, [selectionArea]);

  return null;
};