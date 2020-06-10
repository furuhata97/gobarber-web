// Contexto para toasts
// Comece importando o createContext
import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/toastContainer';

// Essa interface representa quais dados esperamos que contenham dentro do context
interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

// Essa interface representa o formato do objeto que o estado de mensagens do toast possuirá
export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

// O básico de um contexto é o seguinte:

// A linha abaixo inicializa um contexto, onde o contexto terá como conteúdo o ToastContextData
// Como é uma inicialização, esses dados ainda não existem, então o contexto é inicializado com um objeto vazio
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// O provider representa o elemento React ao qual estará envolta dos outros componentes que utilizarão o Provider
// Dentro do provider é onde definimos as funções e variáveis que desejamos ter no contexto
const ToastProvider: React.FC = ({ children }) => {
  // É um estado que armazena um array de tipo ToastMessage
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages((oldMessages) => [...oldMessages, toast]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

// É o hook que será utilizado por outros componentes
function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
