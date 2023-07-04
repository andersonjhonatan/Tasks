import React from 'react';
import Image from 'next/image';
import Oops from '@/public/home/Oops.svg';
import styles from '@/src/components/Erro/erro.module.css';
import Link from 'next/link';

const Erro = () => {
  return (
    <div className={styles.container}>
      <Image src={Oops} alt='erro' className={styles.erro} />
      <h2 className={styles.title}>Página não encontrada</h2>
      <Link href={'/'} className={styles.link}>
        Go Back
      </Link>
    </div>
  );
};

export default Erro;
