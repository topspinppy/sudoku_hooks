import React from 'react'

const Cell = ({isInitial, number, onChange}) => {
    return (
        <div 
            onClick={e => {
                if (isInitial) {
                    return;
                }
                let numChange = (number + 1) % 5;
                onChange(numChange);
            }} 
            className={`cell ${isInitial ? 'initial' : ''}`}
        >
            {number !== 0 && number }
        </div>
    )
}

export default Cell