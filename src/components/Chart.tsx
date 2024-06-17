//Component for generating a map of coordinates

import { useEffect, useRef, useState } from "react";

export type MapLocation = {
  id: string;
  description: string;
  x: number;
  y: number;
  z: number;
  image?: string;
  visited: boolean;
};

export type MapConnection = {
  start: MapLocation;
  end: MapLocation;
};

export type MapNode = MapLocation & {
  connections?: MapNode[];
};

import Spinner from "./Spinner";

const ZoomablePannableCanvas = ({
  initMap,
  onSelect,
}: {
  initMap: MapNode[];
  onSelect: (feature: MapNode) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mouseClick, setMouseClick] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [generating, setGenerating] = useState(false);
  const [features, setFeatures] = useState<MapNode[]>(initMap);

  const mapScale = 5;

  const drawMap = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply zoom and pan transformations
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      // Draw your content here
      drawFeatures();

      ctx.restore();
    }
  };

  const drawFeatures = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      //draw all features
      features.forEach((feature) => {
        const x = feature.x;
        const y = feature.y;
        const fontSize = 10 / scale;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = feature.visited ? "blue" : "gray";
        ctx.textAlign = "center";
        ctx.fillText(
          feature.description,
          x * mapScale,
          y * mapScale - 2 / scale
        );
        ctx.beginPath();
        // Define the circle
        ctx.arc(x * mapScale, y * mapScale + 2, 5 / scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        feature.connections?.forEach((connection) => {
          //draw a line to the connection
          ctx.beginPath();
          ctx.moveTo(x * mapScale, y * mapScale + 2);
          ctx.lineTo(connection.x * mapScale, connection.y * mapScale + 2);
          //scale strokewidth
          ctx.lineWidth = 1 / scale;
          //set stroke colour
          ctx.strokeStyle = "gray";
          ctx.stroke();
          ctx.closePath();
        });
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) drawMap();

    const handleClick = (mouseX: number, mouseY: number) => {
      if (!mouseClick) return;
      setMouseClick(null);
      const canvas = canvasRef.current;
      if (canvas) {
        const clickedFeature = features.find((feature) => {
          const x = feature.x;
          const y = feature.y;
          const distance = Math.sqrt(
            (x * mapScale - mouseX) ** 2 + (y * mapScale - mouseY) ** 2
          );
          if (distance < 20 / scale) console.log(feature.description);
          return distance <= 20 / scale;
        });

        if (clickedFeature) {
          onFeatureClick(clickedFeature);
        } else {
        }
      }
    };

    const addFeatures = (newFeatures: MapNode[]) => {
      if (newFeatures.length === 0) return;
      // Use the spread operator to create a new array with the new item
      setFeatures((prevItems) => [...prevItems, ...newFeatures]);
    };

    async function onFeatureClick(feature: MapNode) {
      onSelect(feature);
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const mouseX = event.clientX - canvas!.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas!.getBoundingClientRect().top;
      const newScale = scale * delta;
      const newOffset = {
        x: offset.x + (mouseX - offset.x) * (1 - delta),
        y: offset.y + (mouseY - offset.y) * (1 - delta),
      };
      setScale(newScale);
      setOffset(newOffset);
    };

    const handleMouseDown = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setMouseClick({
          x: (event.clientX - rect.left - offset.x) / scale,
          y: (event.clientY - rect.top - offset.y) / scale,
        });
      }
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMouseClick(null);
      if (isDragging) {
        const newOffset = {
          x: offset.x + (event.clientX - dragStart.x),
          y: offset.y + (event.clientY - dragStart.y),
        };
        setOffset(newOffset);
        setDragStart({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      if (mouseClick) {
        console.log("handling click");
        handleClick(mouseClick.x, mouseClick.y);
      }
      setIsDragging(false);
    };

    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleMouseUp);
      }
    };
  }, [scale, offset, mapScale, isDragging, dragStart, generating, mouseClick]);

  useEffect(() => {
    if (initMap.length > 0) {
      setFeatures(initMap);
      drawMap();
    }
  }, [initMap]);

  return (
    <div className="relative flex flex-col items-center justify-center rounded-lg border border-black overflow-hidden">
      <h1>Map</h1>
      <canvas ref={canvasRef} width={1024} height={1024} />
      {generating && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ZoomablePannableCanvas;
