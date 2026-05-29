"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

const NOTE_COLORS = [
  'rgba(139,92,246,0.12)', 'rgba(16,185,129,0.10)', 'rgba(59,130,246,0.10)',
  'rgba(245,158,11,0.10)', 'rgba(239,68,68,0.10)',
];
const NOTE_BORDERS = [
  'rgba(139,92,246,0.25)', 'rgba(16,185,129,0.20)', 'rgba(59,130,246,0.20)',
  'rgba(245,158,11,0.20)', 'rgba(239,68,68,0.20)',
];

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useAppStore();
  const [newContent, setNewContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  return (
    <div className="ambient-bg min-h-dvh pb-28">
      <div className="px-5 pt-14">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-semibold text-white/90">Notes</h1>
          <p className="text-sm text-white/30 mt-1">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
        </motion.div>

        {/* Add note */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-4 mb-5">
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={3}
            placeholder="Write something..." className="glass-input w-full rounded-2xl px-4 py-3 text-sm resize-none" />
          <div className="flex justify-end mt-3">
            <button onClick={() => { if (newContent.trim()) { addNote(newContent.trim()); setNewContent(''); } }}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' }}>Save</button>
          </div>
        </motion.div>

        {/* Notes list */}
        <div className="space-y-3">
          <AnimatePresence>
            {notes.map((note, i) => {
              const colorIdx = i % NOTE_COLORS.length;
              const isEditing = editId === note.id;
              return (
                <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                  className="rounded-3xl p-5" style={{ background: NOTE_COLORS[colorIdx], border: `1px solid ${NOTE_BORDERS[colorIdx]}` }}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} autoFocus
                        className="glass-input w-full rounded-2xl px-3 py-2 text-sm resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => { updateNote(note.id, editContent); setEditId(null); }}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: 'rgba(16,185,129,0.3)', border: '1px solid rgba(16,185,129,0.3)' }}>Save</button>
                        <button onClick={() => setEditId(null)} className="flex-1 py-2 rounded-xl text-xs text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-white/25">{format(new Date(note.createdAt), 'MMM d, HH:mm')}</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditId(note.id); setEditContent(note.content); }} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>Edit</button>
                          <button onClick={() => deleteNote(note.id)} className="text-xs text-red-400/50 hover:text-red-400 transition-colors px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)' }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {notes.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <p className="text-4xl mb-3 animate-float-slow">◈</p>
              <p className="text-white/40 text-sm">No notes yet</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
