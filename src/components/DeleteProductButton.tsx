'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './DeleteProductButton.module.css';

type DeleteProductButtonProps = {
  action: () => Promise<void>;
};

export default function DeleteProductButton({ action }: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={styles.trigger}>
        Delete
      </button>

      {isOpen ? (
        <div
          className={styles.overlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-message">
            <h3 id="delete-title" className={styles.title}>
              Delete product?
            </h3>
            <p id="delete-message" className={styles.message}>
              This action cannot be undone.
            </p>

            <div className={styles.actions}>
              <button type="button" onClick={() => setIsOpen(false)} className={styles.cancel} ref={cancelButtonRef}>
                Cancel
              </button>
              <form action={action}>
                <button type="submit" className={styles.confirm}>
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
