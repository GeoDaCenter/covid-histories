import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { getListOfCalls } from "./api/calls/_s3_utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const numbers = await getListOfCalls();

  return {
    props: { numbers }, // will be passed to the page component as props
  };
};

interface CallsProps {
  numbers: Array<string>;
}

const Calls: NextPage<CallsProps> = ({ numbers }) => {
  console.log("numbers are ", numbers)
  return (
    <div className={styles.container}>
      <h1>Calls</h1>
      <ul>
        {numbers.map((number: string) => (
          <li key={number}>
            <Link href={`/calls/${encodeURIComponent(number)}`}>{number}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calls;
