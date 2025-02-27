const React = require('react');

const ToggleMaskingButton = ({ onToggle, masked }) => {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: masked ? 'blue' : 'darkgray',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {masked ? 'Disable Masking' : 'Enable Masking1'}
    </button>
  );
};

module.exports = ToggleMaskingButton;
