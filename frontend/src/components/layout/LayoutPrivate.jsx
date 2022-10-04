import { Outlet } from "react-router-dom";
import Header from "./Header";

const LayoutPrivate = () => {
    return (
        <>
            <Header />
            <main className="App">
                <Outlet />
            </main>
        </>
    );
};

export default LayoutPrivate;