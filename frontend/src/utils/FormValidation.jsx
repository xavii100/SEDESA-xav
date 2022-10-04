// funciones para validar los componentes individuales del formulario

const ValidInputTextForm = (name, value, type, itemForm, setItemForm) => {
    // validar campos de tipo texto
    if (type === 'text') {
        if (value === '' && (name === 'password' || name === 'password2')) { // no hay nada en el campo, se debe eliminar el mensaje y color
            setItemForm({ 
                ...itemForm, 
                [name]: {
                    ...itemForm[name], 
                    value: value, 
                    color: '', 
                    message: '', isErr: true,
                },
            });
        } else if (value.trim().length === 0) {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'red',
                    isErr: true,
                }
            });
        } else if (value.trim().length > 0) { // los campos de texto no están vacíos
            if (name === 'password' || name === 'password2') { // los campos de texto son las contraseñas
                if (value.length < 8 ){ // verificar que la contraseña contenga al menos 8 caracteres
                    setItemForm({ 
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'red', 
                            message: 'La contraseña debe ser de al menos 8 caracteres', 
                            isErr: true,
                        },
                    }); 
                } else { // la contraseña tiene al menos 8 caracteres
                    // almacenar los valores de la contraseña
                    setItemForm({
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'green', 
                            message: '', 
                            isErr: false,
                        },
                    });

                    // verificar a partir de la contraseña contra la confirmación de la contraseña
                    if (name === 'password' && value !== itemForm.password2.value) { // la contraseña no coincide con la confirmación de la contraseña
                        setItemForm({ 
                            ...itemForm, 
                            [name]: {
                                ...itemForm[name], 
                                value: value, 
                                color: 'red', 
                                message: 'La contraseña no coincide, verifica nuevamente la contraseña', 
                                isErr: true,
                            }, 
                        });
                    } else if (name === 'password' && value === itemForm.password2.value) { // ambas contraseñas coinciden !!
                        setItemForm({
                            ...itemForm, 
                            [name]: {
                                ...itemForm[name], 
                                value: value, 
                                color: 'green', 
                                message: '', 
                                isErr: false,
                            },
                            password2: {
                                ...itemForm.password2, 
                                color: 'green', 
                                message: '', 
                                isErr: false,
                            },
                        }); 
                    }
                    
                    // verificar a partir de la confirmación de la contraseña contra la contraseña
                    if (name === 'password2' && value !== itemForm.password.value) { // la confirmación de la contraseña no coincide con la contraseña
                        setItemForm({ 
                            ...itemForm, 
                            [name]: {
                                ...itemForm[name], 
                                value: value, 
                                color: 'red', 
                                message: 'La contraseña no coincide, verifica nuevamente la contraseña', 
                                isErr: true,
                            }, 
                        });
                    } else if (name === 'password2' && value === itemForm.password.value) { // ambas contraseñas coinciden !!
                        setItemForm({
                            ...itemForm, 
                            [name]: {
                                ...itemForm[name], 
                                value: value, 
                                color: 'green', 
                                message: '', 
                                isErr: false,
                            },
                            password: {
                                ...itemForm.password, 
                                color: 'green', 
                                message: '', 
                                isErr: false,
                            },
                        }); 
                    }
                } // fin contraseña de al menos 8 caracteres
            } else { // los campos de texto NO son las contraseñas
                setItemForm({
                    ...itemForm,
                    [name]: {
                        ...itemForm[name],
                        value: value,
                        color: 'green',
                        isErr: false,
                    }
                });
            } // fin los campos de texto son las contraseñas
        } // fin los campos de texto no están vacíos
    } // fin validar campos de tipo texto
}

const ValidInputPasswordForm = (name, value, type, itemForm, setItemForm) => {
    // validar campos de tipo password
    if (type === 'password') {
        if (value === '') { // no hay nada en el campo, se debe eliminar el mensaje y color
            setItemForm({ 
                ...itemForm, 
                [name]: {
                    ...itemForm[name], 
                    value: value, 
                    color: '', 
                    message: '', isErr: true,
                },
            });
        } else if (value.trim().length === 0) { // verificar que no sea vacía la contraseña (múltiples espacios en blanco)
            setItemForm({ 
                ...itemForm, 
                [name]: {
                    ...itemForm[name], 
                    value: value, 
                    color: 'red', 
                    message: 'La contraseña no puede ser vacía', isErr: true,
                },
            });
        } else if (value.trim().length > 0) { // la contraseña no está vacía
            if (value.length < 8 ){ // verificar que la contraseña contenga al menos 8 caracteres
                setItemForm({ 
                    ...itemForm, 
                    [name]: {
                        ...itemForm[name], 
                        value: value, 
                        color: 'red', 
                        message: 'La contraseña debe ser de al menos 8 caracteres', 
                        isErr: true,
                    },
                }); 
            } else if (value.length >= 8 ) { // la contraseña tiene al menos 8 caracteres
                // almacenar los valores de la contraseña
                setItemForm({
                    ...itemForm, 
                    [name]: {
                        ...itemForm[name], 
                        value: value, 
                        color: 'green', 
                        message: '', 
                        isErr: false,
                    },
                });

                // verificar a partir de la contraseña contra la confirmación de la contraseña
                if (name === 'password' && value !== itemForm.password2.value) { // la contraseña no coincide con la confirmación de la contraseña
                    setItemForm({ 
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'red', 
                            message: 'La contraseña no coincide, verifica nuevamente la contraseña', 
                            isErr: true,
                        }, 
                    });
                } else if (name === 'password' && value === itemForm.password2.value) { // ambas contraseñas coinciden !!
                    setItemForm({
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'green', 
                            message: '', 
                            isErr: false,
                        },
                        password2: {
                            ...itemForm.password2, 
                            color: 'green', 
                            message: '', 
                            isErr: false,
                        },
                    }); 
                }
                
                // verificar a partir de la confirmación de la contraseña contra la contraseña
                if (name === 'password2' && value !== itemForm.password.value) { // la confirmación de la contraseña no coincide con la contraseña
                    setItemForm({ 
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'red', 
                            message: 'La contraseña no coincide, verifica nuevamente la contraseña', 
                            isErr: true,
                        }, 
                    });
                } else if (name === 'password2' && value === itemForm.password.value) { // ambas contraseñas coinciden !!
                    setItemForm({
                        ...itemForm, 
                        [name]: {
                            ...itemForm[name], 
                            value: value, 
                            color: 'green', 
                            message: '', 
                            isErr: false,
                        },
                        password: {
                            ...itemForm.password, 
                            color: 'green', 
                            message: '', 
                            isErr: false,
                        },
                    }); 
                }
            } // fin contraseña de al menos 8 caracteres
        } // fin la contraseña no está vacía
    } // fin validar campos de tipo password
}

const ValidInputEmailForm = (name, value, type, itemForm, setItemForm) => {
    // validar campos de tipo email
    if (type === 'email') {
        if ( value.trim().length > 0 && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value) ) {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'green',
                    isErr: false,
                }
            });
        } else {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'red',
                    isErr: true,
                }
            });
        }
    }
}

const ValidSelectForm = (name, value, type, itemForm, setItemForm) => {
    // validar combos (select)
    if (type === 'select-one') {
        if (parseInt(value) === 0) {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'red',
                    isErr: true,
                }
            });
        } else {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'green',
                    isErr: false,
                }
            });
        }
    }
}

const ValidInputDateForm = (name, value, type, itemForm, setItemForm) => {
    // validar campos de tipo fecha
    if (type === 'date') {
        if (value.trim() === '') {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'red',
                    isErr: true,
                }
            });
        } else {
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value,
                    color: 'green',
                    isErr: false,
                }
            });
        }
    }
}

const ValidInputPhoneForm = (name, value, type, itemForm, setItemForm) => {
    // validar campos de tipo número
    if (type === 'tel') {
        if (value.trim().length == 0) { // el teléfono no se ha ingresado
            setItemForm({
                ...itemForm,
                [name]: {
                    ...itemForm[name],
                    value: value.trim(),
                    color: 'red',
                    isErr: true,
                }
            });
        } else if (value.trim().length > 0){
            if ( isNaN( value.trim() ) ) { // si es una cadena
                setItemForm({
                    ...itemForm,
                    [name]: {
                        ...itemForm[name],
                        value: value.trim(),
                        color: 'red',
                        isErr: true,
                    }
                });
            } else { // el telefono es númerico
                if (value.trim().length < 10 || value.trim().length > 10){ // el teléfono es incompleto
                    setItemForm({
                        ...itemForm,
                        [name]: {
                            ...itemForm[name],
                            value: value.trim(),
                            color: 'red',
                            isErr: true,
                        }
                    }); 
                } else { // OK - el teléfono es númerico con 10 numeros
                    setItemForm({
                        ...itemForm,
                        [name]: {
                            ...itemForm[name],
                            value: value.trim(),
                            color: 'green',
                            isErr: false,
                        }
                    });
                }
            }
        }
    }
}

export {
    ValidInputTextForm,
    ValidInputPasswordForm,
    ValidInputEmailForm,
    ValidInputDateForm,
    ValidInputPhoneForm,
    ValidSelectForm,
}