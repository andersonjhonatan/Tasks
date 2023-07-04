import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import styles from '../Header/header.module.css';
const Header = () => {
  const { data: session, status } = useSession();
  return (
    <header className={styles.container}>
      <nav className={styles.navContainer}>
        <Link href={'/'} className={styles.logo}>
          <h1>Tarefas</h1>
          <span>+</span>
        </Link>
        {session?.user && (
          <Link href={'/dashboard'} className={styles.buttonPainel}>
            Painel
          </Link>
        )}
      </nav>
      {status === 'loading' ? (
        <></>
      ) : session ? (
        <button className={styles.buttonAcessar} onClick={() => signOut()}>
          Olá {session?.user?.name}
        </button>
      ) : (
        <button className={styles.buttonAcessar} onClick={() => signIn()}>
          Acessar
        </button>
      )}
    </header>
  );
};

export default Header;
