import React from 'react'

const MainContainer = props => {
    return (
        <div className='container mx-auto mt-6 p-2'>
            {props.children}
        </div>
    );
};


const RowsContainer = (props) => {
    return (
        // <div className={`grid grid-cols-1 gap-6 md:grid-cols-${props.columns} lg:grid-cols-${props.columns}`}>
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-${props.columns} lg:grid-cols-${props.columns} ${props.addClass}`}>
            {props.children}
        </div>
    );
};


const ColumnContainer = (props) => {
    return (
        <div className={`relative mb-${props.mb} mt-${props.mt} py-${props.py} px-${props.px}`}>
            {props.children}
        </div>
    );
};

const CenteredContainer = props => {
    return (
        <div className="m-2 grid place-items-center h-screen m-0">
            {props.children}
        </div>
    );
};

const BorderedShadowContainer = props => {
    return (
        <div
        className={`shadow-lg rounded-lg border border-gray-200 shadow-md py-5 px-10 ${props.className}`}>
            {props.children}
        </div>
    );
};

export  {
    MainContainer,
    RowsContainer,
    ColumnContainer,
    CenteredContainer,
    BorderedShadowContainer,
}