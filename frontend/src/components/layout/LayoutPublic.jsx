import { Outlet } from "react-router-dom";

const LayoutPublic = () => {
    return (
        <main className="App">
            <Outlet />
        </main>
    );
};

export default LayoutPublic;