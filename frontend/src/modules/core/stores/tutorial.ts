import { create } from "zustand";
import { Step } from "react-joyride";
import { tutorialSteps } from "../components/tutorial/tutorialSteps";
import { persist } from "zustand/middleware";

type TutorialStoreState = {
    tutorialIsRunning: boolean;
    tutorialSteps: Step[];
    tutorialStepIndex: number;
    tutorialTourIsActive: boolean;
};

type TutorialStoreActions = {
    changeTutorialStepIndex: (index: number) => void;
    changeTutorialTourIsActive: (isActive: boolean) => void;
    changeTutorialIsRunning: (tutorialIsRunnung: boolean) => void;
};

type TutorialStore = TutorialStoreState & TutorialStoreActions;

export const useTutorialStore = create<TutorialStore>()(
    persist(
        (set, _get) => ({
            tutorialStepIndex: 0,
            tutorialTourIsActive: false,
            tutorialIsRunning: false,
            tutorialSteps: tutorialSteps,
            changeTutorialStepIndex: (index) => set(() => ({ tutorialStepIndex: index })),
            changeTutorialIsRunning: (tutorialIsRunnung) => set(() => ({ tutorialIsRunning: tutorialIsRunnung })),
            changeTutorialTourIsActive: (isActive) => set(() => ({ tutorialTourIsActive: isActive })),
        }),
        {
            name: "tutorial-storage",
            partialize: (state) => ({
                tutorialStepIndex: state.tutorialStepIndex,
                tutorialIsRunning: state.tutorialIsRunning,
                tutorialTourIsActive: state.tutorialTourIsActive,
            }),
        }
    )
);
