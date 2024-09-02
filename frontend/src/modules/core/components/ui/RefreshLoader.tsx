import { LoadingSpinner } from "./LoadingSpinner";

export const RefreshLoader = () => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <LoadingSpinner width={50} height={50} />
        </div>
    );
};
