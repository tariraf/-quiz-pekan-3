import { useDisclosure } from '@chakra-ui/react';
import { createContext, useContext, useState} from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen : isConfirmed, onOpen: openConfirmation, onClose: closeConfirmation } = useDisclosure()
  const [id, setId] = useState()
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

  const state = {   isModalOpen,
                    id, setId,
                    isConfirmed,
                    openConfirmation,
                    closeConfirmation,
                 };
  const handleFunction = {openModal, closeModal}

  return <GlobalContext.Provider value={
    {
        state,
        handleFunction
    }
  }>{children}</GlobalContext.Provider>;
};