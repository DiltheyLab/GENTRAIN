import { Footer } from "./Footer";
import { Header } from "./Header";
import test from "./Header";

export const Layout = ({ children }: any) => {
    return (
        <div>
            <Header></Header>
            <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-185px)]">{children}</main>
            <Footer></Footer>
        </div>
    );
};
