export const Footer = () => {
    return (
        <footer className="mt-5 bg-accent">
            <div className="flex justify-between items-center p-4 max-w-[1500px] mx-auto text-sm">
                <div>
                    <div>
                        Made with <span className="text-primary">&#9829;</span> in Düsseldorf by&nbsp;
                        <a href="https://www.medmikrobio.hhu.de/ag-dilthey" className="font-bold" target="_blank">
                            DiltheyLab
                        </a>
                    </div>
                    <small>© 2024 Heinrich-Heine-Universität Düsseldorf</small>
                </div>
                <div>
                    <a href="/contact" className="underline ml-4">
                        Kontakt
                    </a>
                    <a href="/contact" className="underline ml-4">
                        Datenschutz
                    </a>
                    <a href="/contact" className="underline ml-4">
                        Impressum
                    </a>
                </div>
            </div>
        </footer>
    );
};
