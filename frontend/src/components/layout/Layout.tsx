import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: any) => {
    return (
        <div>
            <Header></Header>
            <main className="min-h-[calc(100vh-185px)]">{children}</main>
            <Footer></Footer>
        </div>
    );
};
