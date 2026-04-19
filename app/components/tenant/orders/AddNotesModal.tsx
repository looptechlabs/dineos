// ============================================================================
// DineOS - POS Add Notes Modal
// ============================================================================
// Modal for adding notes to cart items
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (notes: string) => void;
    itemName: string;
    initialNotes?: string;
}

export default function AddNotesModal({ isOpen, onClose, onSave, itemName, initialNotes = '' }: AddNotesModalProps) {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(notes);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-200">
                        <h3 className="text-lg font-semibold text-zinc-900">Add Notes</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <p className="text-sm text-zinc-600 mb-3">
                            Add special instructions for <span className="font-medium text-zinc-800">{itemName}</span>
                        </p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g., No onions, extra spicy, etc."
                            className="w-full h-32 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent resize-none text-sm"
                            autoFocus
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition-colors"
                        >
                            Save Notes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
