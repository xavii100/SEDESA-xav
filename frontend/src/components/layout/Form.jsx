import React from "react";

const Form = props => {
  return (
    <form id={props.id} onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
};

const InputForm = props => {

    return (
        <div className="mb-6">
            <input type={props.type} ref={props.innerRef} id={props.id} name={props.name} text={props.text} value={props.value} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${props.className}`} placeholder={props.placeholder} maxLength={props.maxLength} minLength={props.minLength} required={props.required} onChange={props.onChange} autoFocus={props.autofocus} disabled={props.disabled} readOnly={props.readOnly} />
            <small class="mt-1 ml-2 text-sm text-gray-600">{props.textHelper}</small>
        </div>
    );
  };

const LabelForm = props => {
    return (
        <label htmlFor={props.htmlFor} className={`block mb-2 pt-2 text-sm font-medium ${props.textColor}`}>
            {props.label}
        </label>
    );
};

const SelectForm = props => {
  return (
    <select
      id={props.id}
      name={props.name}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      onChange={props.onChange}
    >
      {props.children}
    </select>
  );
};

const SelectContentForm = props => {
  return (
    <select
      id={props.id}
      name={props.name}
      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block p-2.5 ${props.className}`}
      onChange={props.onChange}
    >
      {props.children}
    </select>
  );
};

const ValidateInputForm = (props) => {
    function getColor (color) {
        if (color === 'green') return 'bg-green-50 border border-green-300 text-green-900 placeholder-green-700 text-sm rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full p-2.5';
        else if (color === 'red') return 'bg-red-50 border border-red-300 text-red-900 placeholder-red-700 text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5';
        else return 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
    }
    const clase = getColor(props.color);
    const color = props.color ? props.color : 'gray'
    return (
        <div className="mb-2">
            <label htmlFor={props.id} className={`block mb-2 text-sm font-medium text-${color}-700`}>{props.label}</label>
            <input type={props.type} ref={props.innerRef} id={props.id} name={props.name} text={props.text} value={props.value} className={`${clase} ${props.className}`} placeholder={props.placeholder} maxLength={props.maxLength} minLength={props.minLength} required={props.required} onChange={props.onChange} autoFocus={props.autofocus} autoComplete={props.autoComplete} disabled={props.disabled} min={props.min} max={props.max} readOnly={props.readOnly} pattern={props.pattern} title={props.title} />
            <p className={`mt-2 text-sm text-red-600 ${props.helpClass !== '' ? props.helpClass : 'invisible'}`}>{props.helpMessage}</p>
        </div>
    );
}

const ValidateSelectForm = (props) => {
    function getColor (color) {
        if (color === 'green') return 'bg-green-50 border border-green-300 text-green-900 placeholder-green-700 text-sm rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full p-2.5';
        else if (color === 'red') return 'bg-red-50 border border-red-300 text-red-900 placeholder-red-700 text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5';
        else return 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
    }
    const clase = getColor(props.color);
    const color = props.color ? props.color : 'gray'
    return (
        <div className="mb-2">
            <label htmlFor={props.id} className={`block mb-2 text-sm font-medium text-${color}-700`}>{props.label}</label>
            <select ref={props.innerRef} id={props.id} name={props.name} text={props.text} value={props.value} className={clase} placeholder={props.placeholder} maxLength={props.maxLength} minLength={props.minLength} required={props.required} onChange={props.onChange} autoFocus={props.autofocus} autoComplete={props.autoComplete} disabled={props.disabled}>
                {props.children}
            </select>
            <p className={`mt-2 text-sm text-red-600 ${props.helpClass !== '' ? props.helpClass : 'invisible'}`}>{props.helpMessage}</p>
        </div>
    );
}

const ValidateFloatIconForm = (props) => {
    function getColor (color) {
        if (color === 'green') return 'bg-green-50 border border-green-300 text-green-900 placeholder-green-700 text-sm rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full p-2.5';
        else if (color === 'red') return 'bg-red-50 border border-red-300 text-red-900 placeholder-red-700 text-sm rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 block w-full p-2.5';
        else return 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
    }
    const clase = getColor(props.color);
    const color = props.color ? props.color : 'gray'
    return (
        <>
            <label htmlFor={props.id} className={`block mb-2 text-sm font-medium text-${color}-700`}>{props.label}</label>
            <div class="relative mb-0">
                <div class={`flex absolute inset-y-0 ${props.iconClass !== '' ? props.iconClass : 'left-0'} items-center pl-3 cursor-pointer`}>
                    <i class={props.icon} onClick={props.OnClickIcon}></i>
                </div>
                <input type={props.type} ref={props.innerRef} id={props.id} name={props.name} text={props.text} value={props.value} className={clase} placeholder={props.placeholder} maxLength={props.maxLength} minLength={props.minLength} required={props.required} onChange={props.onChange} autoFocus={props.autofocus} autoComplete={props.autoComplete} disabled={props.disabled} pattern={props.pattern} title={props.title} />
            </div>
            <p className={`mt-2 mb-6 text-sm text-red-600 ${props.helpClass !== '' ? props.helpClass : 'invisible'}`}>{props.helpMessage}</p>
        </>
    );
}

const OptionSelectForm = props => {
  return (
    <option key={props.key} id={props.id} value={props.value} selected={props.selected}>
      {props.children}
    </option>
  );
};

const SubmitButtonForm = props => {

    return (
        <>
            <button type="submit" className="inline-flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">
                {props.children}
            </button>
        </>
    );
};

const InputSearchForm = (props) => {
    return (
        <>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="bi bi-search text-gray-500"></i>
                </div>
                <input type="text" id={props.id} name={props.name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" placeholder={props.placeholder} onChange={props.onChange} />
            </div>
        </>
    );
};

const ToggleSwitchForm = (props) => {
    return (
        <>
            <label key={props.idRow+'-'+props.idCell} htmlFor={props.id} className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value={props.value} name={props.name} id={props.id} className={`sr-only peer ${props.className}`} checked={props.isChecked} disabled={props.disabled} onChange={props.onChange} onClick={props.onClick} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                    {props.text}
                </span>
            </label>
        </>
    );
};

const RadioButtonForm = props => {
  return (
    <div class="flex items-center m-4">
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.value}
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
        checked={props.isChecked}
        disabled={props.disabled}
        onChange={props.onChange}
        onClick={props.onClick}
      />
      <label for={props.id} class="ml-2 text-sm font-medium text-gray-900">
        {props.label}
      </label>
    </div>
  );
};

export {
    Form,
    InputForm,
    LabelForm,
    SelectForm,
    SelectContentForm,
    OptionSelectForm,
    SubmitButtonForm,
    InputSearchForm,
    ToggleSwitchForm,
    ValidateInputForm,
    RadioButtonForm,
    ValidateSelectForm,
    ValidateFloatIconForm,
}
