// ModalContext.js
import React, { createContext, useState, useContext } from 'react';
import Modal from 'react-modal';
import '../components/css/Modal.css';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const openModal = (content) => {
        setModalContent(content);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setModalContent({});
    };

    const actionModal = () => {
        setIsOpen(false);
        if(modalContent.onAction) {
            modalContent.onAction();
            setModalContent({});
        }
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '20px',
                    },
                }}
            >
                <h2>{modalContent?.title}</h2>
                <p>{modalContent?.message}</p>
                <div className="modal-button-container">
                    <button className="modal-button positive" onClick={actionModal}>{modalContent?.positiveButtonText || 'OK'}</button>
                    {
                        (modalContent?.negativeButton || modalContent?.negativeButtonText) && <button className="modal-button negative" onClick={closeModal}>{modalContent?.negativeButtonText || 'Cancel'}</button>
                    }
                    
                </div>
            </Modal>
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
