import React, { ChangeEvent, FormEvent, createContext } from 'react';
import styles from './TextArea.module.css';
import { useState } from 'react';
import { HTMLProps } from 'react';
import { useSession } from 'next-auth/react';

import { db } from '@/src/services/firebaseConnection';

import { addDoc, collection } from 'firebase/firestore';

const valueContext = createContext('');

const TextAreaForm = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
  const [valor, setValor] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const { data: session } = useSession();

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    setValor(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (valor === '') return;

    try {
      await addDoc(collection(db, 'tarefas'), {
        tarefa: valor,
        create: new Date(),
        public: publicTask,
        user: session?.user?.name,
      });
      setValor('');
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePublicTask = ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(checked);
  };

const content = () => {
    if (valor.length > 0) {
      return (
        <textarea
          {...rest}
          className={styles.inputTextareaBorder}
          value={valor}
          onChange={handleChange}
        />
      );
    }
  };
  return (
    <>
      <section className={styles.containerForm}>
        <h1 className={styles.title}>Qual sua tarefa ?</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {valor.length > 0 ? (
              <textarea
              {...rest}
              className={styles.inputTextareaBorder}
              value={valor}
              onChange={handleChange}
            />
          ) : (
            <textarea
              {...rest}
              className={styles.inputTextarea}
              value={valor}
              onChange={handleChange}
            />
          )}
          <label htmlFor='checkbox'>
            <input
              type='checkbox'
              name='checkbox'
              className={styles.checkbox}
              checked={publicTask}
              onChange={handleChangePublicTask}
            />
            Deixar Tarefa Pública
          </label>
          <button
            type='submit'
            className={styles.buttonSubmit}
            disabled={valor.length <= 0}
          >
            Enviar
          </button>
        </form>
      </section>
    </>
  );
};

export default TextAreaForm;
