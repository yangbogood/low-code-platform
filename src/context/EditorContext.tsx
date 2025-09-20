import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { ComponentConfig, PageConfig, ProjectConfig } from '../types';

// 编辑器状态接口
interface EditorState {
  project: ProjectConfig | null;
  currentPage: PageConfig | null;
  selectedComponent: ComponentConfig | null;
  isPreview: boolean;
  history: {
    past: ProjectConfig[];
    present: ProjectConfig | null;
    future: ProjectConfig[];
  };
}

// 编辑器动作类型
type EditorAction =
  | { type: 'SET_PROJECT'; payload: ProjectConfig }
  | { type: 'SET_CURRENT_PAGE'; payload: PageConfig }
  | { type: 'SELECT_COMPONENT'; payload: ComponentConfig | null }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; props: Record<string, any> } }
  | { type: 'ADD_COMPONENT'; payload: { component: ComponentConfig; parentId?: string } }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_HISTORY' };

// 初始状态
const initialState: EditorState = {
  project: null,
  currentPage: null,
  selectedComponent: null,
  isPreview: false,
  history: {
    past: [],
    present: null,
    future: [],
  },
};

// 状态更新函数
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_PROJECT':
      return {
        ...state,
        project: action.payload,
        currentPage: action.payload.pages[0] || null,
        history: {
          past: [],
          present: action.payload,
          future: [],
        },
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'SELECT_COMPONENT':
      return {
        ...state,
        selectedComponent: action.payload,
      };

    case 'UPDATE_COMPONENT': {
      if (!state.project || !state.currentPage) {return state;}

      const updateComponent = (components: ComponentConfig[]): ComponentConfig[] => {
        return components.map(comp => {
          if (comp.id === action.payload.id) {
            return { ...comp, props: { ...comp.props, ...action.payload.props } };
          }
          if (comp.children) {
            return { ...comp, children: updateComponent(comp.children) };
          }
          return comp;
        });
      };

      const updatedComponents = updateComponent(state.currentPage.components);
      const updatedPage = { ...state.currentPage, components: updatedComponents };
      const updatedProject = {
        ...state.project,
        pages: state.project.pages.map(page =>
          page.id === updatedPage.id ? updatedPage : page,
        ),
      };

      return {
        ...state,
        project: updatedProject,
        currentPage: updatedPage,
      };
    }

    case 'ADD_COMPONENT': {
      if (!state.project || !state.currentPage) {return state;}

      const addComponent = (components: ComponentConfig[], parentId?: string): ComponentConfig[] => {
        if (!parentId) {
          return [...components, action.payload.component];
        }

        return components.map(comp => {
          if (comp.id === parentId) {
            return {
              ...comp,
              children: [...(comp.children || []), action.payload.component],
            };
          }
          if (comp.children) {
            return { ...comp, children: addComponent(comp.children, parentId) };
          }
          return comp;
        });
      };

      const newComponents = addComponent(state.currentPage.components, action.payload.parentId);
      const newPage = { ...state.currentPage, components: newComponents };
      const newProject = {
        ...state.project,
        pages: state.project.pages.map(page =>
          page.id === newPage.id ? newPage : page,
        ),
      };

      return {
        ...state,
        project: newProject,
        currentPage: newPage,
      };
    }

    case 'DELETE_COMPONENT': {
      if (!state.project || !state.currentPage) {return state;}

      const deleteComponent = (components: ComponentConfig[]): ComponentConfig[] => {
        return components.filter(comp => {
          if (comp.id === action.payload) {return false;}
          if (comp.children) {
            comp.children = deleteComponent(comp.children);
          }
          return true;
        });
      };

      const remainingComponents = deleteComponent(state.currentPage.components);
      const updatedPageAfterDelete = { ...state.currentPage, components: remainingComponents };
      const updatedProjectAfterDelete = {
        ...state.project,
        pages: state.project.pages.map(page =>
          page.id === updatedPageAfterDelete.id ? updatedPageAfterDelete : page,
        ),
      };

      return {
        ...state,
        project: updatedProjectAfterDelete,
        currentPage: updatedPageAfterDelete,
        selectedComponent: null,
      };
    }

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreview: !state.isPreview,
      };

    case 'SAVE_HISTORY': {
      if (!state.project) {return state;}
      return {
        ...state,
        history: {
          past: [...state.history.past, state.history.present!],
          present: state.project,
          future: [],
        },
      };
    }

    case 'UNDO': {
      if (state.history.past.length === 0) {return state;}
      const previous = state.history.past[state.history.past.length - 1];
      return {
        ...state,
        project: previous,
        currentPage: previous.pages[0] || null,
        history: {
          past: state.history.past.slice(0, -1),
          present: previous,
          future: [state.history.present!, ...state.history.future],
        },
      };
    }

    case 'REDO': {
      if (state.history.future.length === 0) {return state;}
      const next = state.history.future[0];
      return {
        ...state,
        project: next,
        currentPage: next.pages[0] || null,
        history: {
          past: [...state.history.past, state.history.present!],
          present: next,
          future: state.history.future.slice(1),
        },
      };
    }

    default:
      return state;
  }
}

// 创建上下文
const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

// 提供者组件
export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

// 自定义Hook
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
