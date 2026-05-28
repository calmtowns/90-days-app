"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    addNote(newTitle.trim() || "Untitled", newContent.trim());
    setNewTitle("");
    setNewContent("");
    setShowAdd(false);
  };

  const startEdit = (note: typeof notes[0]) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateNote(editingId, editTitle.trim() || "Untitled", editContent.trim());
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-dark-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center pt-14 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-brown-700 dark:text-beige-100">Notes</h1>
            <p className="text-sm text-brown-400 dark:text-beige-400">{notes.length} notes</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-12 h-12 bg-brown-500 rounded-2xl flex items-center justify-center shadow-warm-md active:scale-95 transition-transform"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-dark-100 rounded-3xl p-4 mb-4 shadow-warm-md border border-beige-200/50 dark:border-white/5"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note title..."
                autoFocus
                className="w-full bg-transparent text-base font-semibold text-brown-700 dark:text-beige-100 placeholder-beige-300 dark:placeholder-dark-50 outline-none mb-2"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows={4}
                className="w-full bg-transparent text-sm text-brown-600 dark:text-beige-300 placeholder-beige-300 dark:placeholder-dark-50 outline-none resize-none"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-brown-400 rounded-xl hover:bg-beige-100 dark:hover:bg-dark-50">
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newTitle.trim() && !newContent.trim()}
                  className="px-4 py-2 text-sm bg-brown-500 text-white rounded-xl disabled:opacity-50 font-medium"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {notes.length === 0 && !showAdd ? (
          <EmptyState
            emoji="📝"
            title="No notes yet"
            description="Capture your thoughts, ideas and reflections here."
            action={
              <button onClick={() => setShowAdd(true)} className="bg-brown-500 text-white font-semibold px-6 py-3 rounded-2xl text-sm">
                Write a note
              </button>
            }
          />
        ) : (
          <div className="space-y-3 pb-4">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-3xl p-4 shadow-warm-sm border border-beige-200/50 dark:border-white/5"
                  style={{ backgroundColor: note.color }}
                >
                  {editingId === note.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-transparent text-base font-semibold text-brown-700 outline-none mb-1"
                        autoFocus
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full bg-transparent text-sm text-brown-600 outline-none resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingId(null)} className="text-xs text-brown-400 px-3 py-1 rounded-xl hover:bg-black/5 flex items-center gap-1">
                          <X size={12} /> Cancel
                        </button>
                        <button onClick={handleSaveEdit} className="text-xs bg-brown-500 text-white px-3 py-1 rounded-xl font-medium flex items-center gap-1">
                          <Check size={12} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-semibold text-brown-700 flex-1 pr-2">{note.title}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(note)} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                            <Edit3 size={13} className="text-brown-400" />
                          </button>
                          <button onClick={() => deleteNote(note.id)} className="p-1 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={13} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-xs text-brown-600/80 whitespace-pre-wrap leading-relaxed mb-2">{note.content}</p>
                      )}
                      <p className="text-[10px] text-brown-400/60">{formatDate(note.updatedAt.slice(0, 10))}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
