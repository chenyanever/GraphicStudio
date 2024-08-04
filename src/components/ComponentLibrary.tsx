import React from 'react';

interface ComponentLibraryProps {
  // 如果需要的话，可以添加属性
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = () => {
  const componentTypes = ['输入组件', '处理组件', '输出组件'];

  const onDragStart = (componentType: string) => (e: React.DragEvent) => {
    const data = JSON.stringify({ type: componentType });
    e.dataTransfer.setData('text/plain', data);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">组件库</h2>
      <div className="space-y-2">
        {componentTypes.map((type) => (
          <div
            key={type}
            className="bg-blue-500 text-white p-2 rounded cursor-move hover:bg-blue-600 transition-colors duration-200"
            draggable
            onDragStart={onDragStart(type)}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;