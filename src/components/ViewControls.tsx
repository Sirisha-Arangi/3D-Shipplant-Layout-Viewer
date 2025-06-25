import React from 'react';
interface ViewControlsProps {
  activeSystem: string;
  setActiveSystem: (system: string) => void;
}
export const ViewControls: React.FC<ViewControlsProps> = ({
  activeSystem,
  setActiveSystem
}) => {
  const systems = [{
    id: 'all',
    name: 'All Systems',
    color: 'white'
  }, {
    id: 'propulsion',
    name: 'Propulsion',
    color: 'rgb(255, 100, 100)'
  }, {
    id: 'electrical',
    name: 'Electrical',
    color: 'rgb(100, 100, 255)'
  }, {
    id: 'hvac',
    name: 'HVAC',
    color: 'rgb(100, 255, 100)'
  }, {
    id: 'piping',
    name: 'Piping',
    color: 'rgb(255, 100, 255)'
  }, {
    id: 'structural',
    name: 'Structural',
    color: 'rgb(100, 255, 255)'
  }];
  return <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-lg p-2">
      <div className="flex space-x-2">
        {systems.map(system => <button key={system.id} className={`px-3 py-1 rounded text-sm ${activeSystem === system.id ? 'ring-2 ring-white' : ''}`} style={{
        backgroundColor: system.id === 'all' ? '#333' : system.color,
        color: system.id === 'all' ? 'white' : '#111'
      }} onClick={() => setActiveSystem(system.id)}>
            {system.name}
          </button>)}
      </div>
      <div className="mt-2 text-xs text-white text-center">
        Use mouse to rotate | Scroll to zoom | Shift+drag to pan
      </div>
    </div>;
};