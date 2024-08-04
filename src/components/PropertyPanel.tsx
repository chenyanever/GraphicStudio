import React from 'react';
import { ComponentType } from '../App';

interface PropertyPanelProps {
  selectedComponent: ComponentType | null;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedComponent }) => {
  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">属性面板</h2>
      {selectedComponent ? (
        <div className="space-y-2">
          <p><span className="font-semibold">ID:</span> {selectedComponent.id}</p>
          <p><span className="font-semibold">类型:</span> {selectedComponent.type}</p>
          <p><span className="font-semibold">位置:</span> X: {selectedComponent.position.x}, Y: {selectedComponent.position.y}</p>
        </div>
      ) : (
        <p>未选择组件</p>
      )}
    </div>
  );
};

export default PropertyPanel;