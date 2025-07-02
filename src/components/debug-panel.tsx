
'use client';

import { useState, useEffect } from 'react';
import { isWasmInitialized, wasmApi } from '@/lib/wasm-bridge';
import useCanvasState from '@/states/canvasStates';
import { arrayToRgbaString } from '@/lib/utils';

export function DebugPanel() {
  const [wasmStatus, setWasmStatus] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [wasmModuleExists, setWasmModuleExists] = useState(false);
  const [canvasContext, setCanvasContext] = useState<string>('none');
  const [testResults, setTestResults] = useState<string[]>([]);
  const { showGrid, gridSize, bgColor } = useCanvasState();

  useEffect(() => {
    const updateStatus = () => {
      setWasmStatus(isWasmInitialized());
      setWasmModuleExists(!!(window as any).VectorMateModule);
      
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setCanvasSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
        
        const ctx2d = canvas.getContext('2d');
        const ctxWebgl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (ctx2d) setCanvasContext('2D');
        else if (ctxWebgl) setCanvasContext('WebGL');
        else setCanvasContext('none');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDebugDraw = () => {
    console.log('Debug draw button clicked');
    const results = [];
    
    try {
      if (wasmApi.debugDraw) {
        wasmApi.debugDraw();
        results.push('✓ Debug draw called successfully');
      } else {
        results.push('✗ Debug draw function not available');
      }
    } catch (error) {
      results.push(`✗ Debug draw error: ${error}`);
    }
    
    setTestResults(results);
  };

  const handleTestWasm = () => {
    console.log('WASM test button clicked');
    const results = [];
    
    const module = (window as any).VectorMateModule;
    if (module) {
      results.push('✓ VectorMateModule is loaded');
    } else {
      results.push('✗ VectorMateModule not found');
    }
    
    if (isWasmInitialized()) {
      results.push('✓ WASM is initialized');
    } else {
      results.push('✗ WASM not initialized');
    }
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      results.push(`✓ Canvas found: ${canvas.width}x${canvas.height}`);
      results.push(`Canvas ID: ${canvas.id}`);
    } else {
      results.push('✗ Canvas not found');
    }
    
    try {
      wasmApi.setCanvasBackground(255, 0, 0, 255); // Red background
      results.push('✓ setCanvasBackground called');
    } catch (error) {
      results.push(`✗ setCanvasBackground error: ${error}`);
    }
    
    setTestResults(results);
  };

  const handleTestCanvas = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(10, 10, 100, 100);
        ctx.fillStyle = '#000000';
        ctx.font = '16px Arial';
        ctx.fillText('Test Draw', 20, 40);
        console.log('Manual test draw completed');
      }
    }
  };

  return (
    <div className="fixed top-16 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-sm font-mono max-w-xs">
      <div className="mb-2 font-bold">Debug Panel</div>
      <div className="space-y-1">
        <div>WASM Module: <span className={wasmModuleExists ? 'text-green-400' : 'text-red-400'}>
          {wasmModuleExists ? 'Loaded' : 'Not found'}
        </span></div>
        <div>WASM Init: <span className={wasmStatus ? 'text-green-400' : 'text-red-400'}>
          {wasmStatus ? 'Yes' : 'No'}
        </span></div>
        <div>Canvas: {canvasSize.width}×{canvasSize.height}</div>
        <div>Context: <span className={canvasContext === '2D' ? 'text-blue-400' : canvasContext === 'WebGL' ? 'text-green-400' : 'text-red-400'}>
          {canvasContext}
        </span></div>
        
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="font-bold mb-1">Canvas State (Zustand)</div>
          <div>Grid: <span className={showGrid ? 'text-green-400' : 'text-red-400'}>{showGrid ? 'On' : 'Off'}</span></div>
          <div>Grid Size: {gridSize}px</div>
          <div>Background: {arrayToRgbaString(bgColor)}</div>
        </div>
        
        <div className="mt-2 space-y-1">
          <button 
            onClick={handleDebugDraw}
            className="block w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            Trigger Draw
          </button>
          <button 
            onClick={handleTestWasm}
            className="block w-full px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
          >
            Test WASM
          </button>
          <button 
            onClick={handleTestCanvas}
            className="block w-full px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
          >
            Test Canvas
          </button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          Controls:<br/>
          • Arrow keys: Move rectangle<br/>
          • G: Toggle grid<br/>
          • Spacebar: Change color<br/>
          • Click: Select rectangle
        </div>
        <div className="text-xs text-yellow-400 mt-2">
          {!wasmModuleExists && "WASM not loaded - check console"}
          {wasmModuleExists && !wasmStatus && "WASM loaded but not initialized"}
          {wasmStatus && "SDL2 WASM active"}
        </div>
        
        <div className="mt-2 text-xs">
          Test Results:
          <div className="bg-gray-800 p-2 rounded max-h-40 overflow-y-auto custom-scrollbar">
            {testResults.length === 0 && "No tests run yet."}
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start">
                <span className={result.startsWith('✓') ? 'text-green-400 mr-1' : 'text-red-400 mr-1'}>
                  {result.startsWith('✓') ? '✓' : '✗'}
                </span>
                <span className="whitespace-pre-wrap">{result.substring(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
