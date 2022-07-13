import React from 'react';

export const Dropdown = (props)=>{
        return(<div style={{width:300,margin:20}}>
                <div>
                    <select style={{zIndex:999}} onChange={(e)=>{props.setValue(e.target.value)}} className="browser-default">
                        <option value="" disabled selected>{props.placeholder}</option>
                        {props.optionsList.map((option)=> <option value={`${option.value}`}>{option.name}</option>)}
                    </select>
                </div>
            </div>
        )
}
