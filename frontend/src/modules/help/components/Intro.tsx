import GentrainTutorialVideo from "@/assets/video/Gentrain_Videotutorial_compressed.mp4";
import Poster from "@/assets/img/poster_gentrain.png";

export const Intro = () => {
    return (
        <div data-tutorial-tour-step="help-intro">
            <div className="mb-4 flex items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hilfe</h1>
                    <p className="text-muted-foreground">
                        Hier finden Sie Informationen, Anleitungen und das Tutorial zur Nutzung der Anwendung.
                    </p>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="bg-white w-full">
                    <video
                        className="w-full max-w-[900px] h-auto rounded-md"
                        controls
                        preload="metadata"
                        playsInline
                        poster={Poster}
                    >
                        <source src={GentrainTutorialVideo} type="video/mp4" />
                        Ihr Browser unterstützt das Video-Element nicht.
                    </video>
                </div>
            </div>
        </div>
    );
};
