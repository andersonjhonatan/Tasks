import Image from 'next/image';
import React from 'react';
import sloganHome from '@/public/home/home1.svg';
import styles from './index.module.css';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { db } from '@/src/services/firebaseConnection';
import { collection, getDocs } from 'firebase/firestore';


interface PropsHome {
  comentarios: number;
  post: number;
}
export default function AppHome({ comentarios, post }: PropsHome){
  return (
    <div>
      <section className={styles.container}>
        <Head>
          <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
        </Head>
        <article className={styles.slogan}>
          <Image src={sloganHome} alt='imagem-principal' width={500} priority />
          <p className={styles.sloganText}>
            Sistema feito para você organizar seus estudos e tarefas{' '}
          </p>
        </article>
        <article className={styles.post}>
          <p className={styles.postTitle}>+{post} Posts</p>

          <p className={styles.postTitle}>+{comentarios} Comentários</p>
        </article>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const comentRef = collection(db, 'comentarios');
  const postRef = collection(db, 'tarefas');

  const comentSnapShot = await getDocs(comentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    props: {
      post: postSnapshot.size || 0,
      comentarios: comentSnapShot.size || 0,
    },
    revalidate: 60,
  };
};
