import Header from '@/src/components/Header/Header';
import Dashboard from '@/src/components/Dashoboard/Dashboard';
import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

/* export interface HomeProps {
  user: {
    name: string;
  }
} */
export default function ShortHand() {
  return (
    <>
      <Dashboard />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: {
        name: session.user.name,
      }
    },
  };
};
