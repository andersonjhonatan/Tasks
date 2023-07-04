import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import Head from 'next/head';
import TextAreaForm from '../TextareaForm/TextAreaForm';
import { FiShare2, FiTrash } from 'react-icons/fi';
import { db } from '@/src/services/firebaseConnection';
import {
  collection,
  where,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
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
            <div className={styles.taskContent}>
              {task.public ? (
                <Link href={`${process.env.NEXT_PUBLIC_URL}/task/${task.id}`}>
                  <p>{task.tarefa}</p>
                </Link>
              ) : (
                <p>{task.tarefa}</p>
              )}

              <button className={styles.buttonTrash} onClick={() => handleTrash(task.id)}>
                <FiTrash size={22} color='#ff3131' />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
export default Shorthand;
