import React, { useState, useEffect } from 'react';
import ComponentLibrary from './components/ComponentLibrary';
import WorkArea from './components/WorkArea';
import PropertyPanel from './components/PropertyPanel';

export interface ComponentType {
  id: string;
  type: string;
  position: { x: number; y: number };
}

interface Workspace {
  id: string;
  name: string;
  components: ComponentType[];
  lastModified: Date;
}

const App: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [isOverview, setIsOverview] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const saveWorkspaces = () => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
    alert('所有工作区已保存');
  };

  const loadWorkspaces = () => {
    const savedWorkspaces = localStorage.getItem('workspaces');
    if (savedWorkspaces) {
      const loadedWorkspaces = JSON.parse(savedWorkspaces);
      setWorkspaces(loadedWorkspaces.map((w: Workspace) => ({
        ...w,
        lastModified: new Date(w.lastModified)
      })));
    }
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      components: [],
      lastModified: new Date()
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  const openWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOverview(false);
  };

  const closeWorkspace = () => {
    setCurrentWorkspace(null);
    setSelectedComponent(null);
    setIsOverview(true);
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces(workspaces.filter(w => w.id !== id));
  };

  const addComponent = (type: string, position: { x: number; y: number }) => {
    if (!currentWorkspace) return;
    const newComponent: ComponentType = {
      id: Date.now().toString(),
      type,
      position,
    };
    const updatedWorkspace = {
      ...currentWorkspace,
      components: [...currentWorkspace.components, newComponent],
      lastModified: new Date()
    };
    updateCurrentWorkspace(updatedWorkspace);
  };

  const updateComponentPosition = (id: string, position: { x: number; y: number }) => {
    if (!currentWorkspace) return;
    const updatedComponents = currentWorkspace.components.map(comp => 
      comp.id === id ? { ...comp, position } : comp
    );
    const updatedWorkspace = {
      ...currentWorkspace,
      components: updatedComponents,
      lastModified: new Date()
    };
    updateCurrentWorkspace(updatedWorkspace);
  };

  const updateCurrentWorkspace = (updatedWorkspace: Workspace) => {
    setCurrentWorkspace(updatedWorkspace);
    setWorkspaces(workspaces.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w));
  };

  const handleSelectComponent = (component: ComponentType) => {
    setSelectedComponent(component);
  };

  const renderOverview = () => (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {workspaces.map(workspace => (
        <div key={workspace.id} className="bg-white p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2">{workspace.name}</h3>
          <p className="text-sm text-gray-500 mb-2">
            组件数量: {workspace.components.length}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            最后修改: {workspace.lastModified.toLocaleString()}
          </p>
          <div className="flex justify-between">
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => openWorkspace(workspace)}
            >
              打开
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteWorkspace(workspace.id)}
            >
              删除
            </button>
          </div>
        </div>
      ))}
      <div className="bg-gray-100 p-4 rounded shadow-md flex items-center justify-center">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            const name = prompt('请输入新工作区名称');
            if (name) createWorkspace(name);
          }}
        >
          新建工作区
        </button>
      </div>
    </div>
  );

  const renderWorkspace = () => (
    <div className="flex flex-1">
      <ComponentLibrary />
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-200 p-2 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="mr-4 text-blue-500 hover:text-blue-700"
              onClick={closeWorkspace}
            >
              ← 返回
            </button>
            <div>当前工作区: {currentWorkspace?.name}</div>
          </div>
          <div className="text-gray-600">
            组件数量: {currentWorkspace?.components.length || 0}
          </div>
        </div>
        <WorkArea 
          components={currentWorkspace?.components || []}
          onDrop={addComponent}
          onDragComponent={updateComponentPosition}
          onSelectComponent={handleSelectComponent}
        />
      </div>
      <PropertyPanel selectedComponent={selectedComponent} />
    </div>
  );

  return (
    <div className="flex h-screen">
      {isOverview ? renderOverview() : renderWorkspace()}
    </div>
  );
};

export default App;