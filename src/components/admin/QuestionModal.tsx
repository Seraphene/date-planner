"use client";

import { useState, useEffect } from "react";
import { Question, QuestionType, QuestionOption } from "@/lib/types";
import { SoftButton } from "@/components/ui/SoftButton";
import { SoftInput } from "@/components/ui/SoftInput";
import { X, Plus, Trash2 } from "lucide-react";

interface QuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (question: Omit<Question, "id"> & { id?: string }) => Promise<void>;
    question?: Question | null;
}

const DEFAULT_QUESTION: Omit<Question, "id"> = {
    order: 1,
    text: "",
    type: "text",
    placeholder: "",
    options: [],
};

export function QuestionModal({ isOpen, onClose, onSave, question }: QuestionModalProps) {
    const [formData, setFormData] = useState<Omit<Question, "id">>(DEFAULT_QUESTION);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (question) {
            setFormData({
                order: question.order,
                text: question.text,
                type: question.type,
                placeholder: question.placeholder || "",
                options: question.options || [],
            });
        } else {
            setFormData(DEFAULT_QUESTION);
        }
    }, [question, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...formData, id: question?.id });
            onClose();
        } catch (error) {
            console.error("Failed to save question", error);
        } finally {
            setLoading(false);
        }
    };

    const addOption = () => {
        const newOption: QuestionOption = {
            id: crypto.randomUUID(),
            label: "",
            value: "",
            imageUrl: "",
        };
        setFormData({ ...formData, options: [...(formData.options || []), newOption] });
    };

    const removeOption = (id: string) => {
        setFormData({
            ...formData,
            options: formData.options?.filter((opt) => opt.id !== id),
        });
    };

    const updateOption = (id: string, field: keyof QuestionOption, value: string) => {
        setFormData({
            ...formData,
            options: formData.options?.map((opt) =>
                opt.id === id ? { ...opt, [field]: value } : opt
            ),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {question ? "Edit Question" : "Add New Question"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="question-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <label className="block text-sm font-medium mb-1">Question Text</label>
                                <SoftInput
                                    required
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    placeholder="e.g., Where should we go?"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <SoftInput
                                    type="number"
                                    required
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
                            >
                                <option value="text">Text Input</option>
                                <option value="binary">Binary Choice (Image Cards)</option>
                                <option value="selection">Multiple Selection</option>
                            </select>
                        </div>

                        {formData.type === "text" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Placeholder</label>
                                <SoftInput
                                    value={formData.placeholder}
                                    onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                                    placeholder="e.g., Type your answer here..."
                                />
                            </div>
                        )}

                        {(formData.type === "binary" || formData.type === "selection") && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium">Options</label>
                                    <SoftButton
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={addOption}
                                        className="text-xs py-1 h-8"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add Option
                                    </SoftButton>
                                </div>
                                <div className="space-y-3">
                                    {formData.options?.map((opt, index) => (
                                        <div key={opt.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                                <SoftInput
                                                    placeholder="Label (e.g., Italian)"
                                                    value={opt.label}
                                                    onChange={(e) => updateOption(opt.id, "label", e.target.value)}
                                                    className="h-10 text-sm"
                                                />
                                                <SoftInput
                                                    placeholder="Value (e.g., italian)"
                                                    value={opt.value}
                                                    onChange={(e) => updateOption(opt.id, "value", e.target.value)}
                                                    className="h-10 text-sm"
                                                />
                                                {formData.type === "binary" && (
                                                    <div className="sm:col-span-2">
                                                        <SoftInput
                                                            placeholder="Image URL (http...)"
                                                            value={opt.imageUrl || ""}
                                                            onChange={(e) => updateOption(opt.id, "imageUrl", e.target.value)}
                                                            className="h-10 text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeOption(opt.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.options?.length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-2">
                                            No options added yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <SoftButton type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </SoftButton>
                    <SoftButton type="submit" form="question-form" disabled={loading}>
                        {loading ? "Saving..." : "Save Question"}
                    </SoftButton>
                </div>
            </div>
        </div>
    );
}
