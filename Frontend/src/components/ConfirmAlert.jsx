import React from 'react';

const ConfirmAlert = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, isCritical = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-sm p-6 transform transition-all scale-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        {cancelText || 'No, Keep it'}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition-transform active:scale-95 ${isCritical
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {confirmText || 'Yes, Proceed'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAlert;
