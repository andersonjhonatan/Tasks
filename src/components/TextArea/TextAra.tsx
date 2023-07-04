import React from 'react'
import styles from './textara.module.css'
import { HTMLProps } from 'react'

const TextAra = ({...rest}: HTMLProps<HTMLTextAreaElement>) => {
  return (
    <textarea {...rest} className={styles.inputTextarea} />
  )
}

export default TextAra