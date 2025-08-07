"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Camera, Mic, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuickActionButtonProps {
  mode: 'none' | 'add' | 'photo' | 'voice';
  onModeChange: (mode: 'none' | 'add' | 'photo' | 'voice') => void;
  onAddQuest: () => void;
  onPhotoCapture: () => void;
  onVoiceNote: () => void;
}

export function QuickActionButton({
  mode,
  onModeChange,
  onAddQuest,
  onPhotoCapture,
  onVoiceNote
}: QuickActionButtonProps) {
  const isExpanded = mode !== 'none';

  const actions = [
    {
      id: 'add',
      icon: Plus,
      label: 'Add Quest',
      color: 'from-purple-500 to-blue-500',
      action: onAddQuest,
    },
    {
      id: 'photo',
      icon: Camera,
      label: 'Photo Quest',
      color: 'from-green-500 to-teal-500',
      action: onPhotoCapture,
    },
    {
      id: 'voice',
      icon: Mic,
      label: 'Voice Note',
      color: 'from-orange-500 to-red-500',
      action: onVoiceNote,
    },
  ];

  const toggleExpanded = () => {
    onModeChange(isExpanded ? 'none' : 'add');
  };

  const handleActionClick = (actionId: string, action: () => void) => {
    action();
    onModeChange('none');
  };

  return (
    <div className="relative">
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => onModeChange('none')}
          />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-16 right-0 space-y-3 z-50"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 10 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    className="bg-gray-900/90 backdrop-blur px-3 py-2 rounded-full border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      {action.label}
                    </span>
                  </motion.div>
                  
                  <motion.button
                    onClick={() => handleActionClick(action.id, action.action)}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleExpanded}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 relative ${
          isExpanded 
            ? 'bg-gradient-to-r from-red-500 to-pink-500' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? -45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </motion.div>

        {/* Pulse effect */}
        {!isExpanded && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}