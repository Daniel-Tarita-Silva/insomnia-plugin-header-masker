const React = require('react');
const { Eye, EyeOff } = require('lucide-react'); // Install with: npm install lucide-react

function ToggleMaskingButton({ onToggle, masked }) {
    return (
        <button onClick={onToggle} className="mask-toggle-button">
            {masked ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
    );
}

module.exports = ToggleMaskingButton;
