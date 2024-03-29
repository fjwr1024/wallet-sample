/* eslint-disable no-unused-expressions */
import {
  Box,
  Heading,
  Progress,
  Text,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import CopyToClipboardButton from '@/components/CopyToClipboardButton';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useQueryUser } from '@/hooks/useQueryUser';
import { SolNativeData } from '@/types/Solana';
import { SOL_RATE } from '@/utils/constValue';

const Page: NextPage = () => {
  const { useQueryUserData, useQueryGetSol } = useQueryUser();
  const { data: user, status } = useQueryUserData();
  const [solData, setSolData] = useState<SolNativeData | string | undefined>(
    undefined
  );

  useEffect(() => {
    if (user?.walletAddress) {
      useQueryGetSol.mutate(user.walletAddress, {
        onSuccess: (
          data: React.SetStateAction<SolNativeData | string | undefined>
        ) => {
          setSolData(data);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (status === 'loading') return <Progress my="lg" color="cyan" />;

  return (
    <Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <Heading>Home画面</Heading>
        <Box>
          <QRCodeGenerator qrText={user?.walletAddress as string} />
          <CopyToClipboardButton textToCopy={user?.walletAddress as string} />

          {solData && typeof solData !== 'string' && (
            <React.Fragment>
              <Box>
                <Heading>Sol Information</Heading>
                <Text>Sol: {solData.sol.toFixed(2)}</Text>
              </Box>
              <Box>
                <Heading>Price Information</Heading>
                <Text>
                  USD: {(solData.sol * SOL_RATE.solana.usd).toFixed(2)}
                </Text>
                <Text>
                  JPY: {(solData.sol * SOL_RATE.solana.jpy).toFixed(2)}
                </Text>
              </Box>
              <Box mt={10}>
                <Link href="/nft">nft画面へ</Link>
              </Box>
            </React.Fragment>
          )}

          <Box>
            {user?.walletAddress && (
              <ChakraLink
                color="blue"
                href={`https://solscan.io/account/${user.walletAddress}?cluster=devnet`}
                isExternal
              >
                View on Solscan your Wallet
              </ChakraLink>
            )}
          </Box>
        </Box>
      </main>
    </Fragment>
  );
};

export default Page;
