import React from 'react'

const Title = (props) => {
    return (
        <>
            <h1 className={`text-4xl font-serif talic md:not-italic ${props.textAlign} pb-2`}>
                {props.title}
            </h1>
            <div className="pt-2 pb-5">
                <div className="w-full border-t border-1 border-gray-400"></div>
            </div>
        </>
    );
};


const SingleTitle = (props) => {
    return (
        <>
            <p className="text-4xl font-serif talic md:not-italic text-center pb-5">
                {props.children}
            </p>
        </>
    );
};

export {
    SingleTitle,
    Title,
};