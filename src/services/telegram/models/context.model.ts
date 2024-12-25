import {Context, Scenes} from "telegraf";
import {FirebaseUserDataType} from "./user.model";

export interface SessionData extends Scenes.WizardSessionData {
    created_at: Date;
    UserData?: FirebaseUserDataType;
}

export interface MyContext extends Context {
    session: Record<string, SessionData>;
    scene: Scenes.SceneContextScene<MyContext, SessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
}