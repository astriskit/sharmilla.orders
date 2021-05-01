import { useEffect, useState, useRef } from 'react'
import styles from './ModalInput.module.scss'

const Modal = ({ onClose, open }) => {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const handleClose = () => {
    if (!input) {
      alert('Please enter input')
    } else {
      onClose(input)
    }
  }
  useEffect(() => {
    if (!open) {
      setInput('')
    } else {
      inputRef.current?.focus()
    }
  }, [open])

  if (!open) {
    return null
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modalBody}>
        <div onClick={handleClose} className={styles.close}>
          ×
        </div>
        <div className={styles.modalContent}>
          <label htmlFor="inp">Please write:</label>
          <input
            id="inp"
            ref={inputRef}
            type="text"
            onChange={({ target: { value } }) => setInput(value)}
            value={input}
          />
        </div>
      </div>
    </div>
  )
}

export const ModalInput = () => {
  const [open, setOpen] = useState(false)

  const switchModalOff = (inputValue) => {
    console.log(`::${inputValue} was entered in the modal::`)
    setOpen(false)
  }
  const switchModalOn = () => setOpen(true)

  return (
    <>
      <div className={styles.modalInput}>
        <button onClick={switchModalOn}>Open the modal!</button>
      </div>
      <Modal onClose={switchModalOff} open={open} />
    </>
  )
}
