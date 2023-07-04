import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './dashboard.module.css';
import Head from 'next/head';
import TextAreaForm from '../TextareaForm/TextAreaForm';
import { FiShare2, FiTrash } from 'react-icons/fi';
import { db } from '@/src/services/firebaseConnection';
import { CiEdit, CiSaveUp2 } from 'react-icons/ci';
import {
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { setTimeout } from 'timers';

export interface ITask {
  id: string;
  tarefa: string;
  create: Date;
  public: boolean;
  user: string;
}
const Shorthand = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { data: session } = useSession();
  const [copy, setCopy] = useState(false);
  const [input, setInput] = useState('');
  const [edit, setEdit] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      const result = collection(db, 'tarefas');
      const userName = session?.user?.name || '';
      const q = query(result, orderBy('create', 'desc'), where('user', '==', userName));
      onSnapshot(q, (querySnapshot) => {
        let taskss: ITask[] = [];

        querySnapshot.forEach((doc) => {
          taskss.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            create: doc.data().create,
            public: doc.data().public,
            user: doc.data().user,
          });
        });
        setTasks(taskss);
      });
    };
    loadTask();
  }, [session?.user?.name]);

  const handleTrash = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tarefas', id));
    } catch (error) {}
  };

  const handleShared = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`
        ${process.env.NEXT_PUBLIC_URL}/task/${id}
      `);
      setCopy(true);
    } catch (error) {}
  };

  useEffect(() => {
    if (copy) {
      const timeout = setTimeout(() => {
        setCopy(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copy]);

  const handleInputEdit = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(value);
  };

  const handleEdit = async (id: string) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'tarefas', id), {
        tarefa: input,
      });
      setEditingTaskId('');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <TextAreaForm placeholder='Digite sua tarefa...' />

      <section className={styles.myTarefa}>
        <h1 className={styles.titleTarefas}>Minhas tarefas</h1>

        {tasks.length === 0 && (
          <p className={styles.message}>Nenhuma tarefa encontrada</p>
        )}

        {tasks.map((task) => (
          <article className={styles.tasks} key={task.id}>
            {task.public && (
              <div className={styles.taskContainer}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_URL}/task/${task.id}`}
                  className={styles.labelPublico}
                >
                  Publico
                </Link>
                <button className={styles.buttonShare}>
                  <FiShare2
                    size={22}
                    color='#3183ff'
                    onClick={() => handleShared(task.id)}
                  />
                </button>

                {copy && <p className={styles.copied}>Copiado com sucesso !</p>}
              </div>
            )}

            {editingTaskId === task.id && (
              <textarea
                placeholder='Edite sua tarefa...'
                className={styles.inputTextarea}
                value={input}
                onChange={handleInputEdit}
              />
            )}

            <div className={styles.taskContent}>
              {task.public ? (
                <Link href={`${process.env.NEXT_PUBLIC_URL}/task/${task.id}`}>
                  <p>{task.tarefa}</p>
                </Link>
              ) : (
                <p>{task.tarefa}</p>
              )}
              <section className={styles.taskActions}>
                <button
                  className={styles.buttonTrash}
                  onClick={() => handleTrash(task.id)}
                >
                  <FiTrash size={22} color='#ff3131' />
                </button>
                <button className={styles.buttonEdit}>
                  <CiEdit size={22} color='#3183ff' onClick={() => {
                    setInput(task.tarefa)
                    setEditingTaskId(task.id)
                  }} />
                </button>
                {editingTaskId === task.id && (
                  <button onClick={() => handleEdit(task.id)}>
                    <CiSaveUp2 size={22} color='#0d7a3e' />
                  </button>
                )}
              </section>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
export default Shorthand;
