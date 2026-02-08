'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useUIStore } from '@/store/useUIStore';
import { SKILL_DEFS } from '@/lib/game-logic/skillSystem';
import Modal from '@/components/Shared/Modal';

export default function TodosPage() {
  const todos = useGameStore(s => s.todos);
  const addTodo = useGameStore(s => s.addTodo);
  const removeTodo = useGameStore(s => s.removeTodo);
  const toggleTodo = useGameStore(s => s.toggleTodo);
  const resetTodosIfNeeded = useGameStore(s => s.resetTodosIfNeeded);
  const editMode = useUIStore(s => s.editMode);
  const toggleEditMode = useUIStore(s => s.toggleEditMode);

  const [showAddSheet, setShowAddSheet] = useState(false);

  // Reset todos if it's a new day
  resetTodosIfNeeded();

  const completed = todos.items.filter(t => t.completed).length;
  const total = todos.items.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold">Today's Tasks</h1>
          <p className="text-text-secondary text-sm">
            {total > 0 ? `${completed}/${total} completed` : 'No tasks yet'}
          </p>
        </div>
        <div className="flex gap-2">
          {total > 0 && (
            <button
              onClick={toggleEditMode}
              className="px-3 py-1.5 rounded-lg text-sm border border-border-subtle hover:bg-bg-hover transition-colors"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          )}
          <button
            onClick={() => setShowAddSheet(true)}
            className="px-3 py-1.5 rounded-lg text-sm bg-accent-gold text-bg-primary font-bold hover:brightness-110 transition-all"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-green transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      )}

      {/* Todo list */}
      {total === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-text-secondary">No tasks for today</p>
          <p className="text-text-muted text-sm mt-1">Add actions from your skills to track them here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.items.map((todo, index) => {
            const skillDef = SKILL_DEFS.find(s => s.id === todo.skillId);
            return (
              <div
                key={todo.id}
                className={`flex items-center gap-3 glass rounded-xl px-4 py-3 border transition-all ${
                  todo.completed ? 'border-green-500/30 opacity-60' : 'border-border-subtle'
                }`}
              >
                {editMode ? (
                  <button
                    onClick={() => removeTodo(index)}
                    className="text-red-400 hover:text-red-300 text-lg flex-shrink-0"
                  >
                    ✕
                  </button>
                ) : (
                  <button
                    onClick={() => toggleTodo(index)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed
                        ? 'bg-accent-green border-accent-green text-bg-primary'
                        : 'border-text-muted hover:border-accent-gold'
                    }`}
                  >
                    {todo.completed && '✓'}
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${todo.completed ? 'line-through text-text-muted' : ''}`}>
                    {todo.actionName}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <span>{skillDef?.icon}</span> {skillDef?.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-text-muted text-xs">Tasks reset daily at midnight. Logging a matching action auto-completes it.</p>

      {/* Add Todo Sheet */}
      <Modal isOpen={showAddSheet} onClose={() => setShowAddSheet(false)} title="Add Task" size="lg">
        <div className="space-y-4">
          {SKILL_DEFS.map(def => (
            <div key={def.id}>
              <div className="flex items-center gap-2 mb-2">
                <span>{def.icon}</span>
                <span className="font-bold text-sm" style={{ color: def.color }}>{def.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {def.actions.map(action => {
                  const alreadyAdded = todos.items.some(t => t.skillId === def.id && t.actionId === action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (!alreadyAdded) {
                          addTodo(def.id as any, action.id, action.name);
                        }
                      }}
                      disabled={alreadyAdded}
                      className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                        alreadyAdded
                          ? 'border-green-500/30 bg-green-500/5 opacity-50 cursor-default'
                          : 'border-border-subtle bg-bg-tertiary hover:border-border-medium'
                      }`}
                    >
                      <div className="font-medium truncate">{action.name}</div>
                      <div className="text-xs text-text-muted">{alreadyAdded ? '✓ Added' : `+${action.xp} XP`}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
