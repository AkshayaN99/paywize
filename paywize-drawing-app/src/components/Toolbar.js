
import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const Toolbar = ({ canvas }) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    if (canvas) {
      const saveState = () => {
        const state = canvas.toJSON();
        setUndoStack([...undoStack, state]);
        setRedoStack([]); // Clear redo stack on new action
      };

      canvas.on('object:added', saveState);
      canvas.on('object:modified', saveState);
      canvas.on('object:removed', saveState);

      return () => {
        canvas.off('object:added', saveState);
        canvas.off('object:modified', saveState);
        canvas.off('object:removed', saveState);
      };
    }
  }, [canvas, undoStack, redoStack]);

  const undo = () => {
    if (canvas && undoStack.length > 0) {
      const currentState = canvas.toJSON();
      setRedoStack([...redoStack, currentState]);

      const lastState = undoStack.pop();
      setUndoStack([...undoStack]);
      canvas.loadFromJSON(lastState, () => {
        canvas.renderAll();
      });
    }
  };

  const redo = () => {
    if (canvas && redoStack.length > 0) {
      const currentState = canvas.toJSON();
      setUndoStack([...undoStack, currentState]);

      const nextState = redoStack.pop();
      setRedoStack([...redoStack]);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    }
  };

  const changeBrushColor = (color) => {
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const changeBrushSize = (size) => {
    if (canvas) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  const switchToEraser = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
    }
  };

  const drawRectangle = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 60,
      height: 70,
    });
    canvas.add(rect);
  };

  return (
    <div>
      <button onClick={() => changeBrushColor('red')}>Red</button>
      <button onClick={() => changeBrushColor('blue')}>Blue</button>
      <button onClick={() => changeBrushSize(10)}>Brush Size: 10</button>
      <button onClick={switchToEraser}>Eraser</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={drawRectangle}>Rectangle</button>
    </div>
  );
};

export default Toolbar;
