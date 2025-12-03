import { useCoreStore } from "../../stores/core";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const LoadingBlocker = () => {
    const loadingBlockerIsActive = useCoreStore(state => state.loadingBlockerIsActive);
    if (!loadingBlockerIsActive) {
        return null;
    }
    return (
        <div className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-white bg-opacity-50 text-center p-6 sm:p-8 md:p-10 overflow-y-auto'>
            <LoadingSpinner width={50} height={50} />
        </div>
    );
};
