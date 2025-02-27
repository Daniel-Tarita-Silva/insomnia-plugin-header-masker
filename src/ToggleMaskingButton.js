const React = require('react');
const { Eye, EyeOff } = require('lucide-react'); // Install with: npm install lucide-react

function ToggleMaskingButton({ onToggle, masked }) {
    return (
        <button
            onClick={onToggle}
            className="flex items-center disabled:opacity-50 justify-center h-7 aspect-square aria-pressed:bg-[--hl-sm]
                       rounded-sm text-[--color-font] hover:bg-[--hl-xs] focus:ring-inset ring-1 ring-transparent
                       focus:ring-[--hl-md] transition-all text-sm"
            style={{ width: 'auto' }}
        >
            {masked ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
    );
}

module.exports = ToggleMaskingButton;
