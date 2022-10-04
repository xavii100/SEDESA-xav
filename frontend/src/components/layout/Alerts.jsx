import React from "react";

const SuccessAlert = (props) => {
  return (
    <>
      <div
        ref={props.innerRef}
        className={`p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg ${props.className}`}
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="inline flex-shrink-0 mr-3 w-5 h-5 bi bi-check-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>
        {props.text}
      </div>
    </>
  );
};

const WarningAlert = (props) => {
  return (
    <>
      <div
        ref={props.innerRef}
        className={`p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg ${props.className}`}
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="inline flex-shrink-0 mr-3 bi bi-exclamation-triangle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        {props.text}
      </div>
    </>
  );
};

const DangerAlert = (props) => {
  return (
    <>
      <div
        ref={props.innerRef}
        className={`p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg ${props.className}`}
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="inline flex-shrink-0 mr-3 bi bi-exclamation-octagon-fill"
          viewBox="0 0 16 16"
        >
          <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        {props.text}
      </div>
    </>
  );
};

const DarkgAlert = (props) => {
  return (
    <>
      <div
        className={`p-4 text-sm text-gray-700 bg-gray-100 rounded-lg ${props.className}`}
        role="alert"
      >
        {props.children}
        {props.text}
      </div>
    </>
  );
};

const InfoAlert = (props) => {
  return (
    <>
      <div
        ref={props.innerRef}
        className={`p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg ${props.className}`}
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="inline flex-shrink-0 mr-3 bi bi-info-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
        {props.text}
      </div>
    </>
  );
};

export { SuccessAlert, WarningAlert, DangerAlert, DarkgAlert, InfoAlert };
