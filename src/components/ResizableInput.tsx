import React, { useState, useRef, useCallback } from 'react';
import { Input } from 'antd';
import { HolderOutlined } from '@ant-design/icons';

interface ResizableInputProps {
  value?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  onResize?: (width: number, height: number) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  showResizeHandles?: boolean;
}

export const ResizableInput: React.FC<ResizableInputProps> = ({
  value = '',
  placeholder = '请输入内容',
  width = 200,
  height = 32,
  onResize,
  onValueChange,
  disabled = false,
  style = {},
  className = '',
  showResizeHandles = true,
}) => {
  const [dimensions, setDimensions] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height,
    };
  }, [dimensions]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) {return;}

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    let newWidth = startPosRef.current.width;
    let newHeight = startPosRef.current.height;

    switch (resizeDirection) {
      case 'right':
        newWidth = Math.max(100, startPosRef.current.width + deltaX);
        break;
      case 'bottom':
        newHeight = Math.max(32, startPosRef.current.height + deltaY);
        break;
      case 'bottom-right':
        newWidth = Math.max(100, startPosRef.current.width + deltaX);
        newHeight = Math.max(32, startPosRef.current.height + deltaY);
        break;
    }

    setDimensions({ width: newWidth, height: newHeight });
  }, [isResizing, resizeDirection]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setResizeDirection('');
      onResize?.(dimensions.width, dimensions.height);
    }
  }, [isResizing, dimensions, onResize]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = getCursorStyle();
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, resizeDirection]);

  const getCursorStyle = () => {
    switch (resizeDirection) {
      case 'right':
        return 'ew-resize';
      case 'bottom':
        return 'ns-resize';
      case 'bottom-right':
        return 'nwse-resize';
      default:
        return '';
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: dimensions.width,
        height: dimensions.height,
        ...style,
      }}
    >
      <Input
        value={value}
        placeholder={placeholder}
        onChange={handleValueChange}
        disabled={disabled}
        style={{
          width: '100%',
          height: '100%',
          resize: 'none',
        }}
      />

      {/* 拉伸控制点 */}
      {!disabled && showResizeHandles && (
        <>
          {/* 右侧拉伸点 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: -4,
              transform: 'translateY(-50%)',
              width: 8,
              height: 20,
              cursor: 'ew-resize',
              backgroundColor: '#1890ff',
              borderRadius: 2,
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          >
            <HolderOutlined style={{ fontSize: 8, color: 'white' }} />
          </div>

          {/* 底部拉伸点 */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 20,
              height: 8,
              cursor: 'ns-resize',
              backgroundColor: '#1890ff',
              borderRadius: 2,
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          >
            <HolderOutlined style={{ fontSize: 8, color: 'white', transform: 'rotate(90deg)' }} />
          </div>

          {/* 右下角拉伸点 */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 12,
              height: 12,
              cursor: 'nwse-resize',
              backgroundColor: '#1890ff',
              borderRadius: 2,
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
          >
            <div
              style={{
                width: 6,
                height: 6,
                backgroundColor: 'white',
                borderRadius: 1,
              }}
            />
          </div>
        </>
      )}

      {/* 尺寸显示 */}
      {isResizing && (
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 1000,
          }}
        >
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}
    </div>
  );
};
