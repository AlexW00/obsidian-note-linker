import * as React from "react";
import {App, TFile} from 'obsidian';

export const AppContext = React.createContext<App>(undefined);
export const NoteFilesContext = React.createContext<Map<String, TFile>>(undefined);