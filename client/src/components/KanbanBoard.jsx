import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { ListTodo, Clock, CheckCircle2 } from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', icon: ListTodo, colorClass: 'text-purple-400', bgClass: 'bg-purple-500/10' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Clock, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10' },
  { id: 'DONE', label: 'Done', icon: CheckCircle2, colorClass: 'text-green-400', bgClass: 'bg-green-500/10' },
];

export default function KanbanBoard({ tasks, isAdmin, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div key={column.id} className="flex flex-col bg-apple-surface-tile-1 border border-apple-surface-tile-2 rounded-[24px] p-5 shadow-sm h-full min-h-[500px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-5 px-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${column.bgClass}`}>
                  <column.icon className={`w-4 h-4 ${column.colorClass}`} />
                </div>
                <h3 className="text-[17px] font-semibold text-apple-on-dark tracking-tight">{column.label}</h3>
              </div>
              <span className="px-2.5 py-1 text-[13px] font-medium bg-apple-surface-tile-2 text-apple-body-muted rounded-[8px]">
                {columnTasks.length}
              </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 flex flex-col gap-4 rounded-[16px] transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-apple-surface-tile-2/50 p-2 -mx-2 -my-2' : ''
                  }`}
                >
                  {columnTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? 'z-50' : ''}
                          style={{
                            ...provided.draggableProps.style,
                            // Ensure the dragged item has a solid background and shadow
                            ...(snapshot.isDragging && {
                              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
                              transform: `${provided.draggableProps.style?.transform} scale(1.02)`,
                            }),
                          }}
                        >
                          <TaskCard
                            task={task}
                            isAdmin={isAdmin}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onClick={isAdmin ? onEdit : undefined}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      })}
    </div>
  );
}
