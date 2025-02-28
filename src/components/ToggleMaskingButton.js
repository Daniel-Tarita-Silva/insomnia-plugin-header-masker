const React = require('react');

function ToggleMaskingButton({ onToggle, masked }) {
    return (
        <button
            onClick={onToggle}
            className="flex items-center disabled:opacity-50 justify-center h-7 aspect-square aria-pressed:bg-[--hl-sm]
                       rounded-sm text-[--color-font] hover:bg-[--hl-xs] focus:ring-inset ring-1 ring-transparent
                       focus:ring-[--hl-md] transition-all text-sm"
            style={{ width: 'auto' }}
        >
            {masked ? <i className="fa fa-eye-slash" /> : <i className="fa fa-eye" />}
        </button>
    );
}

module.exports = ToggleMaskingButton;
