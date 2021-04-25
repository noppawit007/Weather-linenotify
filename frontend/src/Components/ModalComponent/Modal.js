import React from 'react';
import ReactModal from 'react-modal';

function Modal({ showModal, closeModal, title, handleOk, isSubmit }) {
  ReactModal.setAppElement('#root');

  return (
    <div>
      <ReactModal
        isOpen={showModal}
        contentLabel="Minimal Modal Example"
        style={customStyle}
      >
        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <button onClick={handleOk} className="btnMine reset-btn">
            {isSubmit ? 'Submit' : 'Yes'}
          </button>
          <button onClick={closeModal} className="btnMine cancel-btn">
            {isSubmit ? 'Cancel' : 'Close'}
          </button>
        </div>
      </ReactModal>
    </div>
  );
}

const customStyle = {
  content: {
    width: '50%',
    height: '255px',
    top: '25%',
    left: '25%',
    backgroundColor: 'rgba(255, 253, 253, 0.89)'
  },
  overlay: {
    backgroundColor: '#0000006e'
  }
};

export default Modal;
