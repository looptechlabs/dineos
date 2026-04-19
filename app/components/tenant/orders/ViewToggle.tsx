// ============================================================================
// DineOS - POS View Toggle
// ============================================================================
// Top navigation tabs for switching between POS views
// ============================================================================

'use client';

import React from 'react';
import { Plus, QrCode, FileText, UtensilsCrossed } from 'lucide-react';

export type POSView = 'pos' | 'qr-orders' | 'drafts' | 'table-orders';

interface ViewToggleProps {
    currentView: POSView;
    onViewChange: (view: POSView) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    const tabs = [
        { id: 'qr-orders' as POSView, label: 'QR Menu Orders', icon: QrCode },
        { id: 'drafts' as POSView, label: 'Draft List', icon: FileText },
        { id: 'table-orders' as POSView, label: 'Table Order', icon: UtensilsCrossed },
    ];

    return (
        <div className="flex items-center gap-2">
            {/* New Order button */}
            <button
                onClick={() => onViewChange('pos')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === 'pos'
                        ? 'bg-[#F97316] text-white shadow-md'
                        : 'bg-[#F97316] text-white hover:bg-[#EA580C]'
                    }`}
            >
                <Plus className="w-4 h-4" />
                <span>New</span>
            </button>

            {/* Other view tabs */}
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onViewChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === tab.id
                                ? 'bg-zinc-800 text-white'
                                : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
