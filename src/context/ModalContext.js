// ModalContext.js
import React, { createContext, useState, useContext } from 'react';
import Modal from 'react-modal';
import '../components/css/Modal.css';
import { AgGridReact } from 'ag-grid-react';

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
        if (modalContent.onAction) {
            modalContent.onAction(false);
            setModalContent({});
        }
    };

    const actionModal = () => {
        setIsOpen(false);
        if (modalContent.onAction) {
            modalContent.onAction(true);
            setModalContent({});
        }
    };

    const exportData = () => {
        const fileName = modalContent?.title+".json";
        const json = JSON.stringify(modalContent?.rowData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        width: modalContent.grid ? '60%' : '400px',
                        height: 'auto',
                        padding: '20px',
                    },
                }}
            >
                {
                    modalContent?.showClose &&
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '0px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '32px',
                            cursor: 'pointer',
                        }}
                    >
                        &times;
                    </button>
                }


                <dv style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px' }}>
                    <h2>{modalContent?.title}</h2>
                    {
                        modalContent?.grid && (
                            <button className="reference-info-button" onClick={exportData}>
                                Export Data
                            </button>
                        )
                    }
                </dv>

                {
                    modalContent?.grid ? (
                        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%', flexGrow: 1, marginTop: 2 }}>
                            <AgGridReact
                                columnDefs={modalContent?.columnDefs}
                                rowData={modalContent?.rowData}
                                suppressRowClickSelection={true}
                                rowSelection="single"
                                onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
                                defaultColDef={{ filter: true, sortable: true }}
                            />
                        </div>
                    ) : (
                        <>
                            <p>{modalContent?.message}</p>
                            <div className="modal-button-container">
                                <button className="modal-button positive" onClick={actionModal}>{modalContent?.positiveButtonText || 'OK'}</button>
                                {
                                    (modalContent?.negativeButton || modalContent?.negativeButtonText) && <button className="modal-button negative" onClick={closeModal}>{modalContent?.negativeButtonText || 'Cancel'}</button>
                                }
                            </div>
                        </>
                    )
                }

            </Modal>
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
