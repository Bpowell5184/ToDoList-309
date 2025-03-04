import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './Overlay.css';

export function Overlay({ isOpen, onClose, children }) {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={(e) => e.stopPropagation()}/>
          <div className="overlay__container">
            <div className="overlay__controls">
              <button
                className="overlay__close"
                type="button"
                onClick={onClose}
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

Overlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Overlay.defaultProps = {
  children: null,
};

export default Overlay;
