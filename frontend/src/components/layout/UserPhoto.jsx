import UserFP from '../../img/avatar-01.jpg'
import React from 'react'

const UserPhoto = () => {
    return (
        <>
            <img src={UserFP} className="w-8 h-8 rounded-full" alt="user" />
        </>
    );
};

export {
    UserPhoto,
}