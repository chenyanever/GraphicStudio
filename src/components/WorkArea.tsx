import React from 'react';
import { ComponentType } from '../App';

interface WorkAreaProps {
  components: ComponentType[];
  onDrop: (type: string, position: { x: number; y: number }) => void;
  onDragComponent: (id: string, position: { x: number; y: number }) => void;
  onSelectComponent: (component: ComponentType) => void;
}

const WorkArea: React.FC<WorkAreaProps> = ({ components, onDrop, onDragComponent, onSelectComponent }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataString = e.dataTransfer.getData('text/plain');

    if (!dataString) {
      console.error('No data received in drop event');
      return;
    }

    let data;
    try {
      data = JSON.parse(dataString);
    } catch (error) {
      console.error('Failed to parse drop data:', error);
      return;
    }

    if (!data || typeof data !== 'object') {
      console.error('Invalid data format in drop event');
      return;
    }

    const workAreaRect = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - workAreaRect.left - (data.offsetX || 0),
      y: e.clientY - workAreaRect.top - (data.offsetY || 0)
    };

    if (data.id && typeof data.id === 'string') {
      // 移动现有组件
      onDragComponent(data.id, newPosition);
    } else if (data.type && typeof data.type === 'string') {
      // 创建新组件
      onDrop(data.type, newPosition);
    } else {
      console.error('Invalid component data:', data);
    }
  };
  
  return (
    <div 
      className="flex-grow bg-white relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {components.map((component) => (
        <DraggableComponent
          key={component.id}
          component={component}
          onDrag={onDragComponent}
          onSelect={() => onSelectComponent(component)}
        />
      ))}
    </div>
  );
};

interface DraggableComponentProps {
  component: ComponentType;
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onSelect: (component: ComponentType) => void; // 确保这里接受一个 ComponentType 参数
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, onDrag, onSelect }) => {
  const handleDragStart = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const data = JSON.stringify({
      id: component.id,
      type: component.type,
      offsetX,
      offsetY
    });
    e.dataTransfer.setData('text/plain', data);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); // 防止默认行为
  };

  return (
    <div
      className="absolute bg-blue-500 text-white p-4 rounded-lg shadow-md cursor-move hover:bg-blue-600 transition-colors duration-200 min-w-[120px] min-h-[80px] flex items-center justify-center"
      style={{ 
        left: component.position.x, 
        top: component.position.y,
        fontSize: '16px',
        fontWeight: 'bold'
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onClick={() => onSelect(component)}
    >
      {component.type}
    </div>
  );
};

export default WorkArea;