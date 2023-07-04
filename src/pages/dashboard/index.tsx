import Header from '@/src/components/Header/Header';
import Dashboard from '@/src/components/Dashoboard/Dashboard';
import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  };
};
