import React, { useEffect } from 'react';
import Head from 'next/head';
import styles from './task.module.css';
import { GetServerSideProps } from 'next';
import { db } from '@/src/services/firebaseConnection';
import {
  collection,
  doc,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

import TextAra from '@/src/components/TextArea/TextAra';
import { useSession } from 'next-auth/react';
import { FiTrash } from 'react-icons/fi';
import { useState, ChangeEvent } from 'react';

interface TaskProps {
  task: {
    tarefa: string;
    public: boolean;
    create: string;
    user?: string;
    taskId: string;
  };
  allComments: TaskComentsProps[];
}

interface TaskComentsProps {
  id: string;
  comment: string;
  created: string;
  name: string;
  taskId: string;
  user?: string;
}
export default function IdTask({ task, allComments }: TaskProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [comment, setComment] = useState<TaskComentsProps[]>(allComments || []);

  function handleInput({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) {
    setInput(value);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === '') return;
    if (!session?.user?.name || !session?.user?.email) return;

    try {
      const addRef = await addDoc(collection(db, 'comentarios'), {
        comment: input as string,
        created: new Date(),
        name: session?.user?.name,
        taskId: task?.taskId,
        user: session?.user?.email,
      });

      const data = {
        id: addRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task?.taskId,
        created: new Date().toLocaleDateString(),
      };

      setComment([...comment, data]);
      setInput('');
    } catch (error) {
      console.log(error);
    }
  }

  const handleTraser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'comentarios', id));
      setComment(comment.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setComment(allComments);
  }, [allComments]);

  return (
    <div>
      <Head>
        <title>Detalhes da Tarefa</title>
      </Head>

      <main className={styles.container}>
        <h1>Detalhes da Tarefa</h1>
        <article className={styles.article}>
          <p className={styles.tarefa}>{task.tarefa}</p>
        </article>
      </main>

      <section className={styles.containerDetailsComents}>
        <h2>Deixar um comentário</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextAra
            placeholder='Digite seu comentário'
            className={styles.textArea}
            value={input}
            onChange={handleInput}
          />
          <button type='submit' disabled={!session?.user}>
            Enviar comentário
          </button>
        </form>
      </section>

      <section className={styles.containerDetailsComentss}>
        <h2 className={styles.titleComent}>Todos os comentários</h2>
        {comment.length === 0 && <p className={styles.message}>Nenhum comentário encontrado</p>}

        {comment.map((item) => (
          <div key={item.id} className={styles.containerComents}>
            <section className={styles.sectionComents}>
              <p>{item.comment} </p>
              {item.user === session?.user?.email && (
                <button type='button' onClick={() => handleTraser(item.id)}>
                  <FiTrash color='red' />
                </button>
              )}
            </section>
            <p className={styles.name}>{item.name}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const q = query(collection(db, 'comentarios'), where('taskId', '==', id));

  const snapshotComents = await getDocs(q);

  let allComments: TaskComentsProps[] = [];

  snapshotComents.forEach((doc) => {
    const data = doc.data();
    allComments.push({
      id: doc.id,
      comment: data.comment,
      name: data.name,
      taskId: data.taskId,
      user: data.user || '',
      created: data.created.toDate().toISOString(),
    });
  });

  const docRef = doc(db, 'tarefas', id);

  const snapshot = await getDoc(docRef);

  if (!snapshot.data()) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }

  const miliSeconds = snapshot.data()?.create?.seconds * 1000;
  const date = new Date(miliSeconds).toLocaleDateString();

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    create: date,
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      task,
      allComments,
    },
  };
};
