
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Canvas = ({ setCanvas }) => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });
    setFabricCanvas(canvas);
    setCanvas(canvas);

   
    socket.on('drawing', (data) => {
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    return () => {
      socket.disconnect();
      canvas.dispose();
    };
  }, [setCanvas]);

  
  const emitDrawing = () => {
    if (fabricCanvas) {
      const drawingData = JSON.stringify(fabricCanvas);
      socket.emit('drawing', drawingData);
    }
  };

  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.on('object:added', emitDrawing);
      fabricCanvas.on('object:modified', emitDrawing);
      fabricCanvas.on('object:removed', emitDrawing);
    }
  }, [fabricCanvas]);

  return (
    <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }} />
  );
};

export default Canvas;
